# AgroVision

A friendly digital farm assistant — monitor fields, scan crops, manage irrigation, and estimate yield.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router
- Lucide React
- Recharts
- Mock data only (no backend)

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## User flow

1. **Login / Register** → `/login`
2. **Field Setup** (after register) → `/setup`
3. **Field Overview** → `/app`
4. Disease Scan → Result → History
5. Report Problem → History
6. Irrigation → Irrigation History
7. Yield Forecast
8. Notifications · Profile

Demo tip: on the login page use any credentials, or click **Skip to app** to jump in with the sample tomato field.

## Project structure

```
src/
├── context/AppContext.jsx   # Session state + mock mutations
├── data/mockData.js         # Field-centered mock entities
├── components/
│   ├── common/              # Button, Card, EmptyState, …
│   └── layout/              # Sidebar, AppShell, FieldSelector
├── pages/                   # All screens
└── components/App.jsx       # Routing
```
