import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';

process.env.JWT_SECRET = 'test-secret-value';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.PUBLIC_BASE_URL = 'http://localhost:5000';
delete process.env.DISEASE_API_URL;
delete process.env.OPENWEATHER_API_KEY;
delete process.env.SMTP_HOST;

let server;
let base;
let memory;

async function json(path, { method = 'GET', token, body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) {
    payload = form;
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const response = await fetch(`${base}${path}`, { method, headers, body: payload });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

const farmer = {
  name: 'Ravi Kumar',
  mobile: '9876543210',
  email: 'ravi@example.com',
  password: 'secret123',
  confirmPassword: 'secret123',
  location: 'Nashik',
  state: 'Maharashtra',
  district: 'Nashik',
  termsAccepted: true,
};

test.before(async () => {
  memory = await MongoMemoryServer.create();
  await connectDb(memory.getUri());
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (memory) await memory.stop();
});

test('health, auth, fields, estimates, scans, and isolation', async () => {
  const health = await json('/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.data.db, 'connected');

  const bad = await json('/api/auth/register', { method: 'POST', body: { name: 'A' } });
  assert.equal(bad.status, 400);

  const registered = await json('/api/auth/register', { method: 'POST', body: farmer });
  assert.equal(registered.status, 201);
  const token = registered.data.token;

  const wrong = await json('/api/auth/login', {
    method: 'POST',
    body: { contact: '9876543210', password: 'nope' },
  });
  assert.equal(wrong.status, 401);

  const locked = await json('/api/fields');
  assert.equal(locked.status, 401);

  const field = await json('/api/fields', {
    method: 'POST',
    token,
    body: {
      farmName: 'Green Valley Farm',
      name: 'North plot',
      crop: 'Tomato',
      areaAcres: 1.5,
      soilType: 'Loamy',
      sowingDate: '2026-07-10',
      location: 'Nashik',
      cropStage: 'Flowering',
    },
  });
  assert.equal(field.status, 201);
  assert.equal(field.data.field.healthLabel, 'Not checked');
  const fieldId = field.data.field.id;

  const recommendation = await json(`/api/irrigation/recommendation?fieldId=${fieldId}`, { token });
  assert.equal(recommendation.status, 200);
  assert.equal(recommendation.data.recommendation.moistureAvailable, false);
  assert.equal(recommendation.data.recommendation.moisturePercent, null);

  const forecast = await json(`/api/yield?fieldId=${fieldId}`, { token });
  assert.equal(forecast.status, 200);
  assert.equal(forecast.data.forecast.isEstimate, true);
  assert.ok(forecast.data.forecast.expectedTonnes > 0);

  const weather = await json('/api/weather?location=Nashik', { token });
  assert.equal(weather.data.available, false);

  const form = new FormData();
  form.append('fieldId', fieldId);
  form.append('image', new Blob([Buffer.from('not-a-real-image')], { type: 'image/jpeg' }), 'leaf.jpg');
  const scan = await json('/api/scans/analyse', { method: 'POST', token, form });
  assert.equal(scan.status, 503);
  assert.equal(scan.data.code, 'DISEASE_SERVICE_UNAVAILABLE');

  const report = await json('/api/problems', {
    method: 'POST',
    token,
    body: { fieldId, category: 'yellow_leaves', description: 'Lower leaves are yellow.' },
  });
  assert.equal(report.status, 201);

  const notes = await json('/api/notifications', { token });
  assert.ok(notes.data.notifications.some((item) => item.type === 'disease'));

  const history = await json(`/api/activities?fieldId=${fieldId}&type=problem`, { token });
  assert.equal(history.data.activities.length, 1);

  const other = await json('/api/auth/register', {
    method: 'POST',
    body: { ...farmer, mobile: '9876543211', email: 'other@example.com', name: 'Meena Devi' },
  });
  const hidden = await json(`/api/fields/${fieldId}`, { token: other.data.token });
  assert.equal(hidden.status, 404);

  const record = await json('/api/irrigation/records', {
    method: 'POST',
    token,
    body: { fieldId, amountLiters: 12000, recordedAt: new Date().toISOString() },
  });
  assert.equal(record.status, 201);

  const removed = await json(`/api/fields/${fieldId}`, { method: 'DELETE', token });
  assert.equal(removed.status, 200);
  const gone = await json(`/api/fields/${fieldId}`, { token });
  assert.equal(gone.status, 404);
});
