import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Loader2, X } from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import FieldSelector from '../components/Layout/FieldSelector';
import EmptyState from '../components/Common/EmptyState';
import { useApp } from '../context/AppContext';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const MAX_MB = 10;

export default function DiseaseScan() {
  const { selectedField, runMockScan, showToast } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const setFile = useCallback(
    (file) => {
      if (!file) return;
      if (!ACCEPTED.includes(file.type)) {
        setError('Please upload a JPG or PNG photo.');
        showToast('Invalid image', 'error');
        return;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`Photo must be under ${MAX_MB}MB.`);
        showToast('Image upload failed', 'error');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    },
    [showToast]
  );

  const handleScan = async () => {
    if (!preview) return;
    setChecking(true);
    try {
      await runMockScan(preview);
      navigate('/app/disease-result');
    } catch {
      showToast('Scan failed. Please try again.', 'error');
    } finally {
      setChecking(false);
    }
  };

  if (!selectedField) {
    return (
      <EmptyState
        icon="scan"
        title="No field selected"
        description="Add a field before scanning your crop."
      />
    );
  }

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <h1 className="font-serif text-2xl font-bold text-primary">Checking your crop...</h1>
        <p className="mt-2 text-sm text-text-light max-w-sm">
          Looking at the photo you shared. This usually takes a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <p className="text-xs font-semibold tracking-wider text-text-light uppercase mb-1">
          Disease Scan
        </p>
        <FieldSelector />
      </div>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          Take a clear photo of the affected part of your crop.
        </h1>
        <p className="mt-2 text-sm text-text-light">
          Close-up leaf or stem photos work best. Good light helps.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload crop photo"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          setFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center min-h-[280px] rounded-2xl
          border-2 border-dashed cursor-pointer transition-all bg-white
          ${dragging ? 'border-primary bg-primary-soft scale-[1.01]' : 'border-border hover:border-primary/50'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0])}
        />

        {preview ? (
          <div className="p-6 w-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={preview}
              alt="Crop preview"
              className="max-h-52 rounded-xl object-contain"
            />
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-text-light hover:text-alert"
              onClick={() => {
                setPreview(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              <X size={14} /> Remove photo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
              <ImagePlus size={26} />
            </div>
            <p className="font-semibold text-text-dark">Drag & drop a photo here</p>
            <p className="text-sm text-text-light">or click to choose from your device</p>
            <p className="text-[11px] uppercase tracking-wider text-text-light mt-1">
              JPG, PNG · max 10MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-alert" role="alert">
          {error}
        </p>
      )}

      <Button size="lg" fullWidth disabled={!preview} onClick={handleScan}>
        Scan Crop
      </Button>

      <Card className="!p-4 bg-primary-soft/50 border-0 shadow-none">
        <p className="text-sm text-text-dark">
          <span className="font-semibold">Tip:</span> Include both healthy and affected leaves
          if you can — it helps spot the difference.
        </p>
      </Card>
    </div>
  );
}
