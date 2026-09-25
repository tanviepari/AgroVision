import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ScanLine,
  Droplets,
  Wheat,
  History,
  AlertCircle,
  MapPin,
  Calendar,
} from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import StatusBadge from '../components/Common/StatusBadge';
import ProgressBar from '../components/Common/ProgressBar';
import FieldSelector from '../components/Layout/FieldSelector';
import EmptyState from '../components/Common/EmptyState';
import { useApp } from '../context/AppContext';
import { CROP_OPTIONS, CROP_STAGES, SOIL_OPTIONS } from '../data/mockData';
import { apiErrorMessage } from '../services/api';

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

export default function FieldDetails() {
  const {
    selectedField,
    selectedFieldId,
    irrigationRecommendations,
    yieldForecasts,
    updateField,
    deleteField,
  } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  if (!selectedField) {
    return (
      <EmptyState
        icon="sprout"
        title="No field selected"
        description="Add a field first to see its details."
      />
    );
  }

  const irrigation = irrigationRecommendations[selectedFieldId];
  const yieldData = yieldForecasts[selectedFieldId];

  const details = [
    { label: 'Field name', value: selectedField.name },
    { label: 'Crop', value: selectedField.crop },
    { label: 'Variety', value: selectedField.cropVariety || '—' },
    { label: 'Area', value: `${selectedField.areaAcres} acres` },
    { label: 'Soil type', value: selectedField.soilType },
    {
      label: 'Sowing date',
      value: new Date(selectedField.sowingDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
    { label: 'Location', value: selectedField.location },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase mb-1">
          Field Details
        </p>
        <FieldSelector />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Visual */}
        <Card className="lg:col-span-2 leaf-pattern overflow-hidden !p-0" padding={false}>
          <div className="h-48 bg-gradient-to-br from-primary/20 to-earth/10 flex items-center justify-center">
              <div className="text-center px-6">
              <p className="font-serif text-4xl font-bold text-primary mb-2">
                {selectedField.crop}
              </p>
              <p className="text-sm text-text-light">{selectedField.cropStage}</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-light">Crop health</span>
              <StatusBadge
                status={selectedField.health}
                label={selectedField.healthLabel}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-text-light">Stage progress</span>
                <span className="font-semibold">{selectedField.cropStageProgress}%</span>
              </div>
              <ProgressBar value={selectedField.cropStageProgress} color="earth" />
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
              <span className="text-text-light">Irrigation</span>
              <span className="font-semibold text-warning">
                {irrigation ? `${irrigation.waterNeededLiters} L today` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-light">Expected yield</span>
              <span className="font-semibold text-primary">
                {yieldData ? `${yieldData.expectedTonnes} tonnes` : '—'}
              </span>
            </div>
          </div>
        </Card>

        {/* Info list */}
        <Card className="lg:col-span-3">
          <h2 className="font-serif text-xl font-bold text-primary mb-4">Field information</h2>
          <dl className="space-y-0 divide-y divide-border">
            {details.map((row) => (
              <div key={row.label} className="flex justify-between py-3 gap-4">
                <dt className="text-sm text-text-light">{row.label}</dt>
                <dd className="text-sm font-semibold text-text-dark text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-center gap-4 text-xs text-text-light">
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {selectedField.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} /> Sown {selectedField.sowingDate}
            </span>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-serif text-xl font-bold text-primary">Edit this field</h2>
          {!editing && (
            <Button variant="secondary" onClick={() => {
              setForm({
                name: selectedField.name,
                crop: selectedField.crop,
                cropVariety: selectedField.cropVariety,
                areaAcres: selectedField.areaAcres,
                soilType: selectedField.soilType,
                sowingDate: selectedField.sowingDate,
                location: selectedField.location,
                cropStage: selectedField.cropStage,
                notes: selectedField.notes || '',
              });
              setEditing(true);
            }}>
              Edit
            </Button>
          )}
        </div>
        {editing && form && (
          <div className="space-y-3">
            {[
              ['name', 'Field name'],
              ['cropVariety', 'Variety'],
              ['areaAcres', 'Area (acres)'],
              ['location', 'Location'],
              ['notes', 'Additional information'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs font-medium text-text-light">{label}</span>
                <input
                  className={`${inputClass} mt-1`}
                  value={form[key]}
                  onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
                />
              </label>
            ))}
            <label className="block">
              <span className="text-xs font-medium text-text-light">Crop</span>
              <select className={`${inputClass} mt-1`} value={form.crop} onChange={(e) => setForm((current) => ({ ...current, crop: e.target.value }))}>
                {CROP_OPTIONS.map((crop) => <option key={crop.id} value={crop.label}>{crop.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-text-light">Soil type</span>
              <select className={`${inputClass} mt-1`} value={form.soilType} onChange={(e) => setForm((current) => ({ ...current, soilType: e.target.value }))}>
                {SOIL_OPTIONS.map((soil) => <option key={soil} value={soil}>{soil}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-text-light">Crop stage</span>
              <select className={`${inputClass} mt-1`} value={form.cropStage} onChange={(e) => setForm((current) => ({ ...current, cropStage: e.target.value }))}>
                {CROP_STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-text-light">Sowing date</span>
              <input type="date" className={`${inputClass} mt-1`} value={form.sowingDate} onChange={(e) => setForm((current) => ({ ...current, sowingDate: e.target.value }))} />
            </label>
            {error && <p className="text-sm text-alert" role="alert">{error}</p>}
            <div className="flex gap-3">
              <Button
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  setError('');
                  try {
                    await updateField(selectedFieldId, form);
                    setEditing(false);
                  } catch (err) {
                    setError(apiErrorMessage(err));
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? 'Saving...' : 'Save field'}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}
        <div className="mt-6 pt-4 border-t border-border">
          {!confirmDelete ? (
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete field</Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-dark">Remove this field and its saved records?</p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={async () => {
                    await deleteField(selectedFieldId);
                    navigate('/app');
                  }}
                >
                  Yes, delete
                </Button>
                <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <section>
        <Link to="/app/report-problem" className="group block">
          <Card className="!p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-warning/15 bg-warning-soft/25 hover:shadow-md transition-shadow">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning text-white">
              <AlertCircle size={20} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-lg font-bold text-text-dark">
                Report a problem
              </h2>
              <p className="mt-1 text-sm text-text-light">
                Something looking off in this field? Save it so it shows up in your field
                history.
              </p>
            </div>
            <span className="text-sm font-semibold text-primary group-hover:underline shrink-0">
              Report now →
            </span>
          </Card>
        </Link>
      </section>

      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-4">Go to</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/app/disease-scan', label: 'Disease Scan', icon: ScanLine },
            { to: '/app/irrigation', label: 'Irrigation', icon: Droplets },
            { to: '/app/yield', label: 'Yield Forecast', icon: Wheat },
            { to: '/app/history', label: 'Field History', icon: History },
          ].map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}>
              <Card className="!p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold text-text-dark">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
