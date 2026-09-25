import { DiseaseScan } from '../models/DiseaseScan.js';
import { ProblemReport } from '../models/ProblemReport.js';
import { YieldForecast } from '../models/YieldForecast.js';
import { estimateYield } from './yieldEstimate.js';
import { logActivity } from './activity.js';
import { notifyUser } from './notifications.js';
import { formatDateLabel } from '../utils/dates.js';

export async function fieldHealth(userId, fieldId) {
  const scan = await DiseaseScan.findOne({ user: userId, field: fieldId, status: 'saved' }).sort({ createdAt: -1 });
  const problem = await ProblemReport.findOne({ user: userId, field: fieldId }).sort({ createdAt: -1 });
  if (scan) return { health: 'attention', healthLabel: 'Needs a look' };
  if (problem) return { health: 'attention', healthLabel: 'Needs a look' };
  return { health: 'unchecked', healthLabel: 'Not checked' };
}

export async function refreshYieldForecast(field, { notify = false } = {}) {
  const [scan, problem] = await Promise.all([
    DiseaseScan.exists({ user: field.user, field: field._id, status: 'saved' }),
    ProblemReport.exists({ user: field.user, field: field._id }),
  ]);
  const estimate = estimateYield({
    crop: field.crop,
    cropStage: field.cropStage,
    areaAcres: field.areaAcres,
    sowingDate: field.sowingDate,
    hasOpenProblem: Boolean(problem),
    hasSavedScan: Boolean(scan),
  });
  if (!estimate) return null;

  const previous = await YieldForecast.findOne({ user: field.user, field: field._id }).sort({ createdAt: -1 });
  if (previous && previous.expectedTonnes === estimate.expectedTonnes && previous.cropStage === estimate.cropStage) {
    return previous;
  }

  const saved = await YieldForecast.create({
    user: field.user,
    field: field._id,
    ...estimate,
  });

  await logActivity({
    user: field.user,
    field: field._id,
    type: 'yield',
    title: 'Yield forecast updated',
    detail: `${estimate.expectedTonnes} tonnes (estimate)`,
    refModel: 'YieldForecast',
    refId: saved._id,
  });

  if (notify && previous && previous.expectedTonnes !== estimate.expectedTonnes) {
    await notifyUser({
      userId: field.user,
      fieldId: field._id,
      type: 'yield',
      title: 'Forecast updated',
      message: `The estimated yield for ${field.name} is now ${estimate.expectedTonnes} tonnes.`,
      link: '/app/yield',
      dedupeKey: `yield:${saved._id}`,
    });
  }

  return saved;
}

export function presentForecast(latest, historyDocs) {
  if (!latest) return null;
  const history = [...historyDocs]
    .reverse()
    .slice(-8)
    .map((item) => ({
      date: formatDateLabel(item.createdAt),
      tonnes: item.expectedTonnes,
    }));
  return {
    expectedTonnes: latest.expectedTonnes,
    harvestInDaysMin: latest.harvestInDaysMin,
    harvestInDaysMax: latest.harvestInDaysMax,
    cropProgress: latest.cropProgress,
    cropStage: latest.cropStage,
    factors: latest.factors,
    methodNote: latest.methodNote,
    isEstimate: true,
    history,
  };
}
