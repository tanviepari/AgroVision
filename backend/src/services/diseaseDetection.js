import { ApiError } from '../utils/ApiError.js';

const DISCLAIMER =
  'This is a possible issue from the analysis service, not a confirmed diagnosis. If the crop does not improve, ask your local agriculture officer. No pesticide or dose is suggested here.';

export async function analyseCropImage({ imageUrl, crop }) {
  const endpoint = process.env.DISEASE_API_URL;
  if (!endpoint) {
    throw new ApiError(
      503,
      'The crop analysis service is not available right now. Please try again later.',
      'DISEASE_SERVICE_UNAVAILABLE'
    );
  }

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.DISEASE_API_KEY) {
    headers.Authorization = `Bearer ${process.env.DISEASE_API_KEY}`;
  }

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ imageUrl, crop }),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new ApiError(
      503,
      'The crop analysis service could not be reached. Please try again.',
      'DISEASE_SERVICE_UNAVAILABLE'
    );
  }

  if (!response.ok) {
    throw new ApiError(
      502,
      'The crop analysis service did not return a result. Please try again.',
      'DISEASE_SERVICE_FAILED'
    );
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(502, 'The crop analysis service sent a result we could not read.', 'DISEASE_SERVICE_FAILED');
  }

  const possibleIssue = String(body.possibleIssue || body.issue || '').trim();
  const explanation = String(body.explanation || '').trim();
  if (!possibleIssue || !explanation) {
    throw new ApiError(
      502,
      'The crop analysis service did not return a usable result. Please try again.',
      'DISEASE_SERVICE_FAILED'
    );
  }

  const confidence =
    typeof body.confidence === 'number' && body.confidence >= 0 && body.confidence <= 1
      ? body.confidence
      : null;

  return {
    cropName: String(body.cropName || crop || '').trim(),
    possibleIssue,
    confidence,
    explanation,
    symptoms: Array.isArray(body.symptoms) ? body.symptoms.map(String).slice(0, 8) : [],
    nextSteps: Array.isArray(body.nextSteps) ? body.nextSteps.map(String).slice(0, 6) : [],
    seekExpertWhen:
      String(body.seekExpertWhen || '').trim() ||
      'Ask an agriculture officer if the problem spreads or the crop looks worse in a few days.',
    disclaimer: DISCLAIMER,
  };
}
