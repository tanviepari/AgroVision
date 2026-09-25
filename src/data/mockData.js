/**
 * Centralized AgroVision mock data.
 * Structured so UI can later swap this for API responses.
 * Everything is keyed to a field where relevant.
 */

export const PROBLEM_TYPES = [
  { id: 'yellow_leaves', label: 'Yellow leaves', icon: 'leaf' },
  { id: 'pest', label: 'Pest problem', icon: 'bug' },
  { id: 'drying', label: 'Crop drying', icon: 'sun' },
  { id: 'slow_growth', label: 'Slow growth', icon: 'sprout' },
  { id: 'too_much_water', label: 'Too much water', icon: 'droplets' },
  { id: 'not_enough_water', label: 'Not enough water', icon: 'droplet' },
  { id: 'other', label: 'Other', icon: 'help' },
];

export const CROP_OPTIONS = [
  { id: 'tomato', label: 'Tomato' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'corn', label: 'Corn' },
  { id: 'rice', label: 'Rice' },
  { id: 'cotton', label: 'Cotton' },
  { id: 'soybean', label: 'Soybean' },
];

export const SOIL_OPTIONS = ['Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty'];

export const CROP_STAGES = [
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Maturity',
  'Harvest ready',
];

export const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu'];

/** Simple weather for Field Overview hero */
export const weatherData = {
  temperature: 24,
  condition: 'Clear & Sunny',
  humidity: 42,
};

/** Initial farmer profile */
export const initialFarmer = {
  id: 'farmer-1',
  name: 'Ravi Kumar',
  contact: '+91 98765 43210',
  email: 'ravi@example.com',
  location: 'Nashik, Maharashtra',
  preferredLanguage: 'English',
  farmName: 'Green Valley Farm',
};

/** Primary demo field — tomato */
export const initialFields = [
  {
    id: 'field-1',
    name: 'Green Valley Field',
    location: 'Nashik, Maharashtra',
    areaAcres: 1.5,
    crop: 'Tomato',
    cropVariety: 'Hybrid 440',
    soilType: 'Loamy',
    sowingDate: '2026-07-10',
    cropStage: 'Flowering',
    cropStageProgress: 68,
    health: 'good', // good | attention | poor
    healthLabel: 'Good',
  },
];

/** Irrigation recommendation per field */
export const initialIrrigationRecommendations = {
  'field-1': {
    waterNeededLiters: 320,
    nextWatering: { label: 'Today', time: '6:00 PM' },
    moisturePercent: 34,
    moistureStatus: 'low', // low | ok | high
    why: 'Your field needs more water today because the soil moisture is below the recommended level.',
    upcoming: [
      { id: 'up-1', date: 'Today', time: '6:00 PM', amountLiters: 320 },
      { id: 'up-2', date: '28 Sep', time: '6:00 AM', amountLiters: 280 },
    ],
  },
};

/** Past irrigation records */
export const initialIrrigationRecords = {
  'field-1': [
    {
      id: 'irr-1',
      date: '2026-09-21',
      dateLabel: '21 Sep',
      amountLiters: 280,
      status: 'completed',
      durationMinutes: 45,
    },
    {
      id: 'irr-2',
      date: '2026-09-18',
      dateLabel: '18 Sep',
      amountLiters: 300,
      status: 'completed',
      durationMinutes: 50,
    },
    {
      id: 'irr-3',
      date: '2026-09-15',
      dateLabel: '15 Sep',
      amountLiters: 260,
      status: 'completed',
      durationMinutes: 40,
    },
  ],
};

/** Yield forecast per field */
export const initialYieldForecasts = {
  'field-1': {
    expectedTonnes: 2.4,
    harvestInDaysMin: 18,
    harvestInDaysMax: 24,
    cropProgress: 68,
    history: [
      { date: '10 Sep', tonnes: 2.6 },
      { date: '17 Sep', tonnes: 2.5 },
      { date: '24 Sep', tonnes: 2.4 },
    ],
    factors: [
      { id: 'f1', label: 'Crop health', value: 'Good' },
      { id: 'f2', label: 'Crop stage', value: 'Flowering' },
      { id: 'f3', label: 'Recent issues', value: 'Leaf spot (watching)' },
      { id: 'f4', label: 'Irrigation', value: 'On track' },
    ],
  },
};

