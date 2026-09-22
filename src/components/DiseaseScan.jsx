import { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus, Upload, X, CheckCircle2 } from 'lucide-react';
import ResultCard from './ResultCard';
import { diseaseResults } from '../data/mockData';

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

/**
 * Disease Scan page — drag-and-drop upload + sample diagnostic results.
 */
export default function DiseaseScan() {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const {
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const validateAndSetFile = useCallback(
    (file) => {
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('image', { message: 'Only JPG and PNG files are supported.' });
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError('image', { message: `File must be under ${MAX_SIZE_MB}MB.` });
        return;
      }

      clearErrors('image');
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    },
    [setError, clearErrors]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const clearFile = () => {
    setPreview(null);
    setFileName('');
    clearErrors('image');
    if (inputRef.current) inputRef.current.value = '';
  };

  const { ref: registerRef, ...registerRest } = register('image');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Upload */}
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
            Diagnose Crop Health
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-light leading-relaxed max-w-md">
            Upload a clear photo of the affected leaf or crop area. Our AI will analyze
            the image to identify potential diseases and recommend actionable treatment
            plans.
          </p>

          <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload crop photo — drag and drop or click to browse"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center
                min-h-[280px] sm:min-h-[340px] rounded-2xl border-2 border-dashed
                cursor-pointer transition-all duration-200
                ${
                  isDragging
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : preview
                      ? 'border-success/40 bg-success/5'
                      : 'border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/[0.02]'
                }
              `}
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                className="sr-only"
                aria-describedby="upload-hint"
                {...registerRest}
                ref={(el) => {
                  registerRef(el);
                  inputRef.current = el;
                }}
                onChange={handleChange}
              />

              {preview ? (
                <div className="flex flex-col items-center gap-3 p-6 w-full">
                  <img
                    src={preview}
                    alt="Uploaded crop preview"
                    className="max-h-48 rounded-xl object-contain shadow-sm"
                  />
                  <div className="flex items-center gap-2 text-sm text-success font-medium">
                    <CheckCircle2 size={16} aria-hidden="true" />
                    {fileName}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-text-light hover:text-alert transition-colors"
                    aria-label="Remove uploaded file"
                  >
                    <X size={14} /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                    <ImagePlus size={26} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-dark text-base">
                      Drag &amp; drop photo here
                    </p>
                    <p className="mt-1 text-sm text-text-light">
                      or click to browse from device
                    </p>
                  </div>
                  <p
                    id="upload-hint"
                    className="mt-2 text-[11px] font-medium tracking-wider text-text-light uppercase"
                  >
                    Supports JPG, PNG (MAX 10MB)
                  </p>
                </div>
              )}
            </div>

            {errors.image && (
              <p className="mt-3 text-sm text-alert" role="alert">
                {errors.image.message}
              </p>
            )}

            {preview && (
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-light transition-colors"
              >
                <Upload size={16} aria-hidden="true" />
                Analyze Image
              </button>
            )}
          </form>
        </div>

        {/* Right: Sample results + Precision Diagnostics */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diseaseResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-white border border-black/[0.03] shadow-sm p-5 sm:p-6">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-primary">
              Precision Diagnostics
            </h2>
            <p className="mt-2 text-sm text-text-light leading-relaxed">
              Our models are trained on thousands of plant pathology samples to ensure
              accurate identification across major crop types.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
