import PropTypes from 'prop-types';

export default function Card({ children, className = '', padding = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-black/[0.04] shadow-[var(--shadow-card)]
        ${padding ? 'p-5 sm:p-6' : ''}
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.bool,
  onClick: PropTypes.func,
};
