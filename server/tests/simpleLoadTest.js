import http from 'http';

const BASE_URL = 'http://localhost:3000';
const NUM_USERS = 100;
const DURATION_SECONDS = 120;
const REQ_RATE = 10; // requests per user per test

const stats = {
  totalRequests: 0,
  successRequests: 0,
  failedRequests: 0,
  startTime: Date.now(),
  responseTimes: [],
  statusCodes: {},
};

async function makeRequest(method = 'GET', path = '/') {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        stats.totalRequests++;
        stats.responseTimes.push(responseTime);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          stats.successRequests++;
        } else {
          stats.failedRequests++;
        }
        stats.statusCodes[res.statusCode] = (stats.statusCodes[res.statusCode] || 0) + 1;
        resolve({ statusCode: res.statusCode, responseTime });
      });
    });

    req.on('error', (err) => {
      stats.totalRequests++;
      stats.failedRequests++;
      resolve({ statusCode: 0, error: err.message, responseTime: Date.now() - startTime });
    });

    req.on('timeout', () => {
      req.destroy();
      stats.totalRequests++;
      stats.failedRequests++;
      resolve({ statusCode: 0, error: 'timeout', responseTime: Date.now() - startTime });
    });

    if (method !== 'GET') {
      if (path.includes('register') || path.includes('login')) {
        req.write(JSON.stringify({
          name: 'Load Tester',
          email: `load${Date.now() * Math.random()}@test.com`,
          password: 'LoadTest123!',
        }));
      }
    }
    req.end();
  });
}

async function simulateUser(userId) {
  const endTime = Date.now() + DURATION_SECONDS * 1000;
  let requestCount = 0;

  while (Date.now() < endTime) {
    try {
      await makeRequest('GET', '/');
      await makeRequest('POST', '/api/users/register');
      await makeRequest('POST', '/api/users/login');
      requestCount += 3;

      if (requestCount >= REQ_RATE) {
        break;
      }

      // Small delay between requests
      await new Promise((r) => setTimeout(r, Math.random() * 500 + 100));
    } catch (err) {
      console.error(`User ${userId} error:`, err.message);
    }
  }
}

async function runLoadTest() {
  console.log(`=== Load Test Started ===`);
  console.log(`Total Users: ${NUM_USERS}`);
  console.log(`Duration: ${DURATION_SECONDS} seconds`);
  console.log(`Target: ${BASE_URL}`);
  console.log('Starting requests...\n');

  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    users.push(simulateUser(i));
  }

  // Run all users concurrently
  await Promise.all(users);

  const elapsedTime = (Date.now() - stats.startTime) / 1000;

  // Calculate statistics
  const avgResponseTime = stats.responseTimes.length > 0
    ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
    : 0;

  const sortedTimes = [...stats.responseTimes].sort((a, b) => a - b);
  const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

  console.log('\n=== Load Test Results ===\n');
  console.log(`Elapsed Time: ${elapsedTime.toFixed(2)}s`);
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Successful: ${stats.successRequests}`);
  console.log(`Failed: ${stats.failedRequests}`);
  console.log(`Success Rate: ${((stats.successRequests / stats.totalRequests) * 100).toFixed(2)}%`);
  console.log(`Requests/sec: ${(stats.totalRequests / elapsedTime).toFixed(2)}`);
  console.log(`\nResponse Times:`);
  console.log(`  Average: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`  p50: ${p50}ms`);
  console.log(`  p95: ${p95}ms`);
  console.log(`  p99: ${p99}ms`);
  console.log(`  Min: ${Math.min(...stats.responseTimes)}ms`);
  console.log(`  Max: ${Math.max(...stats.responseTimes)}ms`);
  console.log(`\nStatus Code Distribution:`);
  Object.entries(stats.statusCodes).forEach(([code, count]) => {
    console.log(`  ${code}: ${count}`);
  });

  process.exit(stats.failedRequests > 0 ? 1 : 0);
}

runLoadTest();
