// User & Weather
export const userProfile = {
  name: 'Sarah',
  farmLocation: 'Farm Sector A',
};

export const weatherData = {
  temperature: 24,
  condition: 'Clear & Sunny',
  humidity: 42,
};

// Dashboard
export const fieldSectors = [
  {
    id: 1,
    name: 'North Wheat Sector',
    hectares: 14.2,
    plantedDaysAgo: 42,
    crop: 'Wheat',
    moistureLevel: 42,
    status: 'HEALTHY',
    moistureLabel: 'Moisture Optimal (42%)',
  },
  {
    id: 2,
    name: 'East Corn Sector',
    hectares: 28.5,
    plantedDaysAgo: 12,
    crop: 'Corn',
    moistureLevel: 18,
    status: 'NEEDS_WATER',
    moistureLabel: 'Moisture Low (18%)',
  },
  {
    id: 3,
    name: 'South Soy Sector',
    hectares: 10.0,
    plantedDaysAgo: 0,
    crop: 'Soybeans',
    moistureLevel: 65,
    status: 'ALERT',
    moistureLabel: 'Risk Factor: Pest Suspected',
    isPreHarvest: true,
  },
];

export const soilConditions = {
  avgTemp: 18.5,
  nitrogenLevel: 'Optimal',
  phLevel: 6.8,
  tempTrend: [
    { day: 'Mon', temp: 12 },
    { day: 'Tue', temp: 14 },
    { day: 'Wed', temp: 15 },
    { day: 'Thu', temp: 16 },
    { day: 'Fri', temp: 17 },
    { day: 'Sat', temp: 18 },
    { day: 'Sun', temp: 18.5 },
  ],
};

// Disease Scan - Sample Results
export const diseaseResults = [
  {
    id: 1,
    plantImage:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=500&fit=crop',
    diseaseName: 'No Disease Detected',
    severity: 'N/A',
    leafIntegrity: 100,
    aiScore: 98,
    status: 'HEALTHY',
    label: 'HEALTHY PLANT: VIGOROUS STATUS',
  },
  {
    id: 2,
    plantImage:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&h=500&fit=crop',
    diseaseName: 'Northern Leaf Blight',
    severity: 'High',
    leafIntegrity: 45,
    aiScore: 91,
    status: 'CRITICAL',
    label: 'DISEASE DETECTED: NORTHERN LEAF BLIGHT',
  },
];

// Irrigation
export const irrigationSectors = [
  { id: 1, sectorName: 'Sector Alpha', crop: 'Wheat', moisturePercent: 68, status: 'OPTIMAL' },
  { id: 2, sectorName: 'Sector Beta', crop: 'Corn', moisturePercent: 32, status: 'DRY' },
  { id: 3, sectorName: 'Sector Gamma', crop: 'Soybeans', moisturePercent: 75, status: 'OPTIMAL' },
  { id: 4, sectorName: 'Sector Delta', crop: 'Wheat', moisturePercent: 60, status: 'OPTIMAL' },
];

export const irrigationSchedule = [
  {
    time: '14:00',
    day: 'TODAY',
    sector: 'Sector Gamma',
    type: 'Scheduled light soak (30 mins)',
  },
  {
    time: '05:30',
    day: 'TMRW',
    sector: 'Sector Alpha',
    type: 'Deep saturation cycle',
  },
  {
    time: '06:00',
    day: 'WED',
    sector: 'Sector Delta',
    type: 'Standard maintenance',
  },
];

export const conservationData = {
  gallonsSaved: '1.2M',
  description: 'This season compared to traditional schedules.',
  trend: [
    { label: 'Q1', value: 45 },
    { label: 'Q2', value: 62 },
    { label: 'Q3', value: 78 },
    { label: 'Q4', value: 92 },
  ],
};

// Yield Forecast
export const yieldForecast = {
  season: 'SEASON 2024 / CORN',
  expectedHarvest: 4.2,
  trendPercent: 12,
  confidencePercent: 88,
  historicalData: [
    { year: '2021', yield: 3.5 },
    { year: '2022', yield: 3.8 },
    { year: '2023', yield: 3.9 },
    { year: '2024', yield: 4.2 },
  ],
};

export const influenceFactors = [
  {
    id: 1,
    title: 'Ideal Rainfall Accumulation',
    description: 'Current moisture levels are optimal for ear development.',
    impact: 'High Impact',
    icon: 'droplet',
  },
  {
    id: 2,
    title: 'Consistent Degree Days',
    description: 'Steady temperatures accelerating maturity.',
    impact: 'Medium Impact',
    icon: 'thermometer',
  },
  {
    id: 3,
    title: 'Slightly Low Nitrogen in Sector B',
    description: 'Early signs of deficiency detected in latest soil scan.',
    impact: 'Action Needed',
    icon: 'alert',
  },
];

export const smartRecommendations = [
  {
    id: 1,
    title: 'Apply Nitrogen Booster',
    description: 'Target Sector B within the next 48 hours to mitigate yield loss.',
  },
  {
    id: 2,
    title: 'Adjust Irrigation Schedule',
    description: 'Reduce watering in Sector A by 10% due to upcoming rain forecast.',
  },
];
