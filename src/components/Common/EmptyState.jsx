import PropTypes from 'prop-types';
import { Sprout, Inbox, Droplets, Bell, ScanLine } from 'lucide-react';
import Button from './Button';

const icons = {
  sprout: Sprout,
  inbox: Inbox,
  droplets: Droplets,
  bell: Bell,
  scan: ScanLine,
};

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
}) {
  const Icon = icons[icon] || Inbox;
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg font-bold text-primary">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-text-light max-w-sm leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};
