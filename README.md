# CareNexus Partner Platform

> **Enterprise Caregiver Management, Health Monitoring & Clinical Coaching Partner Platform**

CareNexus is an enterprise-grade web application and RESTful API suite designed for healthcare partner organizations, managed care health plans, and clinical care teams. The platform empowers clinical coaches to support family caregivers, monitor care recipient Activities of Daily Living (ADLs) and vital signs, schedule telehealth consultations, and ingest partner referrals.

---

## 🌟 Key Capabilities

1. **Family Caregiver Caseload & Profile Management**
   - Track family caregivers across programs including Structured Family Caregiving (SFC), VA Comprehensive Assistance, and Medicaid LTSS Waivers.
   - Real-time caregiver wellness scoring, hours committed, and monthly stipend tier tracking.

2. **Care Recipient Health & ADL Functional Scorecards**
   - Detailed functional assessments across 6 core ADL categories: Bathing, Dressing, Toileting, Mobility/Transfer, Medication Management, and Meal Preparation.
   - Acuity tier categorization (Tier 1 Low, Tier 2 Moderate, Tier 3 High) and latest vital signs tracker.

3. **Daily Care Observations & Clinical Feeds**
   - Shift-by-shift logging of care routines, sleep duration, medication adherence, and behavioral observations.
   - Automatic clinical flagging for patients exhibiting acute symptom escalation or caregiver strain.

4. **Clinical Coaching Telehealth Coordination**
   - Schedule and review 1-on-1 consultations with Registered Nurses (RN), Licensed Clinical Social Workers (LCSW), and Care Managers.
   - Objective Caregiver Burnout Index tracking (1–10 scale) and actionable clinical care plans.

5. **Healthcare Partner Referral Intake Pipeline**
   - Electronic referral ingestion from hospital discharge planning teams, Accountable Care Organizations (ACOs), and Medicare Advantage health plans.
   - Triage workflows, insurance verification, and automated program matching.

6. **Interactive Live REST API Explorer**
   - Built directly into the web application. Test endpoints, edit JSON request bodies, and inspect live response payloads, HTTP headers, and latency metrics in real time.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.x or higher)
- npm or corepack

### Installation & Launch

1. **Clone or navigate to the repository:**
   ```bash
   cd CareNexus
   ```

2. **Start the local server:**
   ```bash
   npm start
   ```
   *(or directly with `node server.js`)*

3. **Open the application in your browser:**
   ```
   http://localhost:3000
   ```

4. **Run the automated API test suite:**
   ```bash
   npm test
   ```

---

## 📡 RESTful API Documentation & JSON Payloads

The platform exposes 5 core RESTful API endpoints adhering to standard HTTP semantics, CORS headers, and JSON serialization.

```
Base Gateway URL: http://localhost:3000/api/v1
```

---

### Endpoint 1: Family Caregivers Caseload

#### `GET /api/v1/caregivers`
Retrieves a list of family caregivers enrolled in partner care programs.

- **Query Parameters (Optional):**
  - `status`: Filter by status (`Active`, `High Support`, `Onboarding`)
  - `search`: Search query string

