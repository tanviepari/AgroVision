import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import Card from '../components/Common/Card';
import ProgressBar from '../components/Common/ProgressBar';
import FieldSelector from '../components/Layout/FieldSelector';
import EmptyState from '../components/Common/EmptyState';
import { useApp } from '../context/AppContext';

export default function YieldForecast() {
  const { selectedField, selectedFieldId, yieldForecasts } = useApp();
  const data = yieldForecasts[selectedFieldId];

  if (!selectedField) {
    return (
      <EmptyState
        icon="sprout"
        title="No field selected"
        description="Add a field to see yield estimates."
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="No forecast yet"
        description="Yield estimates appear after your field has enough information."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase mb-1">
          Yield Forecast
        </p>
        <FieldSelector />
      </div>

      <Card className="bg-gradient-to-br from-earth-soft/50 to-white text-center sm:text-left">
        <p className="text-sm font-medium text-earth">Expected yield</p>
        <p className="font-serif text-4xl sm:text-5xl font-bold text-primary mt-2">
          {data.expectedTonnes}{' '}
          <span className="text-2xl font-sans font-semibold">tonnes</span>
        </p>
        <p className="mt-3 text-sm text-text-light">
          This is an estimate — it updates as new field information is recorded.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-text-light">
            Expected harvest
          </p>
          <p className="font-serif text-2xl font-bold text-primary mt-2">
            {data.harvestInDaysMin}–{data.harvestInDaysMax} days
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-text-light mb-3">
            Crop progress
          </p>
          <ProgressBar value={data.cropProgress} color="earth" label={selectedField.cropStage} />
        </Card>
      </div>

      <Card>
        <h2 className="font-serif text-lg font-bold text-primary mb-1">Forecast over time</h2>
        <p className="text-xs text-text-light mb-4">
          {data.history.map((h) => `${h.tonnes} t`).join(' → ')}
        </p>
        <div className="h-44" role="img" aria-label="Yield forecast history chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.history} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                domain={['dataMin - 0.2', 'dataMax + 0.2']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                }}
                formatter={(v) => [`${v} tonnes`, 'Estimate']}
              />
              <Line
                type="monotone"
                dataKey="tonnes"
                stroke="#1a5f4a"
                strokeWidth={2.5}
                dot={{ fill: '#1a5f4a', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="font-serif text-lg font-bold text-primary mb-4">
          What&apos;s affecting your forecast?
        </h2>
        <ul className="space-y-0 divide-y divide-border">
          {data.factors.map((f) => (
            <li key={f.id} className="flex justify-between py-3 text-sm">
              <span className="text-text-light">{f.label}</span>
              <span className="font-semibold text-text-dark">{f.value}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