/** Disease scan history */
export const initialDiseaseScans = {
  'field-1': [
    {
      id: 'scan-1',
      date: '2026-09-23',
      dateLabel: '23 Sep',
      issue: 'Possible Leaf Spot',
      severity: 'Moderate',
      explanation: 'Some leaves show signs of leaf spot.',
      treatment: [
        'Remove badly affected leaves',
        'Apply the recommended treatment',
        'Avoid excess moisture around the leaves',
      ],
      followUp: 'Check the crop again in 2–3 days.',
      imagePreview: null,
    },
  ],
};

/** Mock result returned after a new scan (frontend simulation) */
export const mockScanResult = {
  issue: 'Possible Leaf Spot',
  severity: 'Moderate',
  explanation: 'Some leaves show signs of leaf spot.',
  treatment: [
    'Remove badly affected leaves',
    'Apply the recommended treatment',
    'Avoid excess moisture around the leaves',
  ],
  followUp: 'Check the crop again in 2–3 days.',
};

/** Farmer-reported issues */
export const initialReportedIssues = {
  'field-1': [
    {
      id: 'issue-1',
      date: '2026-09-23',
      dateLabel: '23 Sep',
      type: 'yellow_leaves',
      label: 'Yellow leaves',
      description: 'Lower leaves turning yellow near the north edge.',
      photo: null,
    },
  ],
};

/**
 * Unified field activity timeline (newest first).
 * type: scan | disease | problem | irrigation | stage | yield | recommendation
 */
export const initialFieldActivity = {
  'field-1': [
    {
      id: 'act-1',
      date: '2026-09-25',
      dateLabel: 'Today',
      type: 'recommendation',
      title: 'Irrigation recommendation updated',
      detail: '320 L needed today',
    },
    {
      id: 'act-2',
      date: '2026-09-24',
      dateLabel: 'Yesterday',
      type: 'scan',
      title: 'Crop scan completed',
      detail: 'Possible leaf spot',
    },
    {
      id: 'act-3',
      date: '2026-09-23',
      dateLabel: '23 Sep',
      type: 'problem',
      title: 'Problem reported',
      detail: 'Yellow leaves',
    },
    {
      id: 'act-4',
      date: '2026-09-21',
      dateLabel: '21 Sep',
      type: 'irrigation',
      title: 'Irrigation completed',
      detail: '280 L',
    },
    {
      id: 'act-5',
      date: '2026-09-18',
      dateLabel: '18 Sep',
      type: 'yield',
      title: 'Yield forecast updated',
      detail: '2.4 tonnes',
    },
    {
      id: 'act-6',
      date: '2026-09-10',
      dateLabel: '10 Sep',
      type: 'stage',
      title: 'Crop stage updated',
      detail: 'Entered flowering',
    },
  ],
};

/** Notifications tied to AgroVision workflows */
export const initialNotifications = [
  {
    id: 'n1',
    type: 'irrigation',
    title: 'Watering needed',
    message: 'Your tomato field needs water today.',
    time: '2 hours ago',
    read: false,
    fieldId: 'field-1',
  },
  {
    id: 'n2',
    type: 'disease',
    title: 'Crop issue',
    message: 'A possible leaf spot was detected.',
    time: 'Yesterday',
    read: false,
    fieldId: 'field-1',
  },
  {
    id: 'n3',
    type: 'yield',
    title: 'Forecast updated',
    message: 'Your expected yield has changed.',
    time: '2 days ago',
    read: true,
    fieldId: 'field-1',
  },
  {
    id: 'n4',
    type: 'crop',
    title: 'Crop update',
    message: 'Your crop is entering the flowering stage.',
    time: '2 weeks ago',
    read: true,
    fieldId: 'field-1',
  },
];
