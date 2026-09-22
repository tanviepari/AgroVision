import { Link } from 'react-router-dom';
import {
  Sun,
  Scan,
  Droplets,
  ChevronRight,
  ArrowUpRight,
  Check,
  Sprout,
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import Card from './Common/Card';
import Badge from './Common/Badge';
import {
  userProfile,
  weatherData,
  fieldSectors,
  soilConditions,
} from '../data/mockData';

const sectorAccent = {
  HEALTHY: {
    circle: 'bg-success/15 text-success',
    moisture: 'text-text-light',
  },
  NEEDS_WATER: {
    circle: 'bg-warning/15 text-warning',
    moisture: 'text-text-light',
  },
  ALERT: {
    circle: 'bg-alert/15 text-alert',
    moisture: 'text-alert',
  },
};

/**
 * Field Overview dashboard — hero, quick actions, sectors, and soil conditions.
 */
export default function Dashboard() {
  return (
    <div className="pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=700&fit=crop&q=80')]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/25 to-black/10"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-28 sm:pt-20 sm:pb-36">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-success/20 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-wider text-primary uppercase">
                Dashboard Overview
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-sm">
                Good Morning, {userProfile.name}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed max-w-md">
                Your fields are looking healthy today. Sector 4 requires slight moisture
                adjustments before noon.
              </p>
            </div>

            {/* Weather widget */}
            <Card className="self-start p-4 sm:p-5 flex items-center gap-4 min-w-[240px] shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c8e86c]">
                <Sun size={24} className="text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-dark">
                  {weatherData.temperature}°C
                </p>
                <p className="text-xs text-text-light mt-0.5">
                  {weatherData.condition} • Humidity {weatherData.humidity}%
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick actions — overlap hero fade */}
      <section className="relative -mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/disease-scan" className="group block">
            <Card className="relative overflow-hidden p-5 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div
                className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gray-50"
                aria-hidden="true"
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Scan size={22} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h2 className="font-semibold text-text-dark text-base">
                    Start Disease Scan
                  </h2>
                  <p className="mt-1 text-sm text-text-light">
                    Run drone analysis on vulnerable sectors
                  </p>
                </div>
                <span className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Card>
          </Link>

          <Link to="/irrigation" className="group block">
            <Card className="relative overflow-hidden p-5 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div
                className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gray-50"
                aria-hidden="true"
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3d6b3a] text-white">
                  <Droplets size={22} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h2 className="font-semibold text-text-dark text-base">
                    Check Irrigation Needs
                  </h2>
                  <p className="mt-1 text-sm text-text-light">
                    Review soil moisture levels across all zones
                  </p>
                </div>
                <span className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Main content: sectors + soil */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Field Sectors */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-5">
              Field Sectors Overview
            </h2>
            <ul className="space-y-3" role="list">
              {fieldSectors.map((sector) => {
                const accent = sectorAccent[sector.status];
                return (
                  <li key={sector.id}>
                    <Card className="p-4 sm:p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${accent.circle}`}
                        >
                          {sector.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-text-dark text-sm sm:text-base">
                              {sector.name}
                            </h3>
                            <Badge status={sector.status} />
                          </div>
                          <p className="text-xs sm:text-sm text-text-light">
                            {sector.hectares.toFixed(1)} Hectares •{' '}
                            {sector.isPreHarvest
                              ? 'Pre-harvest'
                              : `Planted ${sector.plantedDaysAgo} days ago`}
                          </p>
                          <p className={`mt-1 text-xs sm:text-sm ${accent.moisture}`}>
                            {sector.moistureLabel}
                          </p>
                        </div>
                        <ChevronRight
                          size={20}
                          className="shrink-0 text-gray-300 group-hover:text-primary transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Soil Conditions */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-5">
              Soil Conditions
            </h2>
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-earth/15 text-earth">
                  <Sprout size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-text-light uppercase">
                    Average Soil Temp
                  </p>
                  <p className="text-xl font-bold text-text-dark">
                    {soilConditions.avgTemp}°C
                  </p>
                </div>
              </div>

              <div className="h-28 mb-6" role="img" aria-label="Soil temperature trend chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={soilConditions.tempTrend} barCategoryGap="20%">
                    <Bar dataKey="temp" radius={[4, 4, 0, 0]}>
                      {soilConditions.tempTrend.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`rgba(161, 98, 7, ${0.35 + index * 0.1})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-0 divide-y divide-gray-100">
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-text-light">Nitrogen Level</span>
                  <span className="text-sm font-semibold text-text-dark flex items-center gap-1">
                    <Check size={14} className="text-success" aria-hidden="true" />
                    {soilConditions.nitrogenLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-text-light">Ph Level</span>
                  <span className="text-sm font-semibold text-text-dark">
                    {soilConditions.phLevel}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
