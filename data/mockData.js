/**
 * CareNexus Partner Platform - Realistic Domain Mock Data
 * Comprehensive datasets for Caregivers, Care Recipients, Daily Care Logs,
 * Clinical Coaching Sessions, and Health System Partner Referrals.
 */

const initialCaregivers = [
  {
    id: "cg-101",
    fullName: "Maria Rodriguez",
    email: "maria.rodriguez@familycare.net",
    phone: "(555) 234-8901",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    relationship: "Daughter & Primary Caregiver",
    programEnrollment: "Structured Family Caregiving (SFC)",
    careRecipientId: "cr-201",
    careRecipientName: "Rosa Rodriguez",
    assignedCoach: "Sarah Jenkins, RN",
    status: "Active",
    wellnessScore: 84,
    hoursPerWeek: 40,
    monthlyStipend: "$2,240.00",
    joinedDate: "2025-03-15",
    lastCheckIn: "2026-09-01T08:30:00Z",
    emergencyContact: "Carlos Rodriguez (Brother) - (555) 234-8909",
    cityState: "Atlanta, GA",
    notes: "Consistently logs morning vitals. Highly proactive with physical therapy exercises."
  },
  {
    id: "cg-102",
    fullName: "James 'Jim' Henderson",
    email: "jim.henderson@caremail.org",
    phone: "(555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    relationship: "Spouse",
    programEnrollment: "VA Comprehensive Assistance for Family Caregivers",
    careRecipientId: "cr-202",
    careRecipientName: "Margaret Henderson",
    assignedCoach: "Marcus Vance, LCSW",
    status: "High Support",
    wellnessScore: 62,
    hoursPerWeek: 45,
    monthlyStipend: "$2,650.00",
    joinedDate: "2024-11-10",
    lastCheckIn: "2026-08-31T17:15:00Z",
    emergencyContact: "Emily Henderson (Daughter) - (555) 345-6790",
    cityState: "San Antonio, TX",
    notes: "Experiencing sleep disruption due to spouse's sundowning symptoms. Respite support requested."
  },
  {
    id: "cg-103",
    fullName: "Amina Al-Mansoor",
    email: "amina.mansoor@caremail.org",
    phone: "(555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    relationship: "Daughter-in-law",
    programEnrollment: "Medicaid LTSS Waiver Program",
    careRecipientId: "cr-203",
    careRecipientName: "Tariq Al-Mansoor",
    assignedCoach: "Elena Rostova, BSN",
    status: "Active",
    wellnessScore: 91,
    hoursPerWeek: 35,
    monthlyStipend: "$1,980.00",
    joinedDate: "2025-06-01",
    lastCheckIn: "2026-09-01T09:00:00Z",
    emergencyContact: "Zayd Al-Mansoor (Husband) - (555) 456-7899",
    cityState: "Dearborn, MI",
    notes: "Excellent compliance with diabetic meal planning and insulin administration logs."
  },
  {
    id: "cg-104",
    fullName: "Marcus Chen",
    email: "marcus.chen@homecare.io",
    phone: "(555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    relationship: "Son",
    programEnrollment: "Structured Family Caregiving (SFC)",
    careRecipientId: "cr-204",
    careRecipientName: "Wei-Ling Chen",
    assignedCoach: "Sarah Jenkins, RN",
    status: "Active",
    wellnessScore: 78,
    hoursPerWeek: 30,
    monthlyStipend: "$1,750.00",
    joinedDate: "2025-09-18",
    lastCheckIn: "2026-08-30T14:20:00Z",
    emergencyContact: "Joyce Chen (Sister) - (555) 567-8911",
    cityState: "Seattle, WA",
    notes: "Balancing remote work with elder care. Mobility transfer coaching completed."
  },
  {
    id: "cg-105",
    fullName: "Deborah Kowalski",
    email: "deb.kowalski@carehub.com",
    phone: "(555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    relationship: "Sister",
    programEnrollment: "PACE Family Care Support",
    careRecipientId: "cr-205",
    careRecipientName: "Stanley Kowalski",
    assignedCoach: "David Kim, MSW",
    status: "Onboarding",
    wellnessScore: 70,
    hoursPerWeek: 28,
    monthlyStipend: "$1,600.00",
    joinedDate: "2026-08-15",
    lastCheckIn: "2026-08-29T11:45:00Z",
    emergencyContact: "Robert Kowalski (Nephew) - (555) 678-9022",
    cityState: "Chicago, IL",
    notes: "Recently completed initial caregiver health assessment and HIPAA onboarding orientation."
  },
  {
    id: "cg-106",
    fullName: "Latoya Washington",
    email: "latoya.w@familynetwork.org",
    phone: "(555) 789-0123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    relationship: "Daughter",
    programEnrollment: "Structured Family Caregiving (SFC)",
    careRecipientId: "cr-206",
    careRecipientName: "Bernice Washington",
    assignedCoach: "Sarah Jenkins, RN",
    status: "Active",
    wellnessScore: 89,
    hoursPerWeek: 38,
    monthlyStipend: "$2,150.00",
    joinedDate: "2025-01-20",
    lastCheckIn: "2026-09-01T07:45:00Z",
    emergencyContact: "Andre Washington (Brother) - (555) 789-0129",
    cityState: "Charlotte, NC",
    notes: "Care recipient showing stabilized blood pressure after updated medication regimen."
  }
];

