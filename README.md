# AgroVision

Precision agriculture frontend for early disease detection, irrigation management, and yield forecasting.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v6
- Lucide React (icons)
- Recharts (charts)
- React Hook Form (upload validation)

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |

## Pages

- **Field Overview** (`/`) — Dashboard with weather, sectors, soil conditions
- **Disease Scan** (`/disease-scan`) — Image upload + sample diagnostics
- **Irrigation** (`/irrigation`) — Moisture cards, overrides, schedule
- **Yield Forecast** (`/yield-forecast`) — Harvest prediction & recommendations

All data is hardcoded in `src/data/mockData.js` — no backend required.
