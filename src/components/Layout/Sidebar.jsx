import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  Droplets,
  Wheat,
  History,
  Bell,
  User,
  Leaf,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const mainNav = [
  { to: '/app', end: true, label: 'Field Overview', icon: LayoutDashboard },
  { to: '/app/disease-scan', label: 'Disease Scan', icon: ScanLine },
  { to: '/app/irrigation', label: 'Irrigation', icon: Droplets },
  { to: '/app/yield', label: 'Yield Forecast', icon: Wheat },
  { to: '/app/history', label: 'Field History', icon: History },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar() {
  const { unreadCount, farmer } = useApp();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar text-white min-h-screen sticky top-0">
      <div className="px-5 py-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
          <Leaf size={18} aria-hidden="true" />
        </div>
        <div>
          <p className="font-serif font-bold text-lg leading-tight">AgroVision</p>
          <p className="text-[11px] text-white/55 truncate max-w-[140px]">
            {farmer.farmName}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5" aria-label="Main">
        {mainNav.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/65 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {label === 'Notifications' && unreadCount > 0 && (
              <span className="rounded-full bg-alert px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-2 border-t border-white/10">
        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white/15 text-white'
                : 'text-white/65 hover:bg-white/8 hover:text-white'
            }`
          }
        >
          <User size={18} aria-hidden="true" />
          Profile / Settings
        </NavLink>
      </div>
    </aside>
  );
}
