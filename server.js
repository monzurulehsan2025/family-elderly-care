/**
 * CareNexus Partner Platform - RESTful API & Static Web Server
 * Implements high-performance SOA REST endpoints for Caregiver Management,
 * Care Recipient Health Tracking, Daily Care Observations, Clinical Coaching,
 * and Healthcare Partner Referrals.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const {
  initialCaregivers,
  initialCareRecipients,
  initialCareLogs,
  initialCoachingSessions,
  initialPartnerReferrals
} = require('./data/mockData');

// In-memory data store with initial realistic state
let caregivers = JSON.parse(JSON.stringify(initialCaregivers));
let careRecipients = JSON.parse(JSON.stringify(initialCareRecipients));
let careLogs = JSON.parse(JSON.stringify(initialCareLogs));
let coachingSessions = JSON.parse(JSON.stringify(initialCoachingSessions));
let partnerReferrals = JSON.parse(JSON.stringify(initialPartnerReferrals));

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

function sendJsonResponse(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=UTF-8' });
  res.end(JSON.stringify(data, null, 2));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Protect against flood
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', err => reject(err));
  });
}

function serveStaticFile(req, res, pathname) {
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Return 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Content-Length': stats.size
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const method = req.method.toUpperCase();

  // Handle preflight
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    return res.end();
  }

  // API Route Dispatcher
  if (pathname.startsWith('/api/v1/')) {
    try {
      // 1. Health Check
      if (pathname === '/api/v1/health' && method === 'GET') {
        return sendJsonResponse(res, 200, {
          status: 'healthy',
          service: 'carenexus-api-gateway',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          uptimeSeconds: Math.floor(process.uptime())
        });
      }

      // 2. Stats Overview for Partner Dashboard
      if (pathname === '/api/v1/stats/overview' && method === 'GET') {
        const totalCaregivers = caregivers.length;
        const totalRecipients = careRecipients.length;
        const avgWellness = Math.round(
          caregivers.reduce((acc, c) => acc + (c.wellnessScore || 0), 0) / (totalCaregivers || 1)
        );
        const pendingReferrals = partnerReferrals.filter(r => !r.authorizationStatus.includes('Authorized')).length;
        const totalCareLogs = careLogs.length;
        const flaggedLogs = careLogs.filter(l => l.flaggedForCoach).length;
        const scheduledCoaching = coachingSessions.filter(s => s.status === 'Scheduled').length;

        return sendJsonResponse(res, 200, {
          success: true,
          data: {
            totalCaregivers,
            totalRecipients,
            avgWellnessScore: avgWellness,
            pendingReferrals,
            totalCareLogs,
            flaggedLogsCount: flaggedLogs,
            scheduledCoachingSessions: scheduledCoaching
          }
        });
      }

      // 3. Endpoint 1: CAREGIVERS (`/api/v1/caregivers`)
      if (pathname === '/api/v1/caregivers' && method === 'GET') {
        let results = [...caregivers];
        if (query.status) {
          results = results.filter(c => c.status.toLowerCase() === query.status.toLowerCase());
        }
        if (query.search) {
          const q = query.search.toLowerCase();
          results = results.filter(
            c => c.fullName.toLowerCase().includes(q) ||
                 c.programEnrollment.toLowerCase().includes(q) ||
                 c.careRecipientName.toLowerCase().includes(q) ||
                 c.cityState.toLowerCase().includes(q)
          );
        }
        return sendJsonResponse(res, 200, {
          success: true,
          count: results.length,
          data: results
        });
      }

      const caregiverDetailMatch = pathname.match(/^\/api\/v1\/caregivers\/([a-zA-Z0-9_-]+)$/);
      if (caregiverDetailMatch && method === 'GET') {
        const id = caregiverDetailMatch[1];
        const caregiver = caregivers.find(c => c.id === id);
        if (!caregiver) {
          return sendJsonResponse(res, 404, { success: false, error: `Caregiver with ID '${id}' not found` });
        }
        // Link recipient and recent logs
        const recipient = careRecipients.find(r => r.id === caregiver.careRecipientId) || null;
        const recentLogs = careLogs.filter(l => l.caregiverId === id);
        const sessions = coachingSessions.filter(s => s.caregiverId === id);

        return sendJsonResponse(res, 200, {
          success: true,
          data: {
            ...caregiver,
            careRecipient: recipient,
            recentCareLogs: recentLogs,
            coachingSessions: sessions
          }
        });
      }

      // 4. Endpoint 2: CARE RECIPIENTS (`/api/v1/care-recipients`)
      if (pathname === '/api/v1/care-recipients' && method === 'GET') {
        let results = [...careRecipients];
        if (query.acuity) {
          results = results.filter(r => r.acuityTier.toLowerCase().includes(query.acuity.toLowerCase()));
        }
        if (query.search) {
          const q = query.search.toLowerCase();
          results = results.filter(
            r => r.fullName.toLowerCase().includes(q) ||
                 r.primaryConditions.some(c => c.toLowerCase().includes(q)) ||
                 r.caregiverName.toLowerCase().includes(q)
          );
        }
        return sendJsonResponse(res, 200, {
          success: true,
          count: results.length,
          data: results
        });
      }

      const recipientDetailMatch = pathname.match(/^\/api\/v1\/care-recipients\/([a-zA-Z0-9_-]+)$/);
      if (recipientDetailMatch && method === 'GET') {
        const id = recipientDetailMatch[1];
        const recipient = careRecipients.find(r => r.id === id);
        if (!recipient) {
          return sendJsonResponse(res, 404, { success: false, error: `Care Recipient with ID '${id}' not found` });
        }
        return sendJsonResponse(res, 200, {
          success: true,
          data: recipient
        });
      }

      // 5. Endpoint 3: CARE LOGS (`/api/v1/care-logs`)
      if (pathname === '/api/v1/care-logs') {
        if (method === 'GET') {
          let results = [...careLogs];
          if (query.caregiverId) {
            results = results.filter(l => l.caregiverId === query.caregiverId);
          }
          if (query.flagged === 'true') {
            results = results.filter(l => l.flaggedForCoach === true);
          }
          // Sort latest first
          results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          return sendJsonResponse(res, 200, {
            success: true,
            count: results.length,
            data: results
          });
        }

        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.caregiverId || !body.careRecipientId || !body.adlsCompleted) {
            return sendJsonResponse(res, 400, {
              success: false,
              error: 'Missing required fields: caregiverId, careRecipientId, adlsCompleted'
            });
          }

          const caregiver = caregivers.find(c => c.id === body.caregiverId);
          const recipient = careRecipients.find(r => r.id === body.careRecipientId);

          const newLog = {
            id: `log-${Date.now().toString().slice(-4)}`,
            caregiverId: body.caregiverId,
            caregiverName: caregiver ? caregiver.fullName : body.caregiverName || 'Caregiver User',
            careRecipientId: body.careRecipientId,
            careRecipientName: recipient ? recipient.fullName : body.careRecipientName || 'Care Recipient',
            timestamp: body.timestamp || new Date().toISOString(),
            shiftType: body.shiftType || 'Morning',
            recipientMood: body.recipientMood || 'Calm & Cooperative',
            adlsCompleted: Array.isArray(body.adlsCompleted) ? body.adlsCompleted : [body.adlsCompleted],
            medicationAdherence: body.medicationAdherence || 'Full - Administered on schedule',
            vitals: body.vitals || {
              bloodPressure: '120/80',
              heartRate: 72,
              bloodGlucose: 105,
              temperature: 98.6
            },
            hoursOfSleep: Number(body.hoursOfSleep) || 7.0,
            behavioralObservations: body.behavioralObservations || 'Routine care day with no complications.',
            incidentReported: Boolean(body.incidentReported),
            incidentDetails: body.incidentDetails || null,
            flaggedForCoach: Boolean(body.flaggedForCoach),
            coachReviewStatus: body.flaggedForCoach ? 'Action Required' : 'Pending Review'
          };

          careLogs.unshift(newLog);

          // Update caregiver last check-in
          if (caregiver) {
            caregiver.lastCheckIn = newLog.timestamp;
          }

          return sendJsonResponse(res, 201, {
            success: true,
            message: 'Daily Care Log recorded successfully',
            data: newLog
          });
        }
      }

      // 6. Endpoint 4: COACHING SESSIONS (`/api/v1/coaching/sessions`)
      if (pathname === '/api/v1/coaching/sessions') {
        if (method === 'GET') {
          let results = [...coachingSessions];
          if (query.caregiverId) {
            results = results.filter(s => s.caregiverId === query.caregiverId);
          }
          if (query.status) {
            results = results.filter(s => s.status.toLowerCase() === query.status.toLowerCase());
          }
          results.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
          return sendJsonResponse(res, 200, {
            success: true,
            count: results.length,
            data: results
          });
        }

        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.caregiverId || !body.sessionType || !body.scheduledDate) {
            return sendJsonResponse(res, 400, {
              success: false,
              error: 'Missing required fields: caregiverId, sessionType, scheduledDate'
            });
          }

          const caregiver = caregivers.find(c => c.id === body.caregiverId);

          const newSession = {
            id: `cs-${Date.now().toString().slice(-4)}`,
            caregiverId: body.caregiverId,
            caregiverName: caregiver ? caregiver.fullName : body.caregiverName || 'Caregiver',
            coachId: body.coachId || 'coach-01',
            coachName: body.coachName || (caregiver ? caregiver.assignedCoach : 'Sarah Jenkins, RN'),
            coachTitle: body.coachTitle || 'Clinical Care Coach',
            scheduledDate: body.scheduledDate,
            durationMinutes: Number(body.durationMinutes) || 45,
            sessionType: body.sessionType,
            caregiverBurnoutScore: Number(body.caregiverBurnoutScore) || 3,
            burnoutCategory: (Number(body.caregiverBurnoutScore) >= 7) ? 'Elevated Risk - High Strain' : 'Low/Moderate Risk',
            clinicalSummary: body.clinicalSummary || 'Scheduled clinical coaching telehealth session.',
            actionItems: Array.isArray(body.actionItems) ? body.actionItems : (body.actionItems ? [body.actionItems] : []),
            status: body.status || 'Scheduled'
          };

          coachingSessions.unshift(newSession);

          return sendJsonResponse(res, 201, {
            success: true,
            message: 'Clinical Coaching Session scheduled successfully',
            data: newSession
          });
        }
      }

      // 7. Endpoint 5: PARTNER REFERRALS (`/api/v1/partner/referrals`)
      if (pathname === '/api/v1/partner/referrals') {
        if (method === 'GET') {
          let results = [...partnerReferrals];
          if (query.status) {
            results = results.filter(r => r.authorizationStatus.toLowerCase().includes(query.status.toLowerCase()));
          }
          if (query.priority) {
            results = results.filter(r => r.priorityLevel.toLowerCase() === query.priority.toLowerCase());
          }
          return sendJsonResponse(res, 200, {
            success: true,
            count: results.length,
            data: results
          });
        }

        if (method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.referringPartner || !body.patientName || !body.prospectiveCaregiverName) {
            return sendJsonResponse(res, 400, {
              success: false,
              error: 'Missing required fields: referringPartner, patientName, prospectiveCaregiverName'
            });
          }

          const newReferral = {
            id: `ref-${Date.now().toString().slice(-4)}`,
            referringPartner: body.referringPartner,
            referrerContact: body.referrerContact || 'Intake Officer',
            referrerEmail: body.referrerEmail || 'intake@partnerhealth.org',
            patientName: body.patientName,
            patientDob: body.patientDob || '1950-01-01',
            patientAge: Number(body.patientAge) || 75,
            prospectiveCaregiverName: body.prospectiveCaregiverName,
            caregiverRelationship: body.caregiverRelationship || 'Family Caregiver',
            caregiverPhone: body.caregiverPhone || '(555) 000-0000',
            caregiverEmail: body.caregiverEmail || 'caregiver@example.com',
            insurancePayer: body.insurancePayer || 'State Medicaid / Medicare Advantage',
            programRequested: body.programRequested || 'Structured Family Caregiving (SFC)',
            clinicalSummary: body.clinicalSummary || 'Patient in need of in-home family caregiver support and clinical coaching.',
            priorityLevel: body.priorityLevel || 'Standard',
            referralDate: body.referralDate || new Date().toISOString().split('T')[0],
            authorizationStatus: 'New Intake Received',
            estimatedMonthlyStipend: body.estimatedMonthlyStipend || '$1,950.00',
            assignedIntakeCoordinator: 'Jessica Morales',
            notes: body.notes || 'Referral received via CareNexus Partner API gateway.'
          };

          partnerReferrals.unshift(newReferral);

          return sendJsonResponse(res, 201, {
            success: true,
            message: 'Healthcare Partner Referral submitted successfully',
            data: newReferral
          });
        }
      }

      // Endpoint not matched in API
      return sendJsonResponse(res, 404, {
        success: false,
        error: `REST endpoint '${method} ${pathname}' not found`
      });

    } catch (err) {
      console.error('API Error:', err);
      return sendJsonResponse(res, 500, {
        success: false,
        error: 'Internal Server Error',
        details: err.message
      });
    }
  }

  // Static File Serving
  serveStaticFile(req, res, pathname);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`  CareNexus Partner Platform Server running on port ${PORT}`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  API Gateway Base: http://localhost:${PORT}/api/v1`);
  console.log(`======================================================\n`);
});