const initialCareRecipients = [
  {
    id: "cr-201",
    fullName: "Rosa Rodriguez",
    age: 79,
    gender: "Female",
    dateOfBirth: "1947-04-12",
    caregiverId: "cg-101",
    caregiverName: "Maria Rodriguez",
    primaryConditions: [
      "Dementia (Alzheimer's Type - Moderate)",
      "Essential Hypertension",
      "Osteoarthritis of Knees"
    ],
    acuityTier: "Tier 3 - High Acuity",
    adlScores: {
      bathing: "Extensive Assistance",
      dressing: "Limited Assistance",
      toileting: "Supervision",
      mobility: "Limited Assistance (Walker)",
      medicationManagement: "Dependent",
      mealPreparation: "Dependent"
    },
    vitalsLatest: {
      bloodPressure: "128/82 mmHg",
      heartRate: "72 bpm",
      bloodGlucose: "108 mg/dL",
      o2Saturation: "98%",
      weight: "142 lbs",
      recordedAt: "2026-09-01T08:15:00Z"
    },
    allergies: ["Penicillin", "Sulfa Drugs"],
    primaryPhysician: "Dr. Arthur Vance, MD - Emory Geriatrics",
    emergencyHospital: "Emory University Hospital Midtown",
    fallRiskLevel: "Moderate",
    carePlanGoals: [
      "Maintain daily 15-minute guided indoor walking",
      "Prevent nighttime disorientation via consistent bedtime ritual",
      "Maintain systolic BP < 135 mmHg"
    ]
  },
  {
    id: "cr-202",
    fullName: "Margaret Henderson",
    age: 82,
    gender: "Female",
    dateOfBirth: "1944-09-23",
    caregiverId: "cg-102",
    caregiverName: "James Henderson",
    primaryConditions: [
      "Post-Ischemic Stroke (Right Hemiparesis)",
      "Vascular Dementia",
      "Atrial Fibrillation"
    ],
    acuityTier: "Tier 3 - High Acuity",
    adlScores: {
      bathing: "Dependent",
      dressing: "Extensive Assistance",
      toileting: "Extensive Assistance",
      mobility: "Extensive Assistance (Wheelchair / Pivot Transfer)",
      medicationManagement: "Dependent",
      mealPreparation: "Dependent"
    },
    vitalsLatest: {
      bloodPressure: "138/88 mmHg",
      heartRate: "68 bpm (Irregular)",
      bloodGlucose: "114 mg/dL",
      o2Saturation: "96%",
      weight: "135 lbs",
      recordedAt: "2026-08-31T17:00:00Z"
    },
    allergies: ["Codeine"],
    primaryPhysician: "Dr. Evelyn Morales, MD - Audie L. Murphy VA Hospital",
    emergencyHospital: "San Antonio VA Medical Center",
    fallRiskLevel: "High",
    carePlanGoals: [
      "Prevent pressure injuries with 2-hour repositioning log",
      "Speech therapy swallowing protocol for pureed nutrition",
      "Monitor anticoagulant adherence daily"
    ]
  },
  {
    id: "cr-203",
    fullName: "Tariq Al-Mansoor",
    age: 84,
    gender: "Male",
    dateOfBirth: "1942-02-18",
    caregiverId: "cg-103",
    caregiverName: "Amina Al-Mansoor",
    primaryConditions: [
      "Type 2 Diabetes Mellitus with Neuropathy",
      "Chronic Kidney Disease Stage 3b",
      "Congestive Heart Failure (NYHA Class II)"
    ],
    acuityTier: "Tier 2 - Moderate Acuity",
    adlScores: {
      bathing: "Supervision & Setup",
      dressing: "Independent with adaptive aids",
      toileting: "Independent",
      mobility: "Supervision (Cane)",
      medicationManagement: "Extensive Assistance",
      mealPreparation: "Dependent (Low Sodium / Renal Diet)"
    },
    vitalsLatest: {
      bloodPressure: "122/76 mmHg",
      heartRate: "70 bpm",
      bloodGlucose: "126 mg/dL",
      o2Saturation: "97%",
      weight: "168 lbs",
      recordedAt: "2026-09-01T08:45:00Z"
    },
    allergies: ["Latex", "ACE Inhibitors (Cough)"],
    primaryPhysician: "Dr. Farooq Hassan, MD - Beaumont Nephrology",
    emergencyHospital: "Corewell Health Beaumont Hospital",
    fallRiskLevel: "Low-Moderate",
    carePlanGoals: [
      "Daily morning dry weight tracking to detect fluid retention",
      "Maintain fasting glucose between 90-130 mg/dL",
      "Strict 1,500mg sodium daily diet"
    ]
  },
  {
    id: "cr-204",
    fullName: "Wei-Ling Chen",
    age: 76,
    gender: "Female",
    dateOfBirth: "1950-11-04",
    caregiverId: "cg-104",
    caregiverName: "Marcus Chen",
    primaryConditions: [
      "Parkinson's Disease (Hoehn & Yahr Stage 3)",
      "Osteoporosis",
      "Orthostatic Hypotension"
    ],
    acuityTier: "Tier 2 - Moderate Acuity",
    adlScores: {
      bathing: "Limited Assistance",
      dressing: "Limited Assistance (Button hooks)",
      toileting: "Supervision",
      mobility: "Limited Assistance (Laser cueing walker)",
      medicationManagement: "Extensive Assistance (Carbidopa/Levodopa timing)",
      mealPreparation: "Dependent"
    },
    vitalsLatest: {
      bloodPressure: "118/74 mmHg (Sitting) / 104/68 (Standing)",
      heartRate: "76 bpm",
      bloodGlucose: "98 mg/dL",
      o2Saturation: "99%",
      weight: "118 lbs",
      recordedAt: "2026-08-30T14:00:00Z"
    },
    allergies: ["Aspirin (GI upset)"],
    primaryPhysician: "Dr. Kenneth Tanaka, MD - UW Movement Disorders",
    emergencyHospital: "UW Medical Center - Montlake",
    fallRiskLevel: "High",
    carePlanGoals: [
      "Precise 4-hour interval timing for Parkinson medication",
      "Twice daily seated gentle stretching routines",
      "Prevent freezing of gait incidents with floor markers"
    ]
  },
  {
    id: "cr-205",
    fullName: "Stanley Kowalski",
    age: 73,
    gender: "Male",
    dateOfBirth: "1953-06-30",
    caregiverId: "cg-105",
    caregiverName: "Deborah Kowalski",
    primaryConditions: [
      "Severe COPD (Gold Stage 3)",
      "Pulmonary Hypertension",
      "Peripheral Vascular Disease"
    ],
    acuityTier: "Tier 2 - Moderate Acuity",
    adlScores: {
      bathing: "Extensive Assistance (Energy Conservation / Shower Chair)",
      dressing: "Limited Assistance",
      toileting: "Supervision",
      mobility: "Limited Assistance (Supplemental O2 2.5L/min)",
      medicationManagement: "Dependent (Inhaler / Nebulizer)",
      mealPreparation: "Dependent"
    },
    vitalsLatest: {
      bloodPressure: "132/84 mmHg",
      heartRate: "82 bpm",
      bloodGlucose: "102 mg/dL",
      o2Saturation: "93% on 2.5L O2",
      weight: "174 lbs",
      recordedAt: "2026-08-29T11:00:00Z"
    },
    allergies: ["Contrast Dye"],
    primaryPhysician: "Dr. Gregory Miller, MD - Northwestern Pulmonology",
    emergencyHospital: "Northwestern Memorial Hospital",
    fallRiskLevel: "Moderate",
    carePlanGoals: [
      "Maintain continuous daytime O2 saturation >= 92%",
      "Administer nebulizer therapy 3x daily",
      "Pursed-lip breathing technique reinforcement"
    ]
  },
  {
    id: "cr-206",
    fullName: "Bernice Washington",
    age: 81,
    gender: "Female",
    dateOfBirth: "1945-08-14",
    caregiverId: "cg-106",
    caregiverName: "Latoya Washington",
    primaryConditions: [
      "Hypertensive Cardiomyopathy",
      "Mild Cognitive Impairment",
      "Lumbar Spinal Stenosis"
    ],
    acuityTier: "Tier 2 - Moderate Acuity",
    adlScores: {
      bathing: "Limited Assistance (Grab bars)",
      dressing: "Supervision",
      toileting: "Independent",
      mobility: "Supervision (Quad Cane)",
      medicationManagement: "Limited Assistance (Pillbox Organizer)",
      mealPreparation: "Limited Assistance"
    },
    vitalsLatest: {
      bloodPressure: "124/78 mmHg",
      heartRate: "74 bpm",
      bloodGlucose: "105 mg/dL",
      o2Saturation: "98%",
      weight: "155 lbs",
      recordedAt: "2026-09-01T07:30:00Z"
    },
    allergies: ["None known"],
    primaryPhysician: "Dr. Courtney Hayes, MD - Atrium Health Senior Care",
    emergencyHospital: "Atrium Health Carolinas Medical Center",
    fallRiskLevel: "Low",
    carePlanGoals: [
      "Maintain systolic BP < 130 mmHg consistently",
      "Encourage daily 20-minute cognitive puzzles & memory exercises",
      "Maintain stable hydration intake (64 oz water daily)"
    ]
  }
];

