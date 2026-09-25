import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Check } from 'lucide-react';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { CROP_OPTIONS, SOIL_OPTIONS, CROP_STAGES } from '../data/mockData';

const STEPS = ['Farm', 'Crop', 'Field', 'Done'];

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

export default function FieldSetup() {
  const { completeFieldSetup, farmer } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    farmerName: farmer.name || '',
    farmName: farmer.farmName || '',
    fieldName: '',
    location: farmer.location || '',
    areaAcres: '',
    crop: 'Tomato',
    cropVariety: '',
    soilType: 'Loamy',
    sowingDate: '',
    cropStage: 'Vegetative',
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 0) return form.farmerName && form.farmName && form.location;
    if (step === 1) return form.crop && form.cropStage;
    if (step === 2) return form.fieldName && form.areaAcres && form.soilType && form.sowingDate;
    return true;
  };

  const finish = () => {
    completeFieldSetup(form);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-bg leaf-pattern flex flex-col">
      <header className="px-6 py-5 flex items-center gap-2 text-primary">
        <Leaf size={22} />
        <span className="font-serif font-bold text-lg">AgroVision</span>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <ol className="flex items-center justify-between mb-10 gap-1">
            {STEPS.map((label, i) => (
              <li key={label} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i < step
                      ? 'bg-primary text-white'
                      : i === step
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : 'bg-white text-text-light border border-border'
                  }`}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    i <= step ? 'text-primary' : 'text-text-light'
                  }`}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>

          <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[var(--shadow-card)] p-6 sm:p-8">
            {step === 0 && (
              <>
                <h1 className="font-serif text-2xl font-bold text-primary">About your farm</h1>
                <p className="mt-1 text-sm text-text-light">Tell us a little about yourself.</p>
                <div className="mt-6 space-y-4">
                  <Field label="Your name">
                    <input
                      className={inputClass}
                      value={form.farmerName}
                      onChange={(e) => update('farmerName', e.target.value)}
                      placeholder="Ravi Kumar"
                    />
                  </Field>
                  <Field label="Farm name">
                    <input
                      className={inputClass}
                      value={form.farmName}
                      onChange={(e) => update('farmName', e.target.value)}
                      placeholder="Green Valley Farm"
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      className={inputClass}
                      value={form.location}
                      onChange={(e) => update('location', e.target.value)}
                      placeholder="Village, District"
                    />
                  </Field>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="font-serif text-2xl font-bold text-primary">What are you growing?</h1>
                <p className="mt-1 text-sm text-text-light">Pick your main crop.</p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CROP_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => update('crop', c.label)}
                      className={`rounded-xl border-2 p-4 text-center transition-all ${
                        form.crop === c.label
                          ? 'border-primary bg-primary-soft'
                          : 'border-border bg-white hover:border-primary/40'
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                          form.crop === c.label
                            ? 'bg-primary text-white'
                            : 'bg-primary-soft text-primary'
                        }`}
                      >
                        {c.label.slice(0, 1)}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-text-dark">{c.label}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-5 space-y-4">
                  <Field label="Variety (optional)">
                    <input
                      className={inputClass}
                      value={form.cropVariety}
                      onChange={(e) => update('cropVariety', e.target.value)}
                      placeholder="e.g. Hybrid 440"
                    />
                  </Field>
                  <Field label="Current crop stage">
                    <select
                      className={inputClass}
                      value={form.cropStage}
                      onChange={(e) => update('cropStage', e.target.value)}
                    >
                      {CROP_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="font-serif text-2xl font-bold text-primary">About this field</h1>
                <p className="mt-1 text-sm text-text-light">A few details about the land.</p>
                <div className="mt-6 space-y-4">
                  <Field label="Field name">
                    <input
                      className={inputClass}
                      value={form.fieldName}
                      onChange={(e) => update('fieldName', e.target.value)}
                      placeholder="Green Valley Field"
                    />
                  </Field>
                  <Field label="Area (acres)">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      className={inputClass}
                      value={form.areaAcres}
                      onChange={(e) => update('areaAcres', e.target.value)}
                      placeholder="1.5"
                    />
                  </Field>
                  <Field label="Soil type">
                    <div className="flex flex-wrap gap-2">
                      {SOIL_OPTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => update('soilType', s)}
                          className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                            form.soilType === s
                              ? 'bg-earth-soft border-earth text-earth'
                              : 'bg-white border-border text-text-light hover:border-earth/40'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Sowing date">
                    <input
                      type="date"
                      className={inputClass}
                      value={form.sowingDate}
                      onChange={(e) => update('sowingDate', e.target.value)}
                    />
                  </Field>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success mb-4">
                  <Check size={32} />
                </div>
                <h1 className="font-serif text-2xl font-bold text-primary">You&apos;re all set!</h1>
                <p className="mt-2 text-sm text-text-light max-w-sm mx-auto">
                  Your field is ready. AgroVision will keep track of scans, watering, and yield
                  as you use it.
                </p>
                <Button
                  size="lg"
                  className="mt-8"
                  onClick={() => navigate('/app')}
                >
                  Go to Field Overview
                </Button>
              </div>
            )}

            {step < 3 && (
              <div className="mt-8 flex justify-between gap-3">
                <Button
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
                {step < 2 ? (
                  <Button disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                    Continue
                  </Button>
                ) : (
                  <Button disabled={!canNext()} onClick={finish}>
                    Finish setup
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-text-dark mb-1.5">{label}</span>
      {children}
    </label>
  );
}
