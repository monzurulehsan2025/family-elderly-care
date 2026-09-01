/**
 * CareNexus Partner Platform - Client Application Controller
 * Handles SPA navigation, REST API interactions, data binding, and state management.
 */

// Application State Store
const state = {
  activeView: 'dashboard',
  caregivers: [],
  recipients: [],
  careLogs: [],
  coachingSessions: [],
  referrals: [],
  stats: null
};

// View Titles Mapping
const VIEW_TITLES = {
  dashboard: 'Care Operations Dashboard',
  caregivers: 'Family Caregiver Caseload & Directory',
  recipients: 'Care Recipients & ADL Functional Profiles',
  logs: 'Daily Care Observations & Clinical Feeds',
  coaching: 'Clinical Telehealth Coaching Sessions',
  referrals: 'Healthcare Partner Referral Intake Pipeline',
  explorer: 'Interactive REST API Explorer'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initNavigation();
  initSearchAndFilters();
  if (window.initApiExplorer) {
    window.initApiExplorer();
  }
  await refreshAllData();

  // Set default datetime for coaching modal (tomorrow at 10 AM)
  const tomorrow = new Date(Date.now() + 86400000);
  tomorrow.setHours(10, 0, 0, 0);
  const tzOffset = tomorrow.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(tomorrow.getTime() - tzOffset)).toISOString().slice(0, 16);
  const coachDtInput = document.getElementById('coach-datetime');
  if (coachDtInput) {
    coachDtInput.value = localISOTime;
  }
});

// Navigation Handling
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.dataset.view;
      if (viewId) {
        switchView(viewId);
      }
    });
  });
}