const initialCareLogs = [
  {
    id: "log-301",
    caregiverId: "cg-101",
    caregiverName: "Maria Rodriguez",
    careRecipientId: "cr-201",
    careRecipientName: "Rosa Rodriguez",
    timestamp: "2026-09-01T08:30:00Z",
    shiftType: "Morning",
    recipientMood: "Calm & Cheerful",
    adlsCompleted: ["Bathing Assistance", "Morning Medications", "Breakfast Preparation", "Range of Motion Exercises"],
    medicationAdherence: "Full - All doses taken on schedule with applesauce",
    vitals: {
      bloodPressure: "128/82",
      heartRate: 72,
      bloodGlucose: 108,
      temperature: 98.4
    },
    hoursOfSleep: 7.5,
    behavioralObservations: "Rosa had a restful night with no disorientation. Enjoyed listening to Spanish bolero music during breakfast. Walked 250 paces in the garden with walker assistance.",
    incidentReported: false,
    incidentDetails: null,
    flaggedForCoach: false,
    coachReviewStatus: "Reviewed"
  },
  {
    id: "log-302",
    caregiverId: "cg-102",
    caregiverName: "James Henderson",
    careRecipientId: "cr-202",
    careRecipientName: "Margaret Henderson",
    timestamp: "2026-08-31T17:15:00Z",
    shiftType: "Afternoon",
    recipientMood: "Agitated / Mild Confusion",
    adlsCompleted: ["Transfer to Recliner", "Pureed Lunch Assistance", "Afternoon Hydration", "Skin Check"],
    medicationAdherence: "Full - Anticoagulant & BP pills verified",
    vitals: {
      bloodPressure: "138/88",
      heartRate: 68,
      bloodGlucose: 114,
      temperature: 98.6
    },
    hoursOfSleep: 5.0,
    behavioralObservations: "Margaret showed sundowning agitation around 4:30 PM, attempting to stand unassisted from wheelchair. James used calm verbal redirection and aroma therapy. Skin check clear on sacrum.",
    incidentReported: false,
    incidentDetails: null,
    flaggedForCoach: true,
    coachReviewStatus: "Action Required"
  },
  {
    id: "log-303",
    caregiverId: "cg-103",
    caregiverName: "Amina Al-Mansoor",
    careRecipientId: "cr-203",
    careRecipientName: "Tariq Al-Mansoor",
    timestamp: "2026-09-01T09:00:00Z",
    shiftType: "Morning",
    recipientMood: "Alert & Cooperative",
    adlsCompleted: ["Diabetic Foot Inspection", "Fasting Glucose & Insulin Administration", "Low-Sodium Breakfast", "Medication Setup"],
    medicationAdherence: "Full - Insulin glargine 18 units administered subcutaneous",
    vitals: {
      bloodPressure: "122/76",
      heartRate: 70,
      bloodGlucose: 126,
      temperature: 97.9
    },
    hoursOfSleep: 8.0,
    behavioralObservations: "Fasting glucose stable at 126 mg/dL. No edema observed in lower extremities. Foot inspection clean with no redness or skin breakdown.",
    incidentReported: false,
    incidentDetails: null,
    flaggedForCoach: false,
    coachReviewStatus: "Reviewed"
  },
  {
    id: "log-304",
    caregiverId: "cg-104",
    caregiverName: "Marcus Chen",
    careRecipientId: "cr-204",
    careRecipientName: "Wei-Ling Chen",
    timestamp: "2026-08-30T14:20:00Z",
    shiftType: "Afternoon",
    recipientMood: "Pleasant but Fatigued",
    adlsCompleted: ["Medication Timing (Carbidopa/Levodopa)", "Assisted Lunch", "Seated Balance Exercises"],
    medicationAdherence: "Full - 12:00 PM dose taken precisely on time",
    vitals: {
      bloodPressure: "118/74",
      heartRate: 76,
      bloodGlucose: 98,
      temperature: 98.2
    },
    hoursOfSleep: 6.5,
    behavioralObservations: "Noticed mild hand tremor increase prior to noon dose, which subsided 30 mins after medication. Completed 15 minutes of physical therapy balance drills successfully.",
    incidentReported: false,
    incidentDetails: null,
    flaggedForCoach: false,
    coachReviewStatus: "Reviewed"
  },
  {
    id: "log-305",
    caregiverId: "cg-106",
    caregiverName: "Latoya Washington",
    careRecipientId: "cr-206",
    careRecipientName: "Bernice Washington",
    timestamp: "2026-09-01T07:45:00Z",
    shiftType: "Morning",
    recipientMood: "Energetic & Talkative",
    adlsCompleted: ["Morning Medication Organizer", "Breakfast Preparation", "Assisted Shower with Grab Bar"],
    medicationAdherence: "Full - Lisinopril and multivitamin taken with breakfast",
    vitals: {
      bloodPressure: "124/78",
      heartRate: 74,
      bloodGlucose: 105,
      temperature: 98.1
    },
    hoursOfSleep: 8.5,
    behavioralObservations: "Bernice reported zero lower back stiffness today. Completed shower safely with shower chair and grab bar. Mood is exceptionally high.",
    incidentReported: false,
    incidentDetails: null,
    flaggedForCoach: false,
    coachReviewStatus: "Reviewed"
  }
];

