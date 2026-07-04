import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TOTAL_USERS = parseInt(__ENV.TOTAL_USERS || '100');
const DURATION = __ENV.DURATION || '2m';

export const options = {
  stages: [
    { duration: '30s', target: TOTAL_USERS / 2 }, // Ramp up
    { duration: '1m', target: TOTAL_USERS }, // Stay at max
    { duration: '30s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

// Store auth tokens per VU
const authTokens = {};

export default function () {
  const vuId = `vu_${__VU}_${Date.now()}`;

  group('1. Health Check', () => {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      'status 200': (r) => r.status === 200,
      'response contains "live"': (r) => r.body.includes('live'),
    });
  });

  sleep(0.5);

  group('2. Register User', () => {
    const email = `load_${vuId}@test.com`;
    const payload = {
      name: `Load Tester ${__VU}`,
      email: email,
      password: 'LoadTest123!',
    };

    const res = http.post(
      `${BASE_URL}/api/users/register`,
      JSON.stringify(payload),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    check(res, {
      'register status 201': (r) => r.status === 201,
      'register has token': (r) => r.json('token') !== undefined,
    });

    if (res.status === 201) {
      authTokens[vuId] = res.json('token');
    }
  });

  sleep(0.5);

  group('3. Login', () => {
    const email = `load_${vuId}@test.com`;
    const payload = {
      email: email,
      password: 'LoadTest123!',
    };

    const res = http.post(
      `${BASE_URL}/api/users/login`,
      JSON.stringify(payload),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    check(res, {
      'login status 200': (r) => r.status === 200,
      'login has token': (r) => r.json('token') !== undefined,
    });

    if (res.status === 200) {
      authTokens[vuId] = res.json('token');
    }
  });

  sleep(0.5);

  if (authTokens[vuId]) {
    group('4. Get User Data', () => {
      const res = http.get(`${BASE_URL}/api/users/data`, {
        headers: {
          Authorization: `Bearer ${authTokens[vuId]}`,
          'Content-Type': 'application/json',
        },
      });

      check(res, {
        'get user status 200': (r) => r.status === 200,
        'get user has email': (r) => r.json('user.email') !== undefined,
      });
    });

    sleep(0.5);

    group('5. Create Resume', () => {
      const payload = {
        title: `Load Test Resume ${__VU}`,
        template: 'classic',
      };

      const res = http.post(
        `${BASE_URL}/api/resumes/create`,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${authTokens[vuId]}`,
            'Content-Type': 'application/json',
          },
        }
      );

      check(res, {
        'create resume status 201': (r) => r.status === 201,
        'create resume has id': (r) => r.json('resume._id') !== undefined,
      });

      if (res.status === 201) {
        const resumeId = res.json('resume._id');

        sleep(0.3);

        group('6. Update Resume', () => {
          const updatePayload = {
            title: `Load Test Resume ${__VU} Updated`,
            professional_summary: 'Load test professional summary',
            skills: ['nodejs', 'javascript', 'testing'],
            personal_info: {
              full_name: `Load Tester ${__VU}`,
              email: `load_${vuId}@test.com`,
              profession: 'QA Engineer',
              location: 'Load Test City',
            },
          };

          const updateRes = http.put(
            `${BASE_URL}/api/resumes/update`,
            JSON.stringify(updatePayload),
            {
              headers: {
                Authorization: `Bearer ${authTokens[vuId]}`,
                'Content-Type': 'application/json',
              },
              params: { id: resumeId },
            }
          );

          check(updateRes, {
            'update resume status 200': (r) => r.status === 200,
            'update resume saved': (r) => r.json('resume.professional_summary') !== undefined,
          });
        });

        sleep(0.3);

        group('7. ATS Score', () => {
          const atsPayload = {
            resumeId: resumeId,
            jobDescription: 'Looking for nodejs developer with javascript and testing skills',
          };

          const atsRes = http.post(
            `${BASE_URL}/api/ai/ats-score`,
            JSON.stringify(atsPayload),
            {
              headers: {
                Authorization: `Bearer ${authTokens[vuId]}`,
                'Content-Type': 'application/json',
              },
            }
          );

          check(atsRes, {
            'ats score status 200': (r) => r.status === 200,
            'ats has score': (r) => r.json('atsScore') !== undefined,
          });
        });

        sleep(0.3);

        group('8. Delete Resume', () => {
          const deleteRes = http.delete(
            `${BASE_URL}/api/resumes/delete/${resumeId}`,
            {
              headers: {
                Authorization: `Bearer ${authTokens[vuId]}`,
                'Content-Type': 'application/json',
              },
            }
          );

          check(deleteRes, {
            'delete resume status 200': (r) => r.status === 200,
          });
        });
      }
    });
  }

  sleep(1);
}
