import {
  Download,
  Sprout,
  TrendingUp,
  SlidersHorizontal,
  Droplets,
  Thermometer,
  FlaskConical,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import Card from './Common/Card';
import Badge from './Common/Badge';
import Button from './Common/Button';
import {
  yieldForecast,
  influenceFactors,
  smartRecommendations,
} from '../data/mockData';

const impactIcons = {
  droplet: Droplets,
  thermometer: Thermometer,
  alert: FlaskConical,
};

const impactIconStyles = {
  'High Impact': 'bg-success/15 text-success',
  'Medium Impact': 'bg-earth/15 text-earth',
  'Action Needed': 'bg-alert/15 text-alert',
};

/**
 * Yield Forecast — expected harvest, historical chart, factors & recommendations.
 */
export default function YieldForecast() {
  const maxYield = Math.max(...yieldForecast.historicalData.map((d) => d.yield));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8 sm:mb-10">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
            {yieldForecast.season}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-primary">
            Yield Forecast
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-light leading-relaxed">
            AI-driven harvest prediction based on current weather patterns, soil health
            data, and historical performance.
          </p>
        </div>
        <Button className="shrink-0 self-start" ariaLabel="Export yield report">
          <Download size={16} aria-hidden="true" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* Expected Harvest */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-[#e8f5e9]/60 to-white">
            <div className="flex items-center gap-2 mb-4">
              <Sprout size={18} className="text-success" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-text-dark">Expected Harvest</h2>
            </div>

            <p className="font-serif text-4xl sm:text-5xl font-bold text-primary">
              {yieldForecast.expectedHarvest}{' '}
              <span className="text-2xl sm:text-3xl">Tons / Acre</span>
            </p>

            <div className="mt-5 inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm border border-black/[0.03]">
              <div className="flex items-center gap-1.5 text-success font-semibold text-sm">
                <TrendingUp size={16} aria-hidden="true" />
                +{yieldForecast.trendPercent}% vs Last Year
              </div>
              <span className="text-xs text-text-light">Trending positively</span>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold tracking-wider text-text-light uppercase">
                  Prediction Confidence
                </span>
                <span className="text-sm font-bold text-primary">
                  {yieldForecast.confidencePercent}%
                </span>
              </div>
              <div
                className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={yieldForecast.confidencePercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Prediction confidence"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${yieldForecast.confidencePercent}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Historical Comparison */}
          <Card className="p-5 sm:p-6">
            <h2 className="font-serif text-lg font-bold text-text-dark mb-4">
              Historical Comparison
            </h2>
            <div
              className="h-52"
              role="img"
              aria-label="Historical yield comparison bar chart 2021 to 2024"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yieldForecast.historicalData}
                  margin={{ top: 24, right: 8, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis hide domain={[0, maxYield + 0.5]} />
                  <Bar dataKey="yield" radius={[8, 8, 0, 0]} barSize={48}>
                    {yieldForecast.historicalData.map((entry, index) => (
                      <Cell
                        key={`yield-${entry.year}`}
                        fill={
                          index === yieldForecast.historicalData.length - 1
                            ? '#5a7a3a'
                            : '#d1d5db'
                        }
                      />
                    ))}
                    <LabelList
                      dataKey="yield"
                      position="top"
                      formatter={(v) => `${v}t`}
                      style={{ fill: '#1a5f4a', fontSize: 12, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Influence Factors */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-text-dark">
                Influence Factors
              </h2>
              <SlidersHorizontal
                size={18}
                className="text-text-light"
                aria-hidden="true"
              />
            </div>

            <ul className="space-y-3" role="list">
              {influenceFactors.map((factor) => {
                const Icon = impactIcons[factor.icon] || Droplets;
                const isAction = factor.impact === 'Action Needed';
                return (
                  <li
                    key={factor.id}
                    className={`flex gap-3 rounded-xl p-3.5 ${
                      isAction ? 'bg-alert/[0.06]' : 'bg-transparent'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        impactIconStyles[factor.impact]
                      }`}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-text-dark">
                          {factor.title}
                        </h3>
                        <Badge status={factor.impact} showIcon={false} />
                      </div>
                      <p className="text-xs sm:text-sm text-text-light leading-relaxed">
                        {factor.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Smart Recommendations */}
          <div className="rounded-2xl bg-primary p-5 sm:p-6 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb size={20} aria-hidden="true" />
              <h2 className="font-serif text-lg font-bold">Smart Recommendations</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {smartRecommendations.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  className="text-left rounded-xl bg-white/10 hover:bg-white/15 p-4 transition-colors duration-200 group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{rec.title}</h3>
                    <ArrowRight
                      size={16}
                      className="shrink-0 mt-0.5 opacity-70 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed">
                    {rec.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
