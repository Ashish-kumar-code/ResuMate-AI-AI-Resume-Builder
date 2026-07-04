import autocannon from 'autocannon';
import http from 'http';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const NUM_CONNECTIONS = parseInt(process.env.NUM_CONNECTIONS || '100');
const DURATION = parseInt(process.env.DURATION || '120');

// Parse URL
const urlObj = new URL(BASE_URL);
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: NUM_CONNECTIONS,
});

const instance = autocannon(
  {
    url: BASE_URL,
    connections: NUM_CONNECTIONS,
    duration: DURATION,
    pipelining: 1,
    requests: [
      {
        path: '/',
        method: 'GET',
      },
      {
        path: '/api/users/register',
        method: 'POST',
        body: JSON.stringify({
          name: 'Load Tester',
          email: `load${Date.now()}@test.com`,
          password: 'LoadTest123!',
        }),
        headers: {
          'content-type': 'application/json',
        },
      },
      {
        path: '/api/users/login',
        method: 'POST',
        body: JSON.stringify({
          email: `load${Date.now()}@test.com`,
          password: 'LoadTest123!',
        }),
        headers: {
          'content-type': 'application/json',
        },
      },
      {
        path: '/',
        method: 'GET',
      },
    ],
    agent,
    setupClient: setupClient,
  },
  finishedFn
);

function setupClient(client) {
  client.on('response', (statusCode, resBytes, responseTime) => {
    // Track response times
  });
}

function finishedFn(err, res) {
  if (err) {
    console.error('Load test error:', err);
    process.exit(1);
  }

  console.log('\n=== Load Test Results ===');
  console.log(`Total requests: ${res.requests.total}`);
  console.log(`Requests/sec: ${res.requests.average}`);
  console.log(`Total errors: ${res.errors}`);
  console.log(`Average response time: ${res.latency.mean.toFixed(2)}ms`);
  console.log(`p50 latency: ${res.latency.p50}ms`);
  console.log(`p95 latency: ${res.latency.p95}ms`);
  console.log(`p99 latency: ${res.latency.p99}ms`);
  console.log(`Throughput: ${res.throughput.average.toFixed(2)} bytes/sec`);

  if (res.errors > 0) {
    console.log('\nError details:', res.errors);
  }

  process.exit(res.errors > 0 ? 1 : 0);
}

autocannon.track(instance, { renderProgressBar: true });
