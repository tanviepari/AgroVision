import PropTypes from 'prop-types';

const styles = {
  good: 'bg-success-soft text-success',
  attention: 'bg-warning-soft text-warning',
  poor: 'bg-alert-soft text-alert',
  moderate: 'bg-warning-soft text-warning',
  low: 'bg-alert-soft text-alert',
  ok: 'bg-success-soft text-success',
  high: 'bg-water-soft text-water',
  completed: 'bg-success-soft text-success',
  pending: 'bg-earth-soft text-earth',
};

export default function StatusBadge({ status, label, className = '' }) {
  const key = (status || '').toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[key] || 'bg-gray-100 text-text-light'
      } ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      {label || status}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
};
