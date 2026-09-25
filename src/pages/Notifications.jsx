import { Droplets, Leaf, Wheat, Sun } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

const typeMeta = {
  irrigation: { icon: Droplets, color: 'bg-water-soft text-water' },
  disease: { icon: Leaf, color: 'bg-warning-soft text-warning' },
  yield: { icon: Wheat, color: 'bg-earth-soft text-earth' },
  crop: { icon: Sun, color: 'bg-success-soft text-success' },
};

export default function Notifications() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
  } = useApp();

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon="bell"
        title="No notifications"
        description="When something needs your attention — like watering or a crop issue — it will show up here."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-text-light">
            Updates about your fields — watering, crop issues, and forecasts.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        )}
      </div>

      <ul className="space-y-3">
        {notifications.map((n) => {
          const meta = typeMeta[n.type] || typeMeta.crop;
          const Icon = meta.icon;
          return (
            <li key={n.id}>
              <Card
                className={`!p-4 flex gap-4 transition-opacity ${
                  n.read ? 'opacity-70' : ''
                }`}
                onClick={() => markNotificationRead(n.id)}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.color}`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text-dark text-sm">{n.title}</p>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Unread" />
                    )}
                  </div>
                  <p className="text-sm text-text-light mt-0.5">{n.message}</p>
                  <p className="text-xs text-text-light mt-1.5">{n.time}</p>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
