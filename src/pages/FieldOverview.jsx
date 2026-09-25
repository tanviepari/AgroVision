import { Link, useNavigate } from 'react-router-dom';
import {
  ScanLine,
  Droplets,
  Wheat,
  AlertCircle,
  ChevronRight,
  Sprout,
  ArrowUpRight,
  Sun,
  Map,
} from 'lucide-react';
import Card from '../components/Common/Card';
import StatusBadge from '../components/Common/StatusBadge';
import ProgressBar from '../components/Common/ProgressBar';
import EmptyState from '../components/Common/EmptyState';
import { useApp } from '../context/AppContext';

const activityIcons = {
  scan: ScanLine,
  disease: ScanLine,
  problem: AlertCircle,
  irrigation: Droplets,
  yield: Wheat,
  stage: Sprout,
  recommendation: Droplets,
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function FieldOverview() {
  const navigate = useNavigate();
  const {
    farmer,
    fields,
    selectedField,
    selectedFieldId,
    setSelectedFieldId,
    irrigationRecommendations,
    yieldForecasts,
    fieldActivity,
    reportedIssues,
    weather,
  } = useApp();

  if (!fields.length || !selectedField) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon="sprout"
          title="No fields yet"
          description="Add your first field to start tracking crop health, water, and yield."
          actionLabel="Set up a field"
          onAction={() => navigate('/setup')}
        />
      </div>
    );
  }

  const irrigation = irrigationRecommendations[selectedFieldId];
  const yieldData = yieldForecasts[selectedFieldId];
  const activity = (fieldActivity[selectedFieldId] || []).slice(0, 5);
  const recentIssue = (reportedIssues[selectedFieldId] || [])[0];

  const statusLine = irrigation
    ? `${selectedField.name} needs ${irrigation.waterNeededLiters} L of water today.`
    : 'Your fields are looking healthy today.';

  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=700&fit=crop&q=80')]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/55 to-white/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-28 sm:pb-36">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-success/25 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold tracking-wider text-primary uppercase">
                Dashboard Overview
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-primary leading-tight">
                {greeting()}, {farmer.name.split(' ')[0]}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-text-dark/80 leading-relaxed max-w-md">
                {statusLine}
              </p>
            </div>

            <Card className="self-start p-4 sm:p-5 flex items-center gap-4 min-w-[240px] shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c8e86c]">
                <Sun size={24} className="text-primary" aria-hidden="true" />
              </div>
              <div>
                {weather.available ? (
                  <>
                    <p className="text-2xl font-bold text-text-dark">{weather.temperature}°C</p>
                    <p className="text-xs text-text-light mt-0.5">
                      {weather.condition} • Humidity {weather.humidity}%
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-text-dark">Weather</p>
                    <p className="text-xs text-text-light mt-0.5">{weather.message}</p>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick action cards — overlap hero */}
      <section className="relative -mt-16 sm:-mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/app/disease-scan" className="group block">
            <Card className="relative overflow-hidden p-5 sm:p-6 bg-[#f0f4f1] border-0 hover:shadow-md transition-shadow duration-200">
              <div
                className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/60"
                aria-hidden="true"
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <ScanLine size={22} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h2 className="font-serif font-bold text-text-dark text-lg">
                    Start Disease Scan
                  </h2>
                  <p className="mt-1 text-sm text-text-light">
                    Take a clear photo of the affected part of your crop
                  </p>
                </div>
                <span className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Card>
          </Link>

          <Link to="/app/irrigation" className="group block">
            <Card className="relative overflow-hidden p-5 sm:p-6 bg-[#f0f4f1] border-0 hover:shadow-md transition-shadow duration-200">
              <div
                className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/60"
                aria-hidden="true"
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3d6b3a] text-white">
                  <Droplets size={22} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h2 className="font-serif font-bold text-text-dark text-lg">
                    Check Irrigation Needs
                  </h2>
                  <p className="mt-1 text-sm text-text-light">
                    See how much water your field needs today
                  </p>
                </div>
                <span className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Card>
          </Link>
        </div>

        {/* Report a problem */}
        <Link to="/app/report-problem" className="group block mt-4">
          <Card className="!p-5 sm:!p-6 flex flex-col sm:flex-row sm:items-center gap-4 border border-warning/15 bg-warning-soft/30 hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning text-white">
              <AlertCircle size={22} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-lg font-bold text-text-dark">
                Report a problem
              </h2>
              <p className="mt-1 text-sm text-text-light leading-relaxed">
                Noticed yellow leaves, pests, or something else? Tell us so we can keep
                track of your field.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline shrink-0">
              Report now <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </Card>
        </Link>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: field status + list */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
                Your Fields
              </h2>
              <Link
                to="/app/field-details"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Map size={14} /> Field details
              </Link>
            </div>

            <ul className="space-y-3" role="list">
              {fields.map((field, index) => {
                const irr = irrigationRecommendations[field.id];
                const isSelected = field.id === selectedFieldId;
                const healthTone =
                  field.health === 'good'
                    ? { circle: 'bg-success/15 text-success', badge: 'good' }
                    : field.health === 'attention'
                      ? { circle: 'bg-warning/15 text-warning', badge: 'attention' }
                      : { circle: 'bg-alert/15 text-alert', badge: 'poor' };

                return (
                  <li key={field.id}>
                    <Card
                      className={`p-4 sm:p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer group ${
                        isSelected ? 'ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => {
                        setSelectedFieldId(field.id);
                        navigate('/app/field-details');
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${healthTone.circle}`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-text-dark text-sm sm:text-base">
                              {field.name}
                            </h3>
                            <StatusBadge
                              status={healthTone.badge}
                              label={field.healthLabel}
                            />
                          </div>
                          <p className="text-xs sm:text-sm text-text-light">
                            {field.crop} · {field.areaAcres} acres · {field.cropStage}
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-text-light">
                            {irr
                              ? `Water needed: ${irr.waterNeededLiters} L`
                              : 'No watering plan yet'}
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

            {/* Snapshot for selected field */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="!p-4">
                <p className="text-[11px] font-medium text-text-light uppercase tracking-wide">
                  Expected yield
                </p>
                <p className="mt-1 font-serif text-2xl font-bold text-primary">
                  {yieldData?.expectedTonnes ?? '—'}{' '}
                  <span className="text-sm font-sans font-semibold">t</span>
                </p>
              </Card>
              <Card className="!p-4">
                <p className="text-[11px] font-medium text-text-light uppercase tracking-wide">
                  Crop stage
                </p>
                <p className="mt-1 font-semibold text-text-dark">{selectedField.cropStage}</p>
                <ProgressBar
                  className="mt-2"
                  value={selectedField.cropStageProgress}
                  color="earth"
                  height="h-1.5"
                />
              </Card>
              <Card className="!p-4">
                <p className="text-[11px] font-medium text-text-light uppercase tracking-wide">
                  Water today
                </p>
                <p className="mt-1 font-serif text-2xl font-bold text-primary">
                  {irrigation?.waterNeededLiters ?? '—'}{' '}
                  <span className="text-sm font-sans font-semibold">L</span>
                </p>
              </Card>
            </div>

            {recentIssue && (
              <Card className="!p-4 flex items-center gap-3 bg-warning-soft/40 border-warning/10">
                <AlertCircle className="text-warning shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-dark">
                    {recentIssue.label} reported {recentIssue.dateLabel.toLowerCase()}
                  </p>
                  {recentIssue.description && (
                    <p className="text-xs text-text-light truncate">{recentIssue.description}</p>
                  )}
                </div>
                <Link
                  to="/app/history"
                  className="text-sm font-medium text-primary hover:underline shrink-0"
                >
                  View
                </Link>
              </Card>
            )}

            {/* Recent activity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-xl font-bold text-primary">Recent activity</h2>
                <Link
                  to="/app/history"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Full history <ChevronRight size={14} />
                </Link>
              </div>
              <Card padding={false}>
                {activity.length === 0 ? (
                  <EmptyState
                    title="No activity yet"
                    description="Scans, watering, and updates will show up here."
                  />
                ) : (
                  <ul className="divide-y divide-border">
                    {activity.map((item) => {
                      const Icon = activityIcons[item.type] || Sprout;
                      return (
                        <li key={item.id} className="flex items-start gap-3 px-5 py-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-dark">{item.title}</p>
                            <p className="text-xs text-text-light mt-0.5">{item.detail}</p>
                          </div>
                          <span className="text-xs text-text-light shrink-0">
                            {item.dateLabel}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            </div>
          </div>

          {/* Right: field snapshot / soil-style panel */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-5">
              Field snapshot
            </h2>
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-earth/15 text-earth">
                  <Sprout size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-text-light uppercase">
                    {selectedField.name}
                  </p>
                  <p className="text-sm font-semibold text-text-dark">
                    {selectedField.crop} · {selectedField.soilType} soil
                  </p>
                </div>
              </div>

              <div className="space-y-0 divide-y divide-gray-100">
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-text-light">Crop health</span>
                  <StatusBadge
                    status={selectedField.health}
                    label={selectedField.healthLabel}
                  />
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-text-light">Stage</span>
                  <span className="text-sm font-semibold text-text-dark">
                    {selectedField.cropStage} ({selectedField.cropStageProgress}%)
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-text-light">Area</span>
                  <span className="text-sm font-semibold text-text-dark">
                    {selectedField.areaAcres} acres
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-text-light">Soil</span>
                  <span className="text-sm font-semibold text-text-dark">
                    {selectedField.soilType}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-text-light">Expected yield</span>
                  <span className="text-sm font-semibold text-text-dark">
                    {yieldData ? `${yieldData.expectedTonnes} tonnes` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-text-light">Water today</span>
                  <span className="text-sm font-semibold text-text-dark">
                    {irrigation ? `${irrigation.waterNeededLiters} L` : '—'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-5 mt-2 border-t border-border">
                <Link
                  to="/app/report-problem"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Report a problem
                </Link>
                <span className="text-text-light">·</span>
                <Link
                  to="/app/yield"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View yield
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