const initialCoachingSessions = [
  {
    id: "cs-401",
    caregiverId: "cg-101",
    caregiverName: "Maria Rodriguez",
    coachId: "coach-01",
    coachName: "Sarah Jenkins, RN",
    coachTitle: "Lead Clinical Care Coach",
    scheduledDate: "2026-08-28T14:00:00Z",
    durationMinutes: 45,
    sessionType: "Bi-Weekly Clinical & Wellness Review",
    caregiverBurnoutScore: 3, // 1 to 10 scale
    burnoutCategory: "Low Risk - Healthy Coping",
    clinicalSummary: "Maria is demonstrating exemplary caregiving routines. Rosa's blood pressure is well-controlled. Discussed summer hydration strategies and scheduling routine dental checkup with mobile geriatric dentist.",
    actionItems: [
      "Introduce 10-minute mindfulness breathing before evening routine",
      "Confirm mobile dentist appointment for late September",
      "Maintain current physical therapy walking log"
    ],
    status: "Completed"
  },
  {
    id: "cs-402",
    caregiverId: "cg-102",
    caregiverName: "James Henderson",
    coachId: "coach-02",
    coachName: "Marcus Vance, LCSW",
    coachTitle: "Caregiver Mental Health & Respite Specialist",
    scheduledDate: "2026-09-02T10:00:00Z",
    durationMinutes: 60,
    sessionType: "Urgent Burnout Intervention & Respite Coordination",
    caregiverBurnoutScore: 8,
    burnoutCategory: "Elevated Risk - High Strain",
    clinicalSummary: "James is displaying notable physical fatigue from nocturnal caregiver duties due to Margaret's sundowning. Urgent priority is activating 12 hours/week of VA-funded in-home respite aide.",
    actionItems: [
      "Submit VA Form 10-10CG respite authorization addendum",
      "Coordinate with local home care agency for Tuesday/Thursday respite coverage",
      "Recommend bedtime white noise sound machine to reduce nighttime awakenings"
    ],
    status: "Scheduled"
  },
  {
    id: "cs-403",
    caregiverId: "cg-103",
    caregiverName: "Amina Al-Mansoor",
    coachId: "coach-03",
    coachName: "Elena Rostova, BSN",
    coachTitle: "Chronic Disease Management Coach",
    scheduledDate: "2026-08-25T11:00:00Z",
    durationMinutes: 30,
    sessionType: "Nutritional & Renal Diet Optimization",
    caregiverBurnoutScore: 2,
    burnoutCategory: "Low Risk - Strong Family Support",
    clinicalSummary: "Reviewed Tariq's latest lab values (eGFR 44 mL/min). Amina has successfully adapted family recipes to meet strict sodium and potassium guidelines. Weight tracking protocol is functioning smoothly.",
    actionItems: [
      "Continue daily morning weight chart",
      "Share low-potassium vegetable substitution guide with family",
      "Follow up on quarterly nephrology clinic visit"
    ],
    status: "Completed"
  },
  {
    id: "cs-404",
    caregiverId: "cg-104",
    caregiverName: "Marcus Chen",
    coachId: "coach-01",
    coachName: "Sarah Jenkins, RN",
    coachTitle: "Lead Clinical Care Coach",
    scheduledDate: "2026-09-04T15:30:00Z",
    durationMinutes: 45,
    sessionType: "Mobility & Fall Prevention Assessment",
    caregiverBurnoutScore: 4,
    burnoutCategory: "Moderate - Work-Life Balancing",
    clinicalSummary: "Targeted session to review home safety modifications following recent Parkinson medication adjustments. Inspecting bathroom grab bar placement and bedroom pathway lighting.",
    actionItems: [
      "Complete home safety video walkthrough via portal",
      "Review laser cueing walker maintenance",
      "Discuss ergonomics of transfer assistance"
    ],
    status: "Scheduled"
  }
];

