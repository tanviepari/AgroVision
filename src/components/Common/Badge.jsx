import PropTypes from 'prop-types';
import { Check, Droplets, AlertTriangle, AlertCircle } from 'lucide-react';

const statusConfig = {
  HEALTHY: {
    label: 'HEALTHY',
    className: 'bg-success/15 text-success uppercase tracking-wide',
    icon: Check,
  },
  OPTIMAL: {
    label: 'Optimal',
    className: 'bg-success/15 text-success',
    icon: Check,
  },
  NEEDS_WATER: {
    label: 'NEEDS WATER',
    className: 'bg-warning/15 text-warning uppercase tracking-wide',
    icon: Droplets,
  },
  DRY: {
    label: 'Dry',
    className: 'bg-alert/15 text-alert',
    icon: AlertTriangle,
  },
  ALERT: {
    label: 'ALERT',
    className: 'bg-alert/15 text-alert uppercase tracking-wide',
    icon: AlertTriangle,
  },
  CRITICAL: {
    label: 'CRITICAL',
    className: 'bg-alert text-white uppercase tracking-wide',
    icon: AlertCircle,
  },
  'High Impact': {
    label: 'High Impact',
    className: 'bg-success/15 text-success',
    icon: null,
  },
  'Medium Impact': {
    label: 'Medium Impact',
    className: 'bg-gray-100 text-text-light',
    icon: null,
  },
  'Action Needed': {
    label: 'Action Needed',
    className: 'bg-alert text-white',
    icon: null,
  },
};

/**
 * Color-coded status badge matched to AgroVision design system.
 */
export default function Badge({ status, className = '', showIcon = true }) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-100 text-text-light',
    icon: null,
  };
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full px-2.5 py-1
        text-xs font-bold
        ${config.className} ${className}
      `}
    >
      {showIcon && Icon && <Icon size={12} strokeWidth={2.5} aria-hidden="true" />}
      {config.label}
    </span>
  );
}

Badge.propTypes = {
  status: PropTypes.string.isRequired,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
};
