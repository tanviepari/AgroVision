import { asyncHandler } from '../utils/asyncHandler.js';

export const getWeather = asyncHandler(async (req, res) => {
  const key = process.env.OPENWEATHER_API_KEY;
  const place = String(req.query.location || '').trim();
  if (!key || !place) {
    res.json({
      available: false,
      message: 'Weather information is not available right now.',
    });
    return;
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q', place);
  url.searchParams.set('units', 'metric');
  url.searchParams.set('appid', key);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.json({ available: false, message: 'Weather information is not available right now.' });
      return;
    }
    const data = await response.json();
    res.json({
      available: true,
      temperature: Math.round(data.main?.temp),
      condition: data.weather?.[0]?.description || 'Weather',
      humidity: data.main?.humidity,
    });
  } catch {
    res.json({ available: false, message: 'Weather information is not available right now.' });
  }
});