**Sample JSON Response (`200 OK`):**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "cg-101",
      "fullName": "Maria Rodriguez",
      "email": "maria.rodriguez@familycare.net",
      "phone": "(555) 234-8901",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      "relationship": "Daughter & Primary Caregiver",
      "programEnrollment": "Structured Family Caregiving (SFC)",
      "careRecipientId": "cr-201",
      "careRecipientName": "Rosa Rodriguez",
      "assignedCoach": "Sarah Jenkins, RN",
      "status": "Active",
      "wellnessScore": 84,
      "hoursPerWeek": 40,
      "monthlyStipend": "$2,240.00",
      "joinedDate": "2025-03-15",
      "lastCheckIn": "2026-09-01T08:30:00Z",
      "emergencyContact": "Carlos Rodriguez (Brother) - (555) 234-8909",
      "cityState": "Atlanta, GA",
      "notes": "Consistently logs morning vitals. Highly proactive with physical therapy exercises."
    },
    {
      "id": "cg-102",
      "fullName": "James 'Jim' Henderson",
      "email": "jim.henderson@caremail.org",
      "phone": "(555) 345-6789",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      "relationship": "Spouse",
      "programEnrollment": "VA Comprehensive Assistance for Family Caregivers",
      "careRecipientId": "cr-202",
      "careRecipientName": "Margaret Henderson",
      "assignedCoach": "Marcus Vance, LCSW",
      "status": "High Support",
      "wellnessScore": 62,
      "hoursPerWeek": 45,
      "monthlyStipend": "$2,650.00",
      "joinedDate": "2024-11-10",
      "lastCheckIn": "2026-08-31T17:15:00Z",
      "emergencyContact": "Emily Henderson (Daughter) - (555) 345-6790",
      "cityState": "San Antonio, TX",
      "notes": "Experiencing sleep disruption due to spouse's sundowning symptoms. Respite support requested."
    }
  ]
}
```

---

### Endpoint 2: Care Recipients & ADL Functional Scorecards

#### `GET /api/v1/care-recipients`
Retrieves monitored care recipients with Activities of Daily Living (ADLs) functional scorecards, acuity tiers, and latest clinical vitals.

- **Query Parameters (Optional):**
  - `acuity`: Filter by acuity tier (`Tier 1`, `Tier 2`, `Tier 3`)
  - `search`: Search by recipient name or condition

**Sample JSON Response (`200 OK`):**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "cr-201",
      "fullName": "Rosa Rodriguez",
      "age": 79,
      "gender": "Female",
      "dateOfBirth": "1947-04-12",
      "caregiverId": "cg-101",
      "caregiverName": "Maria Rodriguez",
      "primaryConditions": [
        "Dementia (Alzheimer's Type - Moderate)",
        "Essential Hypertension",
        "Osteoarthritis of Knees"
      ],
      "acuityTier": "Tier 3 - High Acuity",
      "adlScores": {
        "bathing": "Extensive Assistance",
        "dressing": "Limited Assistance",
        "toileting": "Supervision",
        "mobility": "Limited Assistance (Walker)",
        "medicationManagement": "Dependent",
        "mealPreparation": "Dependent"
      },
      "vitalsLatest": {
        "bloodPressure": "128/82 mmHg",
        "heartRate": "72 bpm",
        "bloodGlucose": "108 mg/dL",
        "o2Saturation": "98%",
        "weight": "142 lbs",
        "recordedAt": "2026-09-01T08:15:00Z"
      },
      "allergies": [
        "Penicillin",
        "Sulfa Drugs"
      ],
      "primaryPhysician": "Dr. Arthur Vance, MD - Emory Geriatrics",
      "emergencyHospital": "Emory University Hospital Midtown",
      "fallRiskLevel": "Moderate",
      "carePlanGoals": [
        "Maintain daily 15-minute guided indoor walking",
        "Prevent nighttime disorientation via consistent bedtime ritual",
        "Maintain systolic BP < 135 mmHg"
      ]
    }
  ]
}
```

---

### Endpoint 3: Daily Care Observation Logs

#### `POST /api/v1/care-logs`
Submits a structured daily observation log recorded by a family caregiver.

**Sample JSON Request:**
```json
{
  "caregiverId": "cg-101",
  "careRecipientId": "cr-201",
  "shiftType": "Morning",
  "recipientMood": "Alert & Cheerful",
  "adlsCompleted": [
    "Assisted Shower with Grab Bar",
    "Morning Blood Pressure Check",
    "Low-Sodium Breakfast Prep",
    "Range of Motion Walking Drills"
  ],
  "medicationAdherence": "Full - All morning doses administered on schedule",
  "vitals": {
    "bloodPressure": "124/80",
    "heartRate": 74,
    "bloodGlucose": 106,
    "temperature": 98.4
  },
  "hoursOfSleep": 8.0,
  "behavioralObservations": "Rosa had a pleasant morning with zero disorientation. Walked safely in the garden for 15 minutes.",
  "incidentReported": false,
  "flaggedForCoach": false
}
```

**Sample JSON Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Daily Care Log recorded successfully",
  "data": {
    "id": "log-4821",
    "caregiverId": "cg-101",
    "caregiverName": "Maria Rodriguez",
    "careRecipientId": "cr-201",
    "careRecipientName": "Rosa Rodriguez",
    "timestamp": "2026-09-01T13:30:00.000Z",
    "shiftType": "Morning",
    "recipientMood": "Alert & Cheerful",
    "adlsCompleted": [
      "Assisted Shower with Grab Bar",
      "Morning Blood Pressure Check",
      "Low-Sodium Breakfast Prep",
      "Range of Motion Walking Drills"
    ],
    "medicationAdherence": "Full - All morning doses administered on schedule",
    "vitals": {
      "bloodPressure": "124/80",
      "heartRate": 74,
      "bloodGlucose": 106,
      "temperature": 98.4
    },
    "hoursOfSleep": 8.0,
    "behavioralObservations": "Rosa had a pleasant morning with zero disorientation. Walked safely in the garden for 15 minutes.",
    "incidentReported": false,
    "incidentDetails": null,
    "flaggedForCoach": false,
    "coachReviewStatus": "Pending Review"
  }
}
```

---

### Endpoint 4: Clinical Coaching Telehealth Sessions

#### `POST /api/v1/coaching/sessions`
Schedules a 1-on-1 clinical telehealth consultation between a Care Coach and a family caregiver.

**Sample JSON Request:**
```json
{
  "caregiverId": "cg-102",
  "coachName": "Marcus Vance, LCSW",
  "coachTitle": "Caregiver Mental Health Specialist",
  "scheduledDate": "2026-09-04T10:00:00.000Z",
  "durationMinutes": 60,
  "sessionType": "Urgent Burnout Intervention & Respite Support",
  "caregiverBurnoutScore": 8,
  "clinicalSummary": "Addressing sleep deprivation caused by care recipient sundowning. Activating VA in-home respite hours.",
  "actionItems": [
    "Finalize VA Form 10-10CG addendum",
    "Establish nighttime soothing routine"
  ],
  "status": "Scheduled"
}
```

**Sample JSON Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Clinical Coaching Session scheduled successfully",
  "data": {
    "id": "cs-9023",
    "caregiverId": "cg-102",
    "caregiverName": "James 'Jim' Henderson",
    "coachId": "coach-01",
    "coachName": "Marcus Vance, LCSW",
    "coachTitle": "Caregiver Mental Health Specialist",
    "scheduledDate": "2026-09-04T10:00:00.000Z",
    "durationMinutes": 60,
    "sessionType": "Urgent Burnout Intervention & Respite Support",
    "caregiverBurnoutScore": 8,
    "burnoutCategory": "Elevated Risk - High Strain",
    "clinicalSummary": "Addressing sleep deprivation caused by care recipient sundowning. Activating VA in-home respite hours.",
    "actionItems": [
      "Finalize VA Form 10-10CG addendum",
      "Establish nighttime soothing routine"
    ],
    "status": "Scheduled"
  }
}
```

