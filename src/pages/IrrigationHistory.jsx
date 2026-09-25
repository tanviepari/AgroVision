import { Droplets } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import FieldSelector from '../components/layout/FieldSelector';
import EmptyState from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

export default function IrrigationHistory() {
  const { selectedField, selectedFieldId, irrigationRecords } = useApp();
  const records = irrigationRecords[selectedFieldId] || [];

  if (!selectedField) {
    return (
      <EmptyState
        icon="droplets"
        title="No field selected"
        description="Add a field to see irrigation history."
      />
    );
  }

  const chartData = [...records]
    .reverse()
    .map((r) => ({ label: r.dateLabel, value: r.amountLiters }));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase mb-1">
          Irrigation History
        </p>
        <FieldSelector />
        <h1 className="font-serif text-2xl font-bold text-primary mt-4">Past watering</h1>
      </div>

      {records.length === 0 ? (
        <Card>
          <EmptyState
            icon="droplets"
            title="No irrigation history"
            description="When you mark watering as completed, it will appear here."
          />
        </Card>
      ) : (
        <>
          {chartData.length > 1 && (
            <Card>
              <p className="text-sm font-medium text-text-light mb-3">Water used (litres)</p>
              <div className="h-36" role="img" aria-label="Irrigation amount trend">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barCategoryGap="30%">
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>
                      {chartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={`rgba(14, 165, 233, ${0.4 + (i / chartData.length) * 0.5})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          <ul className="space-y-3">
            {records.map((r) => (
              <li key={r.id}>
                <Card className="!p-4 flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-water-soft text-water">
                    <Droplets size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-dark">{r.dateLabel}</p>
                    <p className="text-xs text-text-light">
                      {r.amountLiters} L
                      {r.durationMinutes ? ` · ${r.durationMinutes} min` : ''}
                      {' · '}
                      {selectedField.name}
                    </p>
                  </div>
                  <StatusBadge status={r.status} label="Completed" />
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
