import PropTypes from 'prop-types';

export default function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  className = '',
  height = 'h-2.5',
  label,
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    alert: 'bg-alert',
    water: 'bg-water',
    earth: 'bg-earth',
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between mb-1.5 text-xs text-text-light">
          <span>{label}</span>
          <span className="font-semibold text-text-dark">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className={`w-full rounded-full bg-gray-100 overflow-hidden ${height}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color] || colors.primary}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.string,
  label: PropTypes.string,
};
