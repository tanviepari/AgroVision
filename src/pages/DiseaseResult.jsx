import { useNavigate } from 'react-router-dom';
import { RotateCcw, Save, Leaf } from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import StatusBadge from '../components/Common/StatusBadge';
import EmptyState from '../components/Common/EmptyState';
import { useApp } from '../context/AppContext';

export default function DiseaseResult() {
  const {
    selectedField,
    selectedFieldId,
    pendingScanResult,
    saveScanResult,
    setPendingScanResult,
    showToast,
    apiErrorMessage,
  } = useApp();
  const navigate = useNavigate();

  if (!pendingScanResult) {
    return (
      <EmptyState
        icon="scan"
        title="No scan result yet"
        description="Scan a crop photo to see results here."
        actionLabel="Scan Crop"
        onAction={() => navigate('/app/disease-scan')}
      />
    );
  }

  const result = pendingScanResult;

  const handleSave = async () => {
    try {
      await saveScanResult(result.id);
      navigate('/app/history');
    } catch (err) {
      showToast(apiErrorMessage(err), 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase">
          Scan result · {selectedField?.crop}
        </p>
        <h1 className="font-serif text-3xl font-bold text-primary mt-1">{result.issue}</h1>
        <div className="mt-2">
          <StatusBadge status="moderate" label={result.severity} />
        </div>
      </div>

      {result.imagePreview && (
        <Card padding={false} className="overflow-hidden">
          <img
            src={result.imagePreview}
            alt="Scanned crop"
            className="w-full max-h-64 object-cover"
          />
        </Card>
      )}

      <Card>
        <p className="text-base text-text-dark leading-relaxed">{result.explanation}</p>
        {result.disclaimer && (
          <p className="mt-3 text-sm text-text-light">{result.disclaimer}</p>
        )}
        {result.symptoms?.length > 0 && (
          <ul className="mt-3 list-disc pl-5 text-sm text-text-dark space-y-1">
            {result.symptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Leaf size={18} className="text-primary" />
          <h2 className="font-serif text-lg font-bold text-primary">What to do</h2>
        </div>
        <ol className="space-y-3">
          {result.treatment.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-sm text-text-dark pt-1 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="bg-earth-soft/40 border-earth/10">
        <h3 className="font-semibold text-text-dark">Keep watching</h3>
        <p className="mt-1 text-sm text-text-light">{result.followUp}</p>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            setPendingScanResult(null);
            navigate('/app/disease-scan');
          }}
        >
          <RotateCcw size={16} />
          Scan Again
        </Button>
        <Button className="flex-1" onClick={handleSave}>
          <Save size={16} />
          Save Result
        </Button>
      </div>
    </div>
  );
}
