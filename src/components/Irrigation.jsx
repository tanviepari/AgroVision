import { useState } from 'react';
import {
  RefreshCw,
  Droplets,
  Calendar,
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import Card from './Common/Card';
import Badge from './Common/Badge';
import Button from './Common/Button';
import {
  irrigationSectors,
  irrigationSchedule,
  conservationData,
} from '../data/mockData';

/**
 * Irrigation Control — moisture cards, manual overrides, conservation & schedule.
 */
export default function Irrigation() {
  const [refreshing, setRefreshing] = useState(false);
  const [watered, setWatered] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page header */}
      <div className="mb-8 sm:mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
          Irrigation Control
        </h1>
        <p className="mt-3 text-sm sm:text-base text-text-light leading-relaxed">
          Manage moisture levels and scheduling across all field sectors to optimize
          water usage and crop health.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column — moisture + overrides */}
        <div className="lg:col-span-2 space-y-8">
          {/* Moisture Overview */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-text-dark">
                Moisture Overview
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                ariaLabel="Refresh sensors"
                className="!rounded-lg"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? 'animate-spin' : ''}
                  aria-hidden="true"
                />
                Refresh Sensors
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {irrigationSectors.map((sector) => {
                const isDry = sector.status === 'DRY';
                return (
                  <Card
                    key={sector.id}
                    className={`p-5 transition-shadow hover:shadow-md ${
                      isDry ? 'bg-alert/[0.04] border-alert/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold tracking-wider text-text-light uppercase">
                        {sector.sectorName}
                      </span>
                      <Badge status={sector.status} />
                    </div>

                    <p
                      className={`text-3xl font-bold ${
                        isDry ? 'text-alert' : 'text-text-dark'
                      }`}
                    >
                      {sector.moisturePercent}%
                    </p>

                    <div
                      className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden"
                      role="progressbar"
                      aria-valuenow={sector.moisturePercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${sector.sectorName} moisture ${sector.moisturePercent}%`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDry ? 'bg-alert' : 'bg-primary'
                        }`}
                        style={{ width: `${sector.moisturePercent}%` }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-text-light">{sector.crop}</span>
                      <button
                        type="button"
                        className="text-sm font-medium text-text-dark hover:text-primary transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Manual Overrides */}
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-text-dark mb-4">
              Manual Overrides
            </h2>
            <Card className="p-5 sm:p-6 bg-gray-50/80">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Droplets size={22} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-dark">
                    Sector Beta requires attention
                  </h3>
                  <p className="mt-0.5 text-sm text-text-light">
                    Moisture levels are critically low. Recommended action: Light soak.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setWatered(true)}
                  disabled={watered}
                  className="shrink-0"
                >
                  {watered ? 'Watering…' : 'Water Now'}
                </Button>
              </div>
            </Card>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          {/* Conservation Data */}
          <Card className="p-5 sm:p-6">
            <h2 className="text-base font-semibold text-text-dark mb-3">
              Conservation Data
            </h2>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-primary leading-tight">
              {conservationData.gallonsSaved}{' '}
              <span className="text-lg sm:text-xl">Gallons Saved</span>
            </p>
            <p className="mt-2 text-sm text-text-light">
              {conservationData.description}
            </p>

            <div
              className="mt-6 h-24"
              role="img"
              aria-label="Water conservation trend chart"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conservationData.trend} barCategoryGap="25%">
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {conservationData.trend.map((_, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={`rgba(26, 95, 74, ${0.3 + index * 0.2})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Upcoming Schedule */}
          <Card className="p-5 sm:p-6 bg-gray-50/50">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-primary" aria-hidden="true" />
              <h2 className="text-base font-semibold text-text-dark">
                Upcoming Schedule
              </h2>
            </div>
            <ul className="space-y-3" role="list">
              {irrigationSchedule.map((item, index) => (
                <li
                  key={`${item.day}-${item.time}-${index}`}
                  className="rounded-xl bg-white border border-black/[0.04] p-3.5"
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 text-right min-w-[60px]">
                      <p className="text-[10px] font-bold tracking-wider text-text-light uppercase">
                        {item.day}
                      </p>
                      <p className="text-sm font-bold text-text-dark">{item.time}</p>
                    </div>
                    <div className="border-l border-gray-100 pl-3 min-w-0">
                      <p className="text-sm font-semibold text-text-dark">
                        {item.sector}
                      </p>
                      <p className="text-xs text-text-light mt-0.5">{item.type}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
