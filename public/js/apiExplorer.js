/**
 * CareNexus Partner Platform - REST API Explorer
 * Live interactive testing tool for SOA RESTful endpoints
 */

const ENDPOINT_PRESETS = {
  'ep-caregivers-get': {
    method: 'GET',
    path: '/api/v1/caregivers',
    description: 'List all family caregivers with caseload metadata',
    body: null
  },
  'ep-recipients-get': {
    method: 'GET',
    path: '/api/v1/care-recipients',
    description: 'List care recipients with functional ADL scorecards',
    body: null
  },
  'ep-carelogs-post': {
    method: 'POST',
    path: '/api/v1/care-logs',
    description: 'Submit caregiver daily observation & vitals log',
    body: JSON.stringify({
      caregiverId: "cg-101",
      careRecipientId: "cr-201",
      shiftType: "Morning",
      recipientMood: "Alert & Cheerful",
      adlsCompleted: [
        "Assisted Shower with Grab Bar",
        "Morning Blood Pressure Check",
        "Low-Sodium Breakfast Prep",
        "Range of Motion Walking Drills"
      ],
      medicationAdherence: "Full - All morning doses administered on schedule",
      vitals: {
        bloodPressure: "124/80",
        heartRate: 74,
        bloodGlucose: 106,
        temperature: 98.4
      },
      hoursOfSleep: 8.0,
      behavioralObservations: "Rosa had a pleasant morning with zero disorientation. Walked safely in the garden for 15 minutes.",
      incidentReported: false,
      flaggedForCoach: false
    }, null, 2)
  },
  'ep-coaching-post': {
    method: 'POST',
    path: '/api/v1/coaching/sessions',
    description: 'Schedule clinical coaching telehealth session',
    body: JSON.stringify({
      caregiverId: "cg-102",
      coachName: "Marcus Vance, LCSW",
      coachTitle: "Caregiver Mental Health Specialist",
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      durationMinutes: 60,
      sessionType: "Urgent Burnout Intervention & Respite Support",
      caregiverBurnoutScore: 8,
      clinicalSummary: "Addressing sleep deprivation caused by care recipient sundowning. Activating VA in-home respite hours.",
      actionItems: [
        "Finalize VA Form 10-10CG addendum",
        "Establish nighttime soothing routine"
      ],
      status: "Scheduled"
    }, null, 2)
  },
  'ep-referrals-post': {
    method: 'POST',
    path: '/api/v1/partner/referrals',
    description: 'Submit healthcare partner intake & triage referral',
    body: JSON.stringify({
      referringPartner: "MetroHealth Integrated Care Network",
      referrerContact: "Dr. Rachel Zhang, MD (Discharge Coordination)",
      patientName: "Evelyn Montgomery",
      patientAge: 78,
      patientDob: "1948-03-12",
      prospectiveCaregiverName: "David Montgomery",
      caregiverRelationship: "Son (Living in same household)",
      caregiverPhone: "(555) 890-1234",
      caregiverEmail: "david.montgomery@outlook.com",
      insurancePayer: "Anthem BlueCross BlueShield Medicaid LTSS",
      programRequested: "Structured Family Caregiving (SFC) Tier 2",
      priorityLevel: "High",
      clinicalSummary: "78yo female discharged post-CHF exacerbation. Son is full-time caregiver requiring structured training, monthly stipend, and clinical coaching."
    }, null, 2)
  }
};

let activeEndpointKey = 'ep-caregivers-get';

function initApiExplorer() {
  const endpointButtons = document.querySelectorAll('.endpoint-btn');
  endpointButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      endpointButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.endpointId;
      selectEndpoint(key);
    });
  });

  selectEndpoint('ep-caregivers-get');
}

function selectEndpoint(key) {
  activeEndpointKey = key;
  const config = ENDPOINT_PRESETS[key];
  if (!config) return;

  const methodTag = document.getElementById('explorer-method-tag');
  const urlPath = document.getElementById('explorer-url-path');
  const reqBody = document.getElementById('explorer-request-body');
  const statusBadge = document.getElementById('explorer-status-badge');
  const respViewer = document.getElementById('explorer-response-body');

  methodTag.textContent = config.method;
  methodTag.className = `method-tag method-${config.method.toLowerCase()}`;
  urlPath.textContent = config.path;

  if (config.body) {
    reqBody.value = config.body;
    reqBody.removeAttribute('disabled');
  } else {
    reqBody.value = '// GET requests have no body';
    reqBody.setAttribute('disabled', 'true');
  }

  statusBadge.textContent = 'Ready';
  statusBadge.style.color = '#38bdf8';
  respViewer.textContent = 'Click "Send Request" to execute endpoint...';
}

async function executeCurrentEndpoint() {
  const config = ENDPOINT_PRESETS[activeEndpointKey];
  if (!config) return;

  const statusBadge = document.getElementById('explorer-status-badge');
  const respViewer = document.getElementById('explorer-response-body');
  const reqBodyEl = document.getElementById('explorer-request-body');

  statusBadge.textContent = 'Executing...';
  statusBadge.style.color = '#fbbf24';
  respViewer.textContent = 'Sending HTTP request to SOA Gateway...';

  const startTime = performance.now();

  try {
    const options = {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (config.method === 'POST') {
      try {
        const bodyContent = reqBodyEl.value.trim();
        if (bodyContent) {
          options.body = JSON.stringify(JSON.parse(bodyContent));
        }
      } catch (err) {
        statusBadge.textContent = '400 Bad Request (Invalid JSON)';
        statusBadge.style.color = '#f43f5e';
        respViewer.textContent = `Client-side JSON parse error:\n${err.message}`;
        return;
      }
    }

    const res = await fetch(config.path, options);
    const duration = Math.round(performance.now() - startTime);
    const json = await res.json();

    const statusText = `${res.status} ${res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : '')} (${duration}ms)`;
    statusBadge.textContent = statusText;
    statusBadge.style.color = res.ok ? '#34d399' : '#f43f5e';

    respViewer.textContent = JSON.stringify(json, null, 2);

    // Refresh application state if a POST was executed
    if (res.ok && config.method === 'POST') {
      if (window.refreshAllData) {
        window.refreshAllData();
      }
      if (window.showToast) {
        window.showToast(`REST API: Successfully executed ${config.path}`);
      }
    }

  } catch (error) {
    statusBadge.textContent = 'Network Error';
    statusBadge.style.color = '#f43f5e';
    respViewer.textContent = `Error executing request: ${error.message}`;
  }
}

// Expose to window
window.initApiExplorer = initApiExplorer;
window.executeCurrentEndpoint = executeCurrentEndpoint;
