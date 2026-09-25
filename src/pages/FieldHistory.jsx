import {
  ScanLine,
  AlertCircle,
  Droplets,
  Wheat,
  Sprout,
  RefreshCw,
} from 'lucide-react';
import Card from '../components/common/Card';
import FieldSelector from '../components/layout/FieldSelector';
import EmptyState from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

const typeMeta = {
  scan: { icon: ScanLine, color: 'bg-primary-soft text-primary', label: 'Disease scan' },
  disease: { icon: ScanLine, color: 'bg-warning-soft text-warning', label: 'Disease detected' },
  problem: { icon: AlertCircle, color: 'bg-alert-soft text-alert', label: 'Problem reported' },
  irrigation: { icon: Droplets, color: 'bg-water-soft text-water', label: 'Irrigation' },
  recommendation: { icon: RefreshCw, color: 'bg-water-soft text-water', label: 'Water update' },
  yield: { icon: Wheat, color: 'bg-earth-soft text-earth', label: 'Yield forecast' },
  stage: { icon: Sprout, color: 'bg-success-soft text-success', label: 'Crop update' },
};

export default function FieldHistory() {
  const { selectedField, selectedFieldId, fieldActivity } = useApp();
  const activity = fieldActivity[selectedFieldId] || [];

  if (!selectedField) {
    return (
      <EmptyState
        icon="sprout"
        title="No field selected"
        description="Add a field to see its history."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase mb-1">
          Field History
        </p>
        <FieldSelector />
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-4">
          Everything that happened
        </h1>
        <p className="mt-1 text-sm text-text-light">
          Scans, watering, reported problems, and updates for this field.
        </p>
      </div>

      {activity.length === 0 ? (
        <Card>
          <EmptyState
            title="No history yet"
            description="As you scan crops, water the field, and report problems, they'll show up here."
          />
        </Card>
      ) : (
        <div className="relative">
          <div
            className="absolute left-[27px] top-4 bottom-4 w-px bg-border"
            aria-hidden="true"
          />
          <ul className="space-y-4">
            {activity.map((item) => {
              const meta = typeMeta[item.type] || typeMeta.stage;
              const Icon = meta.icon;
              return (
                <li key={item.id} className="relative flex gap-4">
                  <div
                    className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${meta.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <Card className="flex-1 !p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-light">
                          {meta.label}
                        </p>
                        <p className="font-semibold text-text-dark mt-0.5">{item.title}</p>
                        {item.detail && (
                          <p className="text-sm text-text-light mt-1">→ {item.detail}</p>
                        )}
                      </div>
                      <span className="text-xs font-medium text-text-light shrink-0">
                        {item.dateLabel}
                      </span>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
