# AgroVision

A friendly digital farm assistant for Indian farmers. The React screens were already designed. This repository now includes an Express and MongoDB API for accounts, fields, irrigation records, yield estimates, notifications, and problem reports.

## Stack

- Frontend: React 19, Vite, Tailwind CSS v4, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: bcrypt password hashes and JWT

## Local setup

1. Create a MongoDB database (local MongoDB or MongoDB Atlas).
2. Backend:

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Set `MONGODB_URI` and `JWT_SECRET` in `backend/.env`. Do not commit `.env`.

3. Frontend, from the repository root:

```bash
copy .env.example .env
npm install
npm run dev
```

`VITE_API_URL` should point at the API, for example `http://localhost:5000/api`.

Open the Vite URL (usually `http://localhost:5173`). Create an account, then add a field. The dashboard stays empty until a field is saved.

## What is an estimate

- Irrigation amounts are planning figures from crop, stage, and acres. They are not soil-sensor readings.
- Yield numbers use a written rule of thumb in `backend/src/services/yieldEstimate.js`. They are not a scientific forecast.
- Weather is shown only when `OPENWEATHER_API_KEY` is set. Otherwise the dashboard says weather is unavailable.
- Disease scan calls `DISEASE_API_URL`. If that service is not set, or it fails, the farmer sees an error and can try again. The app does not invent a diagnosis or suggest pesticide doses.

## Optional services

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Password reset email |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Host uploaded photos in production |
| `DISEASE_API_URL`, `DISEASE_API_KEY` | Crop analysis service. POST JSON `{ imageUrl, crop }` and return `possibleIssue` and `explanation` |
| `OPENWEATHER_API_KEY` | Live weather |

Without Cloudinary, development stores photos in `backend/uploads` (not committed).

## Tests

```bash
cd backend
npm test
```

## Deployment

- Frontend: the existing Vercel project. Set `VITE_API_URL` to the public API URL, including `/api`. `vercel.json` sends unknown paths to `index.html` so refresh works on app routes.
- Backend: a Node host such as Render. Start command `npm start` from `backend`. Set the same variables as `backend/.env.example`.
- Database: MongoDB Atlas. Put the connection string in `MONGODB_URI`.
- Set `CLIENT_ORIGIN` to the Vercel URL. Several origins can be comma-separated.
- Set `PUBLIC_BASE_URL` to the public API origin so saved photo links work.
- Do not commit secrets.