function switchView(viewId) {
  state.activeView = viewId;

  // Update Nav Active State
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewId);
  });

  // Update Section Visibility
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `view-${viewId}`);
  });

  // Update Header Title
  const titleEl = document.getElementById('current-view-title');
  if (titleEl && VIEW_TITLES[viewId]) {
    titleEl.textContent = VIEW_TITLES[viewId];
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global Data Fetcher
async function refreshAllData() {
  try {
    const [statsRes, cgRes, crRes, logsRes, coachRes, refRes] = await Promise.all([
      fetch('/api/v1/stats/overview').then(r => r.json()),
      fetch('/api/v1/caregivers').then(r => r.json()),
      fetch('/api/v1/care-recipients').then(r => r.json()),
      fetch('/api/v1/care-logs').then(r => r.json()),
      fetch('/api/v1/coaching/sessions').then(r => r.json()),
      fetch('/api/v1/partner/referrals').then(r => r.json())
    ]);

    if (statsRes.success) state.stats = statsRes.data;
    if (cgRes.success) state.caregivers = cgRes.data;
    if (crRes.success) state.recipients = crRes.data;
    if (logsRes.success) state.careLogs = logsRes.data;
    if (coachRes.success) state.coachingSessions = coachRes.data;
    if (refRes.success) state.referrals = refRes.data;

    renderAllViews();
    updateBadges();

  } catch (error) {
    console.error('Failed to fetch data from REST Gateway:', error);
    showToast('Notice: Using local client state.', 'warning');
  }
}

// Update Badge Counts in Navigation
function updateBadges() {
  const cgBadge = document.getElementById('badge-caregivers-count');
  if (cgBadge) cgBadge.textContent = state.caregivers.length;

  const crBadge = document.getElementById('badge-recipients-count');
  if (crBadge) crBadge.textContent = state.recipients.length;

  const refBadge = document.getElementById('badge-referrals-count');
  if (refBadge) refBadge.textContent = state.referrals.length;

  const flaggedCount = state.careLogs.filter(l => l.flaggedForCoach).length;
  const logBadge = document.getElementById('badge-logs-flagged');
  if (logBadge) {
    logBadge.textContent = flaggedCount > 0 ? `${flaggedCount} Action` : '0 Action';
    logBadge.className = `nav-badge ${flaggedCount > 0 ? 'urgent' : ''}`;
  }
}

// Render All View Sections
function renderAllViews() {
  renderDashboard();
  renderCaregivers();
  renderRecipients();
  renderCareLogs();
  renderCoaching();
  renderReferrals();
}

// 1. Render Dashboard
function renderDashboard() {
  if (state.stats) {
    document.getElementById('kpi-caregivers-val').textContent = state.stats.totalCaregivers;
    document.getElementById('kpi-recipients-val').textContent = state.stats.totalRecipients;
    document.getElementById('kpi-wellness-val').textContent = `${state.stats.avgWellnessScore} / 100`;
    document.getElementById('kpi-referrals-val').textContent = state.stats.pendingReferrals;
  }

  // Dashboard Recent Logs snippet
  const logsContainer = document.getElementById('dashboard-recent-logs');
  if (logsContainer) {
    const recent = state.careLogs.slice(0, 3);
    logsContainer.innerHTML = recent.map(log => `
      <div style="padding: 12px; margin-bottom: 10px; background: rgba(255,255,255,0.02); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.82rem;">
          <strong style="color: #fff;">${escapeHtml(log.careRecipientName)}</strong>
          <span style="color: var(--text-dim); font-size: 0.72rem;">${formatTime(log.timestamp)}</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 6px;">
          ${escapeHtml(log.behavioralObservations.slice(0, 110))}...
        </div>
        <div style="display: flex; gap: 6px; font-size: 0.7rem;">
          <span class="chip-tag">${escapeHtml(log.shiftType)}</span>
          <span class="chip-tag">BP: ${log.vitals?.bloodPressure || 'N/A'}</span>
          ${log.flaggedForCoach ? '<span class="chip-tag" style="color: #fb7185; background: rgba(244,63,94,0.15);">Flagged for Coach</span>' : ''}
        </div>
      </div>
    `).join('');
  }

  // Dashboard Recent Referrals snippet
  const refContainer = document.getElementById('dashboard-recent-referrals');
  if (refContainer) {
    const recentRefs = state.referrals.slice(0, 3);
    refContainer.innerHTML = recentRefs.map(ref => `
      <div style="padding: 12px; margin-bottom: 10px; background: rgba(255,255,255,0.02); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.82rem;">
          <strong style="color: #fff;">${escapeHtml(ref.patientName)} (${ref.patientAge}y)</strong>
          <span class="status-pill ${ref.priorityLevel === 'Urgent' ? 'high-support' : 'completed'}">${ref.priorityLevel}</span>
        </div>
        <div style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 4px;">
          Partner: ${escapeHtml(ref.referringPartner)}
        </div>
        <div style="font-size: 0.72rem; color: var(--teal-light);">
          Status: ${escapeHtml(ref.authorizationStatus)}
        </div>
      </div>
    `).join('');
  }
}

// 2. Render Caregivers Table
function renderCaregivers(filterStatus = '', search = '') {
  const tbody = document.getElementById('caregivers-tbody');
  if (!tbody) return;

  let filtered = [...state.caregivers];
  if (filterStatus) {
    filtered = filtered.filter(c => c.status === filterStatus);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.fullName.toLowerCase().includes(q) ||
      c.programEnrollment.toLowerCase().includes(q) ||
      c.careRecipientName.toLowerCase().includes(q) ||
      c.cityState.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 32px; color: var(--text-muted);">No caregivers match the current filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td>
        <div class="user-cell">
          <img src="${c.avatar}" alt="${escapeHtml(c.fullName)}" class="user-avatar-img" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'">
          <div class="user-cell-meta">
            <span class="user-cell-name">${escapeHtml(c.fullName)}</span>
            <span class="user-cell-sub">${escapeHtml(c.relationship)} • ${escapeHtml(c.cityState)}</span>
          </div>
        </div>
      </td>
      <td>
        <div>
          <div style="font-weight: 600; color: #fff;">${escapeHtml(c.careRecipientName)}</div>
          <div style="font-size: 0.72rem; color: var(--text-dim);">ID: ${c.careRecipientId}</div>
        </div>
      </td>
      <td>
        <div style="font-size: 0.82rem; color: var(--text-secondary);">${escapeHtml(c.programEnrollment)}</div>
        <div style="font-size: 0.72rem; color: var(--text-dim);">${c.hoursPerWeek} hrs/wk committed</div>
      </td>
      <td>
        <div style="color: #38bdf8; font-weight: 500; font-size: 0.82rem;">${escapeHtml(c.assignedCoach)}</div>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 700; color: #fff; font-size: 0.85rem;">${c.wellnessScore}%</span>
          <div class="wellness-bar-wrap">
            <div class="wellness-bar-fill ${c.wellnessScore < 70 ? 'warning' : ''}" style="width: ${c.wellnessScore}%;"></div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: var(--teal-light);">${c.monthlyStipend}</div>
      </td>
      <td>
        <span class="status-pill ${c.status === 'Active' ? 'active' : c.status === 'High Support' ? 'high-support' : 'onboarding'}">
          ${c.status}
        </span>
      </td>
    </tr>
  `).join('');
}

// 3. Render Care Recipients Cards Grid
function renderRecipients(filterAcuity = '', search = '') {
  const container = document.getElementById('recipients-grid');
  if (!container) return;

  let filtered = [...state.recipients];
  if (filterAcuity) {
    filtered = filtered.filter(r => r.acuityTier.includes(filterAcuity));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.fullName.toLowerCase().includes(q) ||
      r.caregiverName.toLowerCase().includes(q) ||
      r.primaryConditions.some(cond => cond.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">No care recipients found matching criteria.</div>`;
    return;
  }

  container.innerHTML = filtered.map(r => `
    <div class="entity-card">
      <div class="entity-card-header">
        <div>
          <div class="entity-name">${escapeHtml(r.fullName)}</div>
          <div class="entity-relation">${r.age} yrs • DOB: ${r.dateOfBirth} • Caregiver: <strong style="color: #fff;">${escapeHtml(r.caregiverName)}</strong></div>
        </div>
        <span class="status-pill ${r.acuityTier.includes('Tier 3') ? 'tier-3' : r.acuityTier.includes('Tier 2') ? 'tier-2' : 'tier-1'}">
          ${escapeHtml(r.acuityTier.split(' - ')[0])}
        </span>
      </div>

      <div style="margin-bottom: 10px;">
        <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-dim); margin-bottom: 4px;">Primary Conditions</div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${r.primaryConditions.map(cond => `<span class="chip-tag" style="background: rgba(14,165,233,0.1); color: #38bdf8; border: 1px solid rgba(14,165,233,0.2);">${escapeHtml(cond)}</span>`).join('')}
        </div>
      </div>

      <div class="adl-grid">
        <div class="adl-item">
          <span class="adl-label">Bathing / Hygiene</span>
          <span class="adl-val">${escapeHtml(r.adlScores.bathing)}</span>
        </div>
        <div class="adl-item">
          <span class="adl-label">Mobility / Transfer</span>
          <span class="adl-val">${escapeHtml(r.adlScores.mobility)}</span>
        </div>
        <div class="adl-item">
          <span class="adl-label">Med Management</span>
          <span class="adl-val">${escapeHtml(r.adlScores.medicationManagement)}</span>
        </div>
        <div class="adl-item">
          <span class="adl-label">Meal Preparation</span>
          <span class="adl-val">${escapeHtml(r.adlScores.mealPreparation)}</span>
        </div>
      </div>

      <div class="vitals-strip">
        <div class="vitals-item">
          <span class="vitals-label">Blood Pressure</span>
          <span class="vitals-value">${r.vitalsLatest?.bloodPressure || 'N/A'}</span>
        </div>
        <div class="vitals-item">
          <span class="vitals-label">Heart Rate</span>
          <span class="vitals-value">${r.vitalsLatest?.heartRate || 'N/A'}</span>
        </div>
        <div class="vitals-item">
          <span class="vitals-label">Blood Glucose</span>
          <span class="vitals-value">${r.vitalsLatest?.bloodGlucose || 'N/A'}</span>
        </div>
        <div class="vitals-item">
          <span class="vitals-label">O2 Sat</span>
          <span class="vitals-value">${r.vitalsLatest?.o2Saturation || 'N/A'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// 4. Render Daily Care Logs Timeline
function renderCareLogs(flaggedOnly = false) {
  const timeline = document.getElementById('logs-timeline');
  if (!timeline) return;

  let filtered = [...state.careLogs];
  if (flaggedOnly) {
    filtered = filtered.filter(l => l.flaggedForCoach);
  }

  if (filtered.length === 0) {
    timeline.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-muted);">No daily care logs recorded.</div>`;
    return;
  }

  timeline.innerHTML = filtered.map(log => `
    <div class="log-entry-card ${log.flaggedForCoach ? 'flagged' : ''}">
      <div class="log-top-meta">
        <div class="log-author">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--teal-light);">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>${escapeHtml(log.caregiverName)}</span>
          <span style="font-weight: normal; color: var(--text-muted); font-size: 0.8rem;">caring for</span>
          <span style="color: #38bdf8;">${escapeHtml(log.careRecipientName)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          ${log.flaggedForCoach ? '<span class="status-pill high-support">Priority Flag for Coach</span>' : ''}
          <span class="log-timestamp">${formatDateTime(log.timestamp)}</span>
        </div>
      </div>

      <div class="log-chips-row">
        <span class="chip-tag" style="background: rgba(99,102,241,0.15); color: #a5b4fc; font-weight: 600;">Shift: ${escapeHtml(log.shiftType)}</span>
        <span class="chip-tag">Mood: <strong>${escapeHtml(log.recipientMood)}</strong></span>
        <span class="chip-tag">Sleep: <strong>${log.hoursOfSleep}h</strong></span>
        <span class="chip-tag">BP: <strong>${log.vitals?.bloodPressure || 'N/A'}</strong></span>
        <span class="chip-tag">HR: <strong>${log.vitals?.heartRate || 'N/A'} bpm</strong></span>
        <span class="chip-tag">Glucose: <strong>${log.vitals?.bloodGlucose || 'N/A'} mg/dL</strong></span>
      </div>

      <div style="font-size: 0.78rem; color: var(--text-dim); display: flex; gap: 6px; flex-wrap: wrap;">
        <strong>ADLs Completed:</strong>
        ${(log.adlsCompleted || []).map(adl => `<span style="color: var(--text-secondary);">${escapeHtml(adl)}</span>`).join(' • ')}
      </div>

      <div class="log-observation-text ${log.flaggedForCoach ? 'urgent-border' : ''}">
        ${escapeHtml(log.behavioralObservations)}
      </div>
    </div>
  `).join('');
}

// 5. Render Clinical Coaching
function renderCoaching() {
  const container = document.getElementById('coaching-grid');
  if (!container) return;

  container.innerHTML = state.coachingSessions.map(cs => {
    const score = cs.caregiverBurnoutScore || 1;
    const isElevated = score >= 7;

    return `
      <div class="entity-card" style="border-left: 4px solid ${isElevated ? 'var(--rose)' : 'var(--teal-light)'};">
        <div class="entity-card-header">
          <div>
            <div class="entity-name">${escapeHtml(cs.sessionType)}</div>
            <div class="entity-relation">Caregiver: <strong style="color: #fff;">${escapeHtml(cs.caregiverName)}</strong> • Coach: <span style="color: #38bdf8;">${escapeHtml(cs.coachName)}</span></div>
          </div>
          <span class="status-pill ${cs.status === 'Completed' ? 'completed' : 'scheduled'}">${cs.status}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0; font-size: 0.8rem; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: var(--radius-md);">
          <span>Scheduled: <strong>${formatDateTime(cs.scheduledDate)}</strong> (${cs.durationMinutes} min)</span>
          <div class="burnout-indicator">
            <span>Burnout Index:</span>
            <div class="burnout-scale">
              ${[1,2,3,4,5,6,7,8,9,10].map(i => `
                <div class="burnout-dot ${i <= score ? (score >= 7 ? 'filled-high' : score >= 5 ? 'filled-med' : 'filled-low') : ''}"></div>
              `).join('')}
            </div>
            <span style="color: ${isElevated ? '#fb7185' : 'var(--teal-light)'}; font-weight: 700;">${score}/10</span>
          </div>
        </div>

        <div style="font-size: 0.84rem; color: var(--text-secondary); margin: 8px 0; line-height: 1.5;">
          ${escapeHtml(cs.clinicalSummary)}
        </div>

        ${cs.actionItems && cs.actionItems.length > 0 ? `
          <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border-subtle); font-size: 0.75rem;">
            <div style="font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px;">Clinical Action Items</div>
            <ul style="padding-left: 18px; color: var(--text-muted); margin: 0;">
              ${cs.actionItems.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// 6. Render Partner Referrals Table
function renderReferrals() {
  const tbody = document.getElementById('referrals-tbody');
  if (!tbody) return;

  tbody.innerHTML = state.referrals.map(ref => `
    <tr>
      <td>
        <div style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #fff;">${ref.id}</div>
        <div style="font-size: 0.72rem; color: var(--text-dim);">${ref.referralDate}</div>
      </td>
      <td>
        <div style="font-weight: 600; color: var(--text-primary); font-size: 0.84rem;">${escapeHtml(ref.referringPartner)}</div>
        <div style="font-size: 0.72rem; color: var(--text-dim);">${escapeHtml(ref.referrerContact)}</div>
      </td>
      <td>
        <div style="font-weight: 600; color: #fff;">${escapeHtml(ref.patientName)}</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Age: ${ref.patientAge} (DOB: ${ref.patientDob})</div>
      </td>
      <td>
        <div style="font-weight: 600; color: #38bdf8;">${escapeHtml(ref.prospectiveCaregiverName)}</div>
        <div style="font-size: 0.72rem; color: var(--text-dim);">${escapeHtml(ref.caregiverRelationship)}</div>
      </td>
      <td>
        <div style="font-size: 0.82rem; color: var(--text-secondary);">${escapeHtml(ref.programRequested)}</div>
        <div style="font-size: 0.72rem; color: var(--text-dim);">${escapeHtml(ref.insurancePayer)}</div>
      </td>
      <td>
        <span class="status-pill ${ref.priorityLevel === 'Urgent' ? 'high-support' : ref.priorityLevel === 'High' ? 'onboarding' : 'completed'}">
          ${ref.priorityLevel}
        </span>
      </td>
      <td>
        <div style="font-weight: 600; font-size: 0.8rem; color: var(--teal-light);">${escapeHtml(ref.authorizationStatus)}</div>
        <div style="font-size: 0.72rem; color: var(--text-dim);">Est. ${ref.estimatedMonthlyStipend || '$2,000/mo'}</div>
      </td>
    </tr>
  `).join('');
}

// Form Handlers

// 1. Submit Daily Care Log (POST /api/v1/care-logs)
async function handleCreateCareLog(e) {
  e.preventDefault();

  const cgSelect = document.getElementById('log-caregiver-select');
  const caregiverId = cgSelect.value;
  const opt = cgSelect.options[cgSelect.selectedIndex];
  const careRecipientId = opt.dataset.recipient || 'cr-201';

  const payload = {
    caregiverId,
    careRecipientId,
    shiftType: document.getElementById('log-shift-type').value,
    recipientMood: document.getElementById('log-mood').value,
    hoursOfSleep: parseFloat(document.getElementById('log-sleep-hours').value) || 7.0,
    adlsCompleted: document.getElementById('log-adls').value.split(',').map(s => s.trim()).filter(Boolean),
    vitals: {
      bloodPressure: document.getElementById('log-bp').value.trim() || '120/80',
      bloodGlucose: parseInt(document.getElementById('log-glucose').value) || 105,
      heartRate: 72,
      temperature: 98.4
    },
    behavioralObservations: document.getElementById('log-notes').value.trim() || 'Routine care shift completed without incident.',
    flaggedForCoach: document.getElementById('log-flag-coach').checked
  };

  try {
    const res = await fetch('/api/v1/care-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      closeModal('modal-create-log');
      showToast('Daily Care Log submitted to REST API successfully!');
      document.getElementById('form-create-log').reset();
      await refreshAllData();
      switchView('logs');
    } else {
      showToast(`Error: ${data.error || 'Failed to submit'}`, 'error');
    }
  } catch (err) {
    showToast(`Network Error: ${err.message}`, 'error');
  }
}

// 2. Schedule Clinical Coaching (POST /api/v1/coaching/sessions)
async function handleScheduleCoaching(e) {
  e.preventDefault();

  const payload = {
    caregiverId: document.getElementById('coach-caregiver-select').value,
    coachName: document.getElementById('coach-name-select').value,
    sessionType: document.getElementById('coach-session-type').value,
    scheduledDate: new Date(document.getElementById('coach-datetime').value).toISOString(),
    durationMinutes: parseInt(document.getElementById('coach-duration').value) || 45,
    caregiverBurnoutScore: parseInt(document.getElementById('coach-burnout-val').value) || 4,
    clinicalSummary: document.getElementById('coach-summary').value.trim() || 'Scheduled clinical coaching session.',
    actionItems: ['Conduct telehealth wellness check', 'Review active care log vitals']
  };

  try {
    const res = await fetch('/api/v1/coaching/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      closeModal('modal-schedule-coaching');
      showToast('Clinical Coaching session scheduled in REST API!');
      document.getElementById('form-create-coaching').reset();
      await refreshAllData();
      switchView('coaching');
    } else {
      showToast(`Error: ${data.error || 'Failed to schedule'}`, 'error');
    }
  } catch (err) {
    showToast(`Network Error: ${err.message}`, 'error');
  }
}

// 3. Submit Partner Referral (POST /api/v1/partner/referrals)
async function handleCreateReferral(e) {
  e.preventDefault();

  const payload = {
    referringPartner: document.getElementById('ref-partner-select').value,
    priorityLevel: document.getElementById('ref-priority-select').value,
    patientName: document.getElementById('ref-patient-name').value.trim(),
    patientAge: parseInt(document.getElementById('ref-patient-age').value) || 75,
    prospectiveCaregiverName: document.getElementById('ref-caregiver-name').value.trim(),
    caregiverRelationship: document.getElementById('ref-caregiver-rel').value.trim(),
    insurancePayer: document.getElementById('ref-payer').value.trim(),
    programRequested: document.getElementById('ref-program').value.trim(),
    clinicalSummary: document.getElementById('ref-summary').value.trim() || 'New partner referral intake.'
  };

  try {
    const res = await fetch('/api/v1/partner/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      closeModal('modal-create-referral');
      showToast('Healthcare Partner Referral submitted to REST API!');
      document.getElementById('form-create-referral').reset();
      await refreshAllData();
      switchView('referrals');
    } else {
      showToast(`Error: ${data.error || 'Failed to submit'}`, 'error');
    }
  } catch (err) {
    showToast(`Network Error: ${err.message}`, 'error');
  }
}

// Search & Filter Listeners
function initSearchAndFilters() {
  // Caregiver filters
  const cgSearch = document.getElementById('caregiver-search');
  const cgFilter = document.getElementById('caregiver-status-filter');
  if (cgSearch && cgFilter) {
    const updateCg = () => renderCaregivers(cgFilter.value, cgSearch.value);
    cgSearch.addEventListener('input', updateCg);
    cgFilter.addEventListener('change', updateCg);
  }

  // Recipient filters
  const crSearch = document.getElementById('recipient-search');
  const crFilter = document.getElementById('recipient-acuity-filter');
  if (crSearch && crFilter) {
    const updateCr = () => renderRecipients(crFilter.value, crSearch.value);
    crSearch.addEventListener('input', updateCr);
    crFilter.addEventListener('change', updateCr);
  }

  // Logs filters
  const logFilter = document.getElementById('log-filter-flagged');
  if (logFilter) {
    logFilter.addEventListener('change', () => {
      renderCareLogs(logFilter.value === 'flagged');
    });
  }
}

// Modal Helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.borderColor = '#f43f5e';
    toast.style.borderLeftColor = '#f43f5e';
  } else if (type === 'warning') {
    toast.style.borderColor = '#f59e0b';
    toast.style.borderLeftColor = '#f59e0b';
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: ${type === 'error' ? '#f43f5e' : type === 'warning' ? '#f59e0b' : 'var(--teal-light)'};">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Utility Functions
function formatTime(isoStr) {
  if (!isoStr) return 'Just now';
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Theme & Dashboard Background Switcher
const THEME_PRESETS = {
  midnight: { bg: '#090d16', sidebar: '#0f172a', name: 'Midnight Slate' },
  ocean: { bg: '#071326', sidebar: '#0d1f3d', name: 'Ocean Navy' },
  emerald: { bg: '#051b14', sidebar: '#0a2d22', name: 'Forest Emerald' },
  indigo: { bg: '#0f0c24', sidebar: '#1b173d', name: 'Royal Twilight' },
  charcoal: { bg: '#12161f', sidebar: '#1c222e', name: 'Stealth Charcoal' }
};

function initTheme() {
  const savedTheme = localStorage.getItem('carenexus_theme') || 'midnight';
  const customColor = localStorage.getItem('carenexus_custom_bg');

  if (customColor) {
    applyCustomColor(customColor, false);
  } else if (THEME_PRESETS[savedTheme]) {
    const t = THEME_PRESETS[savedTheme];
    selectTheme(savedTheme, t.bg, t.sidebar, t.name, false);
  }

  // Click outside listener to close theme dropdown
  document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.theme-selector-wrap');
    const menu = document.getElementById('theme-dropdown-menu');
    if (wrap && menu && !wrap.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}

function toggleThemeDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('theme-dropdown-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

function selectTheme(themeId, bgColor, sidebarColor, label, showNotice = true) {
  document.documentElement.style.setProperty('--bg-app', bgColor);
  if (sidebarColor) {
    document.documentElement.style.setProperty('--bg-sidebar', sidebarColor);
  }

  // Update active state in menu
  document.querySelectorAll('.theme-opt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === themeId);
  });

  // Update preview swatch in header button
  const swatch = document.getElementById('current-theme-swatch');
  if (swatch) {
    swatch.style.background = bgColor;
  }

  // Update custom color input value
  const customInput = document.getElementById('custom-bg-input');
  if (customInput && bgColor.startsWith('#')) {
    customInput.value = bgColor;
  }

  // Persist
  localStorage.setItem('carenexus_theme', themeId);
  localStorage.removeItem('carenexus_custom_bg');

  // Close menu
  const menu = document.getElementById('theme-dropdown-menu');
  if (menu) menu.classList.remove('open');

  if (showNotice) {
    showToast(`Dashboard theme set to ${label}`);
  }
}

function applyCustomColor(hexColor, showNotice = true) {
  if (!hexColor) return;

  document.documentElement.style.setProperty('--bg-app', hexColor);

  // Compute slightly lighter tone for sidebar
  document.documentElement.style.setProperty('--bg-sidebar', hexColor);

  // Deselect preset buttons
  document.querySelectorAll('.theme-opt-btn').forEach(btn => btn.classList.remove('active'));

  // Update preview swatch
  const swatch = document.getElementById('current-theme-swatch');
  if (swatch) {
    swatch.style.background = hexColor;
  }

  localStorage.setItem('carenexus_custom_bg', hexColor);
  localStorage.removeItem('carenexus_theme');

  if (showNotice) {
    showToast(`Custom background color applied: ${hexColor}`);
  }
}

// Global Exports
window.switchView = switchView;
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.refreshAllData = refreshAllData;
window.handleCreateCareLog = handleCreateCareLog;
window.handleScheduleCoaching = handleScheduleCoaching;
window.handleCreateReferral = handleCreateReferral;
window.syncCaregiverRecipient = syncCaregiverRecipient;
window.toggleThemeDropdown = toggleThemeDropdown;
window.selectTheme = selectTheme;
window.applyCustomColor = applyCustomColor;
window.initTheme = initTheme;

