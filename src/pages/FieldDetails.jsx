import { Link } from 'react-router-dom';
import {
  ScanLine,
  Droplets,
  Wheat,
  History,
  AlertCircle,
  MapPin,
  Calendar,
} from 'lucide-react';
import Card from '../components/Common/Card';
import StatusBadge from '../components/Common/StatusBadge';
import ProgressBar from '../components/Common/ProgressBar';
import FieldSelector from '../components/Layout/FieldSelector';
import EmptyState from '../components/Common/EmptyState';
import { useApp } from '../context/AppContext';

export default function FieldDetails() {
  const {
    selectedField,
    selectedFieldId,
    irrigationRecommendations,
    yieldForecasts,
  } = useApp();

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

      <section>
        <h2 className="font-serif text-xl font-bold text-primary mb-4">Go to</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { to: '/app/disease-scan', label: 'Disease Scan', icon: ScanLine },
            { to: '/app/irrigation', label: 'Irrigation', icon: Droplets },
            { to: '/app/yield', label: 'Yield Forecast', icon: Wheat },
            { to: '/app/history', label: 'Field History', icon: History },
            { to: '/app/report-problem', label: 'Report Problem', icon: AlertCircle },
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
