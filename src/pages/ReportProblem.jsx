import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Bug,
  Sun,
  Sprout,
  Droplets,
  Droplet,
  HelpCircle,
  Check,
  ImagePlus,
} from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import FieldSelector from '../components/Layout/FieldSelector';
import EmptyState from '../components/Common/EmptyState';
import { useApp } from '../context/AppContext';
import { PROBLEM_TYPES } from '../data/mockData';

const iconMap = {
  leaf: Leaf,
  bug: Bug,
  sun: Sun,
  sprout: Sprout,
  droplets: Droplets,
  droplet: Droplet,
  help: HelpCircle,
};

export default function ReportProblem() {
  const { selectedField, selectedFieldId, reportProblem } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef(null);

  if (!selectedField) {
    return (
      <EmptyState
        icon="sprout"
        title="No field selected"
        description="Choose a field before reporting a problem."
      />
    );
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success mb-4">
          <Check size={32} />
        </div>
        <h1 className="font-serif text-2xl font-bold text-primary">Problem saved</h1>
        <p className="mt-2 text-sm text-text-light max-w-sm">
          Thanks — this helps AgroVision keep track of what&apos;s happening in your field.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/app')}>
            Back to overview
          </Button>
          <Button onClick={() => navigate('/app/history')}>View history</Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!selected) return;
    const type = PROBLEM_TYPES.find((p) => p.id === selected);
    reportProblem(selectedFieldId, {
      type: selected,
      label: type.label,
      description,
      photo,
    });
    setSaved(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase mb-1">
          Report a Problem
        </p>
        <FieldSelector />
      </div>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          What&apos;s going on with your crop?
        </h1>
        <p className="mt-2 text-sm text-text-light">
          Pick what looks closest. You can add a photo and a short note.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PROBLEM_TYPES.map((p) => {
          const Icon = iconMap[p.icon] || HelpCircle;
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                active
                  ? 'border-primary bg-primary-soft'
                  : 'border-border bg-white hover:border-primary/40'
              }`}
            >
              <Icon size={22} className={active ? 'text-primary' : 'text-text-light'} />
              <p className="mt-2 text-sm font-semibold text-text-dark">{p.label}</p>
            </button>
          );
        })}
      </div>

      <Card>
        <label className="block text-sm font-medium text-text-dark mb-1.5">
          Short description <span className="text-text-light font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Yellowing near the north edge of the field"
          className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />

        <div className="mt-4">
          <p className="text-sm font-medium text-text-dark mb-1.5">
            Photo <span className="text-text-light font-normal">(optional)</span>
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => setPhoto(ev.target.result);
              reader.readAsDataURL(file);
            }}
          />
          {photo ? (
            <div className="relative inline-block">
              <img src={photo} alt="Problem" className="h-24 rounded-xl object-cover" />
              <button
                type="button"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-alert text-white text-xs"
                onClick={() => setPhoto(null)}
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-text-light hover:border-primary hover:text-primary"
            >
              <ImagePlus size={16} /> Add photo
            </button>
          )}
        </div>
      </Card>

      <p className="text-xs text-text-light text-center">
        This information helps AgroVision keep track of your field over time.
      </p>

      <Button size="lg" fullWidth disabled={!selected} onClick={handleSave}>
        Save Problem
      </Button>
    </div>
  );
}
