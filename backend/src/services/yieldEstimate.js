import { stageProgress } from '../utils/dates.js';

/**
 * Rule-of-thumb yield in tonnes per acre for irrigated conditions in India.
 * Sources of the order of magnitude: commonly cited average yields
 * (tomato about 25 t/ha, wheat about 3.5 t/ha, rice about 4 t/ha,
 * seed cotton about 1.5–2 t/ha, sugarcane about 80 t/ha).
 * Converted roughly to tonnes per acre and rounded. This is not a validated prediction model.
 */
const TONNES_PER_ACRE = {
  Tomato: 10,
  Cotton: 0.8,
  Wheat: 1.6,
  Rice: 2.2,
  Sugarcane: 32,
};

const STAGE_FACTOR = {
  Seedling: 0.2,
  Vegetative: 0.55,
  Flowering: 0.75,
  Fruiting: 0.9,
  Maturity: 1,
  'Harvest ready': 1,
};

const DURATION_DAYS = {
  Tomato: 120,
  Cotton: 170,
  Wheat: 140,
  Rice: 130,
  Sugarcane: 360,
};

export function estimateYield({ crop, cropStage, areaAcres, sowingDate, hasOpenProblem, hasSavedScan }) {
  const base = TONNES_PER_ACRE[crop];
  const stageFactor = STAGE_FACTOR[cropStage];
  const duration = DURATION_DAYS[crop];
  if (!base || !stageFactor || !duration || !areaAcres || !sowingDate) return null;

  let healthFactor = 1;
  let healthLabel = 'No recorded issue';
  if (hasSavedScan) {
    healthFactor = 0.85;
    healthLabel = 'A saved scan is on record';
  } else if (hasOpenProblem) {
    healthFactor = 0.9;
    healthLabel = 'A problem was reported';
  }

  const expectedTonnes = Math.round(base * Number(areaAcres) * stageFactor * healthFactor * 10) / 10;
  const sown = new Date(sowingDate);
  const harvestDate = new Date(sown.getTime() + duration * 86400000);
  const daysLeft = Math.round((harvestDate.getTime() - Date.now()) / 86400000);
  const harvestInDaysMin = Math.max(0, daysLeft - 7);
  const harvestInDaysMax = Math.max(harvestInDaysMin, daysLeft + 7);

  return {
    expectedTonnes,
    harvestInDaysMin,
    harvestInDaysMax,
    cropProgress: stageProgress(cropStage),
    cropStage,
    isEstimate: true,
    methodNote:
      'Estimate = typical tonnes per acre for this crop × acres × stage factor × a small reduction if a problem or saved scan exists. It is not a scientific forecast.',
    factors: [
      { id: 'crop', label: 'Crop', value: crop },
      { id: 'area', label: 'Area', value: `${areaAcres} acres` },
      { id: 'stage', label: 'Crop stage', value: cropStage },
      { id: 'issues', label: 'Recorded issues', value: healthLabel },
    ],
  };
}
