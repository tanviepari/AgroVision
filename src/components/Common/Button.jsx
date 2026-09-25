import PropTypes from 'prop-types';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-light shadow-sm focus-visible:ring-primary',
  secondary:
    'bg-white text-primary border border-primary/20 hover:bg-primary-soft focus-visible:ring-primary',
  ghost:
    'bg-transparent text-text-dark hover:bg-black/[0.04] focus-visible:ring-gray-400',
  soft: 'bg-primary-soft text-primary hover:bg-primary/15 focus-visible:ring-primary',
  danger: 'bg-alert text-white hover:bg-red-600 focus-visible:ring-alert',
  water: 'bg-water text-white hover:bg-sky-600 focus-visible:ring-water',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ariaLabel,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}
      `}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'soft', 'danger', 'water']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
  fullWidth: PropTypes.bool,
};
