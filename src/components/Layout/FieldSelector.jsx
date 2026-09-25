import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * Shows which field the farmer is currently viewing.
 */
export default function FieldSelector({ className = '' }) {
  const { fields, selectedFieldId, setSelectedFieldId, selectedField } = useApp();

  if (!fields.length) return null;

  if (fields.length === 1 && selectedField) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="text-sm sm:text-base font-medium text-text-dark">
          {selectedField.name}
          <span className="text-text-light font-normal">
            {' '}
            — {selectedField.crop} — {selectedField.areaAcres} acres
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        value={selectedFieldId || ''}
        onChange={(e) => setSelectedFieldId(e.target.value)}
        aria-label="Select field"
        className="appearance-none bg-white border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-text-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
      >
        {fields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} — {f.crop} — {f.areaAcres} acres
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-light"
        aria-hidden="true"
      />
    </div>
  );
}

FieldSelector.propTypes = {
  className: PropTypes.string,
};
