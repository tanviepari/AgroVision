import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import StatusBadge from '../components/Common/StatusBadge';
import FieldSelector from '../components/Layout/FieldSelector';
import EmptyState from '../components/Common/EmptyState';
import { useApp } from '../context/AppContext';

export default function Irrigation() {
  const {
    selectedField,
    selectedFieldId,
    irrigationRecommendations,
    irrigationRecords,
    markIrrigationComplete,
    addIrrigationRecord,
    addIrrigationSchedule,
    showToast,
    apiErrorMessage,
  } = useApp();
  const [amount, setAmount] = useState('');
  const [when, setWhen] = useState('');
  const [planAmount, setPlanAmount] = useState('');
  const [planWhen, setPlanWhen] = useState('');
  const [saving, setSaving] = useState(false);

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
          </div>
          <p className="text-sm text-text-dark leading-relaxed">
            {rec.moistureMessage || 'No soil sensor is connected. This water amount is an estimate.'}
          </p>
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

      {rec.upcoming?.[0] && (
        <Button
          size="lg"
          fullWidth
          variant="water"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              await markIrrigationComplete(selectedFieldId, rec.upcoming[0].id, rec.upcoming[0].amountLiters);
            } catch (err) {
              showToast(apiErrorMessage(err), 'error');
            } finally {
              setSaving(false);
            }
          }}
        >
          <CheckCircle2 size={18} />
          Mark next watering as completed
        </Button>
      )}

      <Card>
        <h2 className="font-serif text-lg font-bold text-primary mb-3">Record water used</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            Litres
            <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
          </label>
          <label className="block text-sm">
            Date and time
            <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
          </label>
        </div>
        <Button
          className="mt-4"
          disabled={saving || !amount || !when}
          onClick={async () => {
            setSaving(true);
            try {
              await addIrrigationRecord(selectedFieldId, {
                amountLiters: Number(amount),
                recordedAt: new Date(when).toISOString(),
              });
              setAmount('');
              setWhen('');
            } catch (err) {
              showToast(apiErrorMessage(err), 'error');
            } finally {
              setSaving(false);
            }
          }}
        >
          Save irrigation
        </Button>
      </Card>

      <Card>
        <h2 className="font-serif text-lg font-bold text-primary mb-3">Plan a watering</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            Litres
            <input type="number" min="1" value={planAmount} onChange={(e) => setPlanAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
          </label>
          <label className="block text-sm">
            Date and time
            <input type="datetime-local" value={planWhen} onChange={(e) => setPlanWhen(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
          </label>
        </div>
        <Button
          className="mt-4"
          variant="secondary"
          disabled={saving || !planAmount || !planWhen}
          onClick={async () => {
            setSaving(true);
            try {
              await addIrrigationSchedule(selectedFieldId, {
                amountLiters: Number(planAmount),
                scheduledAt: new Date(planWhen).toISOString(),
              });
              setPlanAmount('');
              setPlanWhen('');
            } catch (err) {
              showToast(apiErrorMessage(err), 'error');
            } finally {
              setSaving(false);
            }
          }}
        >
          Save plan
        </Button>
      </Card>
    </div>
  );
}
