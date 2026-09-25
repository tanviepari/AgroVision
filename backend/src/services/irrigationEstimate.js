/**
 * Planning estimates for one irrigation, in litres per acre.
 * These are round figures for this app, not sensor readings and not a scientific water-balance model.
 * One acre-inch of water is about 102,000 litres. The figures below are smaller single-irrigation
 * planning amounts for a surface or drip turn, scaled by crop stage.
 */
const LITRES_PER_ACRE = {
  Tomato: {
    Seedling: 8000,
    Vegetative: 15000,
    Flowering: 20000,
    Fruiting: 22000,
    Maturity: 15000,
    'Harvest ready': 8000,
  },
  Cotton: {
    Seedling: 7000,
    Vegetative: 14000,
    Flowering: 18000,
    Fruiting: 18000,
    Maturity: 12000,
    'Harvest ready': 7000,
  },
  Wheat: {
    Seedling: 10000,
    Vegetative: 18000,
    Flowering: 22000,
    Fruiting: 20000,
    Maturity: 14000,
    'Harvest ready': 6000,
  },
  Rice: {
    Seedling: 20000,
    Vegetative: 35000,
    Flowering: 40000,
    Fruiting: 35000,
    Maturity: 25000,
    'Harvest ready': 10000,
  },
  Sugarcane: {
    Seedling: 15000,
    Vegetative: 28000,
    Flowering: 30000,
    Fruiting: 30000,
    Maturity: 25000,
    'Harvest ready': 12000,
  },
};

export function estimateIrrigation({ crop, cropStage, areaAcres }) {
  const table = LITRES_PER_ACRE[crop];
  const perAcre = table?.[cropStage];
  if (!perAcre || !areaAcres) {
    return null;
  }
  const waterNeededLiters = Math.round(perAcre * Number(areaAcres));
  return {
    waterNeededLiters,
    isEstimate: true,
    moistureAvailable: false,
    why: `This is an estimate for one watering of ${crop} at the ${cropStage.toLowerCase()} stage, based on the field area. It is not a soil sensor reading.`,
  };
}