const initialPartnerReferrals = [
  {
    id: "ref-501",
    referringPartner: "MetroHealth Integrated Care Network",
    referrerContact: "Dr. Rachel Zhang, MD (Discharge Coordination)",
    referrerEmail: "r.zhang@metrohealth.org",
    patientName: "Evelyn Montgomery",
    patientDob: "1948-03-12",
    patientAge: 78,
    prospectiveCaregiverName: "David Montgomery",
    caregiverRelationship: "Son (Living in same household)",
    caregiverPhone: "(555) 890-1234",
    caregiverEmail: "david.montgomery@outlook.com",
    insurancePayer: "Anthem BlueCross BlueShield Medicaid LTSS",
    programRequested: "Structured Family Caregiving (SFC) Tier 2",
    clinicalSummary: "78yo female status-post CHF exacerbation and fall with mild left hip contusion. Discharged to home with son as sole round-the-clock caregiver. Son requires clinical coaching, ADL training, and caregiver monthly stipend authorization.",
    priorityLevel: "High",
    referralDate: "2026-08-28",
    authorizationStatus: "Authorized - Intake Scheduled",
    estimatedMonthlyStipend: "$2,100.00",
    assignedIntakeCoordinator: "Jessica Morales",
    notes: "Home safety evaluation scheduled for Sep 5, 2026. Caregiver confirmed receipt of portal welcome packet."
  },
  {
    id: "ref-502",
    referringPartner: "Horizon Senior Health Plan (Medicare Advantage)",
    referrerContact: "Karen O'Connor, RN (Case Manager)",
    referrerEmail: "k.oconnor@horizonhealth.com",
    patientName: "Harold Jenkins",
    patientDob: "1943-10-05",
    patientAge: 82,
    prospectiveCaregiverName: "Carol Jenkins",
    caregiverRelationship: "Spouse",
    caregiverPhone: "(555) 901-2345",
    caregiverEmail: "carol.jenkins@verizon.net",
    insurancePayer: "Horizon Medicare Advantage Dual-Eligible Special Needs Plan",
    programRequested: "Complex Caregiver Support & Telehealth Coaching",
    clinicalSummary: "82yo male with Moderate Vascular Dementia and recurrent urinary tract infections. Spouse Carol (79yo) is managing full-time care with escalating physical and emotional strain.",
    priorityLevel: "Urgent",
    referralDate: "2026-08-30",
    authorizationStatus: "In Clinical Triage Review",
    estimatedMonthlyStipend: "$1,850.00",
    assignedIntakeCoordinator: "Marcus Vance, LCSW",
    notes: "Clinical review prioritized due to spouse caregiver age and high burnout risk."
  },
  {
    id: "ref-503",
    referringPartner: "Valley Hospital Health System - Inpatient Rehab",
    referrerContact: "Thomas Bradley, MSW (Medical Social Worker)",
    referrerEmail: "tbradley@valleyhealthsystem.org",
    patientName: "Samuel 'Sam' Foster",
    patientDob: "1955-07-22",
    patientAge: 71,
    prospectiveCaregiverName: "Nicole Foster-Diaz",
    caregiverRelationship: "Daughter",
    caregiverPhone: "(555) 012-3456",
    caregiverEmail: "nicole.foster@gmail.com",
    insurancePayer: "State Medicaid Long-Term Care Waiver",
    programRequested: "Structured Family Caregiving (SFC) Tier 3",
    clinicalSummary: "71yo male recovering from traumatic spinal injury with partial paraparesis. Transitioning from inpatient rehabilitation to daughter's residence with specialized ramp and roll-in shower.",
    priorityLevel: "Standard",
    referralDate: "2026-08-31",
    authorizationStatus: "Pending Payer Authorization",
    estimatedMonthlyStipend: "$2,450.00",
    assignedIntakeCoordinator: "Jessica Morales",
    notes: "Awaiting final state waiver service authorization code from Department of Community Health."
  },
  {
    id: "ref-504",
    referringPartner: "Beacon Health Alliance ACO",
    referrerContact: "Dr. Sanjay Patel, MD (Geriatric Primary Care)",
    referrerEmail: "spatel@beaconaco.org",
    patientName: "Lucille Adams",
    patientDob: "1946-12-19",
    patientAge: 79,
    prospectiveCaregiverName: "Arthur Adams",
    caregiverRelationship: "Husband",
    caregiverPhone: "(555) 123-4567",
    caregiverEmail: "art.adams@aol.com",
    insurancePayer: "Humana Gold Plus HMO D-SNP",
    programRequested: "Family Caregiver Health & ADL Coaching",
    clinicalSummary: "79yo female with Alzheimer's Disease Stage 5 and severe osteoporosis. Arthur is managing all ADLs but needs structured coaching on transfer safety and respite services.",
    priorityLevel: "Standard",
    referralDate: "2026-09-01",
    authorizationStatus: "New Intake Received",
    estimatedMonthlyStipend: "$1,900.00",
    assignedIntakeCoordinator: "Unassigned",
    notes: "Referral submitted via electronic partner portal. Initial triage call queued for clinical coordinator."
  }
];

module.exports = {
  initialCaregivers,
  initialCareRecipients,
  initialCareLogs,
  initialCoachingSessions,
  initialPartnerReferrals
};
