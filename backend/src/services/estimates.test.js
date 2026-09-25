import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateIrrigation } from './irrigationEstimate.js';
import { estimateYield } from './yieldEstimate.js';

test('irrigation estimate scales by acres and stays labelled as an estimate', () => {
  const result = estimateIrrigation({ crop: 'Tomato', cropStage: 'Flowering', areaAcres: 1.5 });
  assert.equal(result.waterNeededLiters, 30000);
  assert.equal(result.isEstimate, true);
  assert.equal(result.moistureAvailable, false);
  assert.match(result.why, /not a soil sensor/i);
});

test('yield estimate uses area, stage, and a problem reduction', () => {
  const sown = new Date();
  sown.setDate(sown.getDate() - 40);
  const clear = estimateYield({
    crop: 'Wheat',
    cropStage: 'Vegetative',
    areaAcres: 2,
    sowingDate: sown,
    hasOpenProblem: false,
    hasSavedScan: false,
  });
  const withProblem = estimateYield({
    crop: 'Wheat',
    cropStage: 'Vegetative',
    areaAcres: 2,
    sowingDate: sown,
    hasOpenProblem: true,
    hasSavedScan: false,
  });
  assert.equal(clear.expectedTonnes, 1.8);
  assert.ok(withProblem.expectedTonnes < clear.expectedTonnes);
  assert.match(clear.methodNote, /not a scientific forecast/i);
});
