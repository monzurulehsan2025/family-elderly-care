/**
 * CareNexus Partner Platform - REST API Verification Suite
 * Tests all 5 REST endpoints against the live HTTP gateway.
 */

const http = require('http');

const BASE_URL = 'http://127.0.0.1:3000';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n========================================');
  console.log(' Starting RESTful API Automated Verification');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  async function assert(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await assert('GET /api/v1/health returns 200 OK & healthy status', async () => {
    const res = await makeRequest('GET', '/api/v1/health');
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (res.data.status !== 'healthy') throw new Error(`Expected status 'healthy'`);
  });

  // 2. Endpoint 1: GET /api/v1/caregivers
  await assert('GET /api/v1/caregivers returns array of family caregivers', async () => {
    const res = await makeRequest('GET', '/api/v1/caregivers');
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!Array.isArray(res.data.data)) throw new Error('Expected data to be array');
    if (res.data.data.length < 5) throw new Error('Expected at least 5 caregivers');
    const first = res.data.data[0];
    if (!first.id || !first.fullName || !first.programEnrollment) {
      throw new Error('Caregiver schema validation failed');
    }
  });

  // 3. Endpoint 1 Detail: GET /api/v1/caregivers/cg-101
  await assert('GET /api/v1/caregivers/:id returns single caregiver with linked recipient & logs', async () => {
    const res = await makeRequest('GET', '/api/v1/caregivers/cg-101');
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (res.data.data.id !== 'cg-101') throw new Error(`Expected id 'cg-101'`);
    if (!res.data.data.careRecipient) throw new Error('Expected linked careRecipient object');
  });

  // 4. Endpoint 2: GET /api/v1/care-recipients
  await assert('GET /api/v1/care-recipients returns care recipients with functional ADL scorecards', async () => {
    const res = await makeRequest('GET', '/api/v1/care-recipients');
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!Array.isArray(res.data.data)) throw new Error('Expected array of recipients');
    const first = res.data.data[0];
    if (!first.adlScores || !first.adlScores.bathing || !first.acuityTier) {
      throw new Error('ADL scorecard schema validation failed');
    }
  });

  // 5. Endpoint 3: POST & GET /api/v1/care-logs
  await assert('POST /api/v1/care-logs creates new observation log (201 Created)', async () => {
    const payload = {
      caregiverId: "cg-101",
      careRecipientId: "cr-201",
      shiftType: "Morning",
      recipientMood: "Calm & Cooperative",
      adlsCompleted: ["Morning Medications", "Breakfast Prep", "Blood Glucose Check"],
      medicationAdherence: "Full - All doses taken on time",
      vitals: {
        bloodPressure: "125/80",
        heartRate: 72,
        bloodGlucose: 110,
        temperature: 98.4
      },
      hoursOfSleep: 8.0,
      behavioralObservations: "Test log submitted by automated verification suite.",
      flaggedForCoach: false
    };

    const res = await makeRequest('POST', '/api/v1/care-logs', payload);
    if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
    if (!res.data.data.id.startsWith('log-')) throw new Error('Expected generated log id');
  });

  // 6. Endpoint 4: POST /api/v1/coaching/sessions
  await assert('POST /api/v1/coaching/sessions schedules clinical telehealth consultation (201 Created)', async () => {
    const payload = {
      caregiverId: "cg-103",
      coachName: "Elena Rostova, BSN",
      coachTitle: "Chronic Disease Management Coach",
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      durationMinutes: 45,
      sessionType: "Nutritional & Renal Diet Optimization",
      caregiverBurnoutScore: 2,
      clinicalSummary: "Reviewing diabetic meal plan adherence and daily dry weight tracker."
    };

    const res = await makeRequest('POST', '/api/v1/coaching/sessions', payload);
    if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
    if (!res.data.data.id.startsWith('cs-')) throw new Error('Expected generated session id');
  });

  // 7. Endpoint 5: POST /api/v1/partner/referrals
  await assert('POST /api/v1/partner/referrals ingests partner referral & generates intake record (201 Created)', async () => {
    const payload = {
      referringPartner: "MetroHealth Integrated Care Network",
      referrerContact: "Dr. Rachel Zhang, MD (Discharge Coordination)",
      patientName: "Eleanor Montgomery",
      patientAge: 79,
      patientDob: "1947-05-14",
      prospectiveCaregiverName: "David Montgomery",
      caregiverRelationship: "Son",
      caregiverPhone: "(555) 890-1234",
      caregiverEmail: "david.m@outlook.com",
      insurancePayer: "Anthem BlueCross BlueShield Medicaid LTSS",
      programRequested: "Structured Family Caregiving (SFC) Tier 2",
      clinicalSummary: "Test partner referral ingested from automated suite."
    };

    const res = await makeRequest('POST', '/api/v1/partner/referrals', payload);
    if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
    if (!res.data.data.id.startsWith('ref-')) throw new Error('Expected generated referral id');
  });

  // 8. Stats Overview: GET /api/v1/stats/overview
  await assert('GET /api/v1/stats/overview returns aggregate partner dashboard KPIs (200 OK)', async () => {
    const res = await makeRequest('GET', '/api/v1/stats/overview');
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!res.data.success || !res.data.data) throw new Error('Expected success true with stats payload');
    const { totalCaregivers, totalRecipients, avgWellnessScore, pendingReferrals, totalCareLogs } = res.data.data;
    if (typeof totalCaregivers !== 'number' || totalCaregivers <= 0) throw new Error('Invalid totalCaregivers in stats');
    if (typeof totalRecipients !== 'number' || totalRecipients <= 0) throw new Error('Invalid totalRecipients in stats');
    if (typeof avgWellnessScore !== 'number' || avgWellnessScore < 0 || avgWellnessScore > 100) throw new Error('Invalid avgWellnessScore');
    if (typeof pendingReferrals !== 'number') throw new Error('Invalid pendingReferrals in stats');
    if (typeof totalCareLogs !== 'number' || totalCareLogs <= 0) throw new Error('Invalid totalCareLogs in stats');
  });

  // 9. Error Handling & Validation: POST /api/v1/care-logs with missing required fields
  await assert('POST /api/v1/care-logs rejects malformed payload with 400 Bad Request', async () => {
    const invalidPayload = {
      // Intentionally missing caregiverId, careRecipientId, and adlsCompleted
      shiftType: "Morning",
      recipientMood: "Calm & Cooperative"
    };

    const res = await makeRequest('POST', '/api/v1/care-logs', invalidPayload);
    if (res.status !== 400) throw new Error(`Expected status 400 Bad Request, got ${res.status}`);
    if (res.data.success !== false) throw new Error('Expected success: false in validation error response');
    if (!res.data.error || !res.data.error.includes('Missing required fields')) {
      throw new Error(`Expected descriptive error message, got: ${res.data.error}`);
    }
  });

  // 10. Query Filtering: GET /api/v1/caregivers with status and search query params
  await assert('GET /api/v1/caregivers?status=Active&search=Rodriguez returns filtered matches', async () => {
    const res = await makeRequest('GET', '/api/v1/caregivers?status=Active&search=Rodriguez');
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Expected array of matching caregivers');
    if (res.data.data.length === 0) throw new Error('Expected at least 1 match for Rodriguez');
    const matched = res.data.data[0];
    if (!matched.fullName.includes('Rodriguez') || matched.status !== 'Active') {
      throw new Error('Filtering criteria not satisfied in query response');
    }
  });

  // 11. Resource Not Found: GET /api/v1/caregivers/non-existent-id returns 404
  await assert('GET /api/v1/caregivers/:invalidId returns 404 Not Found', async () => {
    const res = await makeRequest('GET', '/api/v1/caregivers/cg-99999');
    if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
    if (res.data.success !== false) throw new Error('Expected success: false in 404 response');
    if (!res.data.error || !res.data.error.includes('not found')) {
      throw new Error(`Expected error message mentioning 'not found', got: ${res.data.error}`);
    }
  });

  console.log('\n========================================');
  console.log(` Summary: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// If executed directly, run tests
if (require.main === module) {
  runTests().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