---

### Endpoint 5: Healthcare Partner Referral Intake

#### `POST /api/v1/partner/referrals`
Submits a discharge planning or intake referral from an external hospital network, health plan, or ACO.

**Sample JSON Request:**
```json
{
  "referringPartner": "MetroHealth Integrated Care Network",
  "referrerContact": "Dr. Rachel Zhang, MD (Discharge Coordination)",
  "patientName": "Evelyn Montgomery",
  "patientAge": 78,
  "patientDob": "1948-03-12",
  "prospectiveCaregiverName": "David Montgomery",
  "caregiverRelationship": "Son (Living in same household)",
  "caregiverPhone": "(555) 890-1234",
  "caregiverEmail": "david.montgomery@outlook.com",
  "insurancePayer": "Anthem BlueCross BlueShield Medicaid LTSS",
  "programRequested": "Structured Family Caregiving (SFC) Tier 2",
  "priorityLevel": "High",
  "clinicalSummary": "78yo female discharged post-CHF exacerbation. Son is full-time caregiver requiring structured training, monthly stipend, and clinical coaching."
}
```

**Sample JSON Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Healthcare Partner Referral submitted successfully",
  "data": {
    "id": "ref-1044",
    "referringPartner": "MetroHealth Integrated Care Network",
    "referrerContact": "Dr. Rachel Zhang, MD (Discharge Coordination)",
    "referrerEmail": "intake@partnerhealth.org",
    "patientName": "Evelyn Montgomery",
    "patientDob": "1948-03-12",
    "patientAge": 78,
    "prospectiveCaregiverName": "David Montgomery",
    "caregiverRelationship": "Son (Living in same household)",
    "caregiverPhone": "(555) 890-1234",
    "caregiverEmail": "david.montgomery@outlook.com",
    "insurancePayer": "Anthem BlueCross BlueShield Medicaid LTSS",
    "programRequested": "Structured Family Caregiving (SFC) Tier 2",
    "clinicalSummary": "78yo female discharged post-CHF exacerbation. Son is full-time caregiver requiring structured training, monthly stipend, and clinical coaching.",
    "priorityLevel": "High",
    "referralDate": "2026-09-01",
    "authorizationStatus": "New Intake Received",
    "estimatedMonthlyStipend": "$1,950.00",
    "assignedIntakeCoordinator": "Jessica Morales",
    "notes": "Referral received via CareNexus Partner API gateway."
  }
}
```

---

## 🏗️ Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      CareNexus Web SPA                      │
│   (HTML5, Vanilla CSS3 Custom Design System, ES6+ Modules)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               High-Performance REST SOA Gateway             │
│            (Node.js Standard Library HTTP Service)          │
└──────────────┬───────────────┬───────────────┬──────────────┘
               │               │               │
               ▼               ▼               ▼
      ┌────────────────┐┌──────────────┐┌──────────────┐
      │ Caregiver & ADL││ Daily Logs & ││  Referrals   │
      │ Profile Service││ Coaching SOA ││Intake Service│
      └────────────────┘└──────────────┘└──────────────┘
```

- **Frontend Application**:
  - Semantic HTML5 structure with responsive side navigation and accessibility attributes.
  - Bespoke Vanilla CSS3 design system using HSL color tokens, dark glassmorphism (`backdrop-filter`), CSS Grid/Flexbox layouts, and Google Fonts (`Inter`, `Outfit`, `JetBrains Mono`).
  - Modular JavaScript ES6+ state management, async REST client, and integrated REST API Explorer.
- **Backend & REST Gateway**:
  - High-performance, zero-dependency Node.js HTTP REST service.
  - Complete CORS preflight handling, JSON body parsing, route pattern matching, query parameter filtering, and realistic mock datastores.

---

## 📄 License
This project is open-source and released under the [MIT License](LICENSE).
