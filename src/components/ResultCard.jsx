import PropTypes from 'prop-types';
import Card from './Common/Card';

/** Decorative corn plant SVG for sample result cards */
function PlantIllustration({ healthy }) {
  return (
    <svg
      viewBox="0 0 160 200"
      className="h-full w-full max-h-52 mx-auto"
      aria-hidden="true"
    >
      {/* Stem */}
      <path
        d="M80 190 V50"
        stroke={healthy ? '#1a5f4a' : '#a16207'}
        strokeWidth="4"
        fill="none"
      />
      {/* Leaves */}
      {[0, 1, 2, 3].map((i) => {
        const y = 60 + i * 28;
        const color = healthy
          ? ['#22c55e', '#16a34a', '#4ade80', '#15803d'][i]
          : ['#ca8a04', '#a16207', '#eab308', '#854d0e'][i];
        return (
          <g key={i}>
            <path
              d={`M80 ${y} Q40 ${y - 10} 25 ${y + 15}`}
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M80 ${y + 8} Q120 ${y - 2} 135 ${y + 20}`}
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            {!healthy && i < 2 && (
              <circle cx={35 + i * 10} cy={y + 5} r="4" fill="#ef4444" opacity="0.8" />
            )}
          </g>
        );
      })}
      {/* Cob */}
      <ellipse
        cx="80"
        cy="45"
        rx="14"
        ry="22"
        fill={healthy ? '#eab308' : '#ca8a04'}
      />
      <ellipse
        cx="80"
        cy="28"
        rx="8"
        ry="6"
        fill={healthy ? '#22c55e' : '#a16207'}
      />
      {/* Scan lines */}
      <line
        x1="20"
        y1="90"
        x2="50"
        y2="90"
        stroke={healthy ? '#22c55e' : '#ef4444'}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle
        cx="20"
        cy="90"
        r="3"
        fill={healthy ? '#22c55e' : '#ef4444'}
      />
    </svg>
  );
}

PlantIllustration.propTypes = {
  healthy: PropTypes.bool.isRequired,
};

/**
 * Sample disease scan result card — healthy or critical plant diagnostics.
 */
export default function ResultCard({ result }) {
  const isHealthy = result.status === 'HEALTHY';

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <div
        className={`relative h-48 sm:h-56 overflow-hidden ${
          isHealthy
            ? 'bg-gradient-to-b from-[#e8f5e9] to-[#c8e6c9]'
            : 'bg-gradient-to-b from-[#fef3c7] to-[#fde68a]'
        }`}
      >
        <div className="absolute inset-0 flex items-end justify-center pt-4 px-4">
          <PlantIllustration healthy={isHealthy} />
        </div>
        <div
          className={`absolute inset-x-0 bottom-0 ${
            isHealthy ? 'bg-primary/85' : 'bg-alert/85'
          } px-3 py-2`}
        >
          <p className="text-[10px] sm:text-xs font-bold tracking-wide text-white uppercase">
            {result.label}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-2">
        <h3
          className={`font-semibold text-sm ${
            isHealthy ? 'text-success' : 'text-alert'
          }`}
        >
          {isHealthy ? 'Healthy Plant' : result.diseaseName}
        </h3>

        <dl className="space-y-1.5 text-xs sm:text-sm">
          <div className="flex justify-between">
            <dt className="text-text-light">
              {isHealthy ? 'AI Score' : 'AI Confidence'}
            </dt>
            <dd className="font-semibold text-text-dark">{result.aiScore}%</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-light">
              {isHealthy ? 'Leaf Integrity' : 'Treatment Priority'}
            </dt>
            <dd
              className={`font-semibold ${
                isHealthy ? 'text-text-dark' : 'text-warning'
              }`}
            >
              {isHealthy ? `${result.leafIntegrity}%` : result.severity}
            </dd>
          </div>
          {!isHealthy && (
            <div className="flex justify-between">
              <dt className="text-text-light">Status</dt>
              <dd className="font-bold text-alert">CRITICAL</dd>
            </div>
          )}
        </dl>
      </div>
    </Card>
  );
}

ResultCard.propTypes = {
  result: PropTypes.shape({
    id: PropTypes.number.isRequired,
    plantImage: PropTypes.string,
    diseaseName: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    leafIntegrity: PropTypes.number.isRequired,
    aiScore: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};
