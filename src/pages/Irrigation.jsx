import { Link } from 'react-router-dom';
import { Droplets, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import StatusBadge from '../components/common/StatusBadge';
import FieldSelector from '../components/layout/FieldSelector';
import EmptyState from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

export default function Irrigation() {
  const {
    selectedField,
    selectedFieldId,
    irrigationRecommendations,
    irrigationRecords,
    markIrrigationComplete,
  } = useApp();

  if (!selectedField) {
    return (
      <EmptyState
        icon="droplets"
        title="No field selected"
        description="Add a field to see watering recommendations."
      />
    );
  }

  const rec = irrigationRecommendations[selectedFieldId];
  const recent = (irrigationRecords[selectedFieldId] || []).slice(0, 2);

  if (!rec) {
    return (
      <EmptyState
        icon="droplets"
        title="No watering plan yet"
        description="Recommendations will appear once your field has enough information."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase mb-1">
          Irrigation
        </p>
        <FieldSelector />
      </div>

      <Card className="bg-gradient-to-br from-water-soft/60 to-white">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-water text-white">
            <Droplets size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-water">Water needed today</p>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-primary mt-1">
              {rec.waterNeededLiters}{' '}
              <span className="text-2xl font-sans font-semibold">L</span>
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 text-text-light mb-2">
            <Clock size={16} />
            <span className="text-xs font-medium uppercase tracking-wide">Next watering</span>
          </div>
          <p className="font-serif text-xl font-bold text-primary">
            {rec.nextWatering.label} — {rec.nextWatering.time}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-text-light">
              Field moisture
            </span>
            <StatusBadge
              status={rec.moistureStatus}
              label={
                rec.moistureStatus === 'low'
                  ? 'Low'
                  : rec.moistureStatus === 'high'
                    ? 'High'
                    : 'Okay'
              }
            />
          </div>
          <ProgressBar
            value={rec.moisturePercent}
            color={rec.moistureStatus === 'low' ? 'alert' : 'water'}
          />
          <p className="mt-2 text-sm font-semibold text-text-dark">{rec.moisturePercent}%</p>
        </Card>
      </div>

      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-text-light mb-1">Crop</p>
        <p className="font-semibold text-text-dark">{selectedField.crop}</p>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium uppercase tracking-wide text-text-light mb-1">Why?</p>
          <p className="text-sm text-text-dark leading-relaxed">{rec.why}</p>
        </div>
      </Card>

      {rec.upcoming?.length > 0 && (
        <section>
          <h2 className="font-serif text-lg font-bold text-primary mb-3">Upcoming irrigation</h2>
          <div className="space-y-2">
            {rec.upcoming.map((u) => (
              <Card key={u.id} className="!p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-dark">
                    {u.date} · {u.time}
                  </p>
                  <p className="text-xs text-text-light">{u.amountLiters} L</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg font-bold text-primary">Recent irrigation</h2>
            <Link
              to="/app/irrigation-history"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              Full history <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {recent.map((r) => (
              <Card key={r.id} className="!p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-dark">{r.dateLabel}</p>
                  <p className="text-xs text-text-light">{r.amountLiters} L</p>
                </div>
                <StatusBadge status="completed" label="Done" />
              </Card>
            ))}
          </div>
        </section>
      )}

      <Button
        size="lg"
        fullWidth
        variant="water"
        onClick={() => markIrrigationComplete(selectedFieldId)}
      >
        <CheckCircle2 size={18} />
        Mark as completed
      </Button>
    </div>
  );
}
