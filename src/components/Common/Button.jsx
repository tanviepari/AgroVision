import PropTypes from 'prop-types';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-light focus-visible:ring-primary',
  secondary:
    'bg-white text-primary border border-primary/20 hover:bg-primary/5 focus-visible:ring-primary',
  ghost:
    'bg-gray-100 text-text-dark hover:bg-gray-200 focus-visible:ring-gray-400',
  success:
    'bg-[#3d6b3a] text-white hover:bg-[#4a7d46] focus-visible:ring-success',
  danger:
    'bg-alert text-white hover:bg-red-600 focus-visible:ring-alert',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * Reusable button with color variants and sizes.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ariaLabel,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'success', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};
