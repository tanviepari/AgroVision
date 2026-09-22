import PropTypes from 'prop-types';

/**
 * Basic white card wrapper with subtle shadow and rounded corners.
 */
export default function Card({ children, className = '', onClick, role, ariaLabel }) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-black/[0.03] ${className}`}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
};
