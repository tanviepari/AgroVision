import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  Droplets,
  Wheat,
  History,
  Bell,
  User,
  Leaf,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

const mobileNav = [
  { to: '/app', end: true, label: 'Home', icon: LayoutDashboard },
  { to: '/app/disease-scan', label: 'Scan', icon: ScanLine },
  { to: '/app/irrigation', label: 'Water', icon: Droplets },
  { to: '/app/yield', label: 'Yield', icon: Wheat },
  { to: '/app/profile', label: 'Profile', icon: User },
];

export default function AppShell() {
  const { toast, unreadCount } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-sidebar text-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Leaf size={18} />
            <span className="font-serif font-bold">AgroVision</span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/app/notifications" className="relative p-2" aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-alert" />
              )}
            </NavLink>
            <button
              type="button"
              className="p-2"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {menuOpen && (
          <div className="md:hidden bg-sidebar text-white px-3 pb-4 space-y-1">
            {[
              ...mobileNav,
              { to: '/app/history', label: 'History', icon: History },
              { to: '/app/notifications', label: 'Notifications', icon: Bell },
            ].map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to + label}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                    isActive ? 'bg-white/15' : 'text-white/70'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        )}

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border flex justify-around py-2 z-40"
          aria-label="Mobile"
        >
          {mobileNav.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium ${
                  isActive ? 'text-primary' : 'text-text-light'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === 'error' ? 'bg-alert' : 'bg-primary'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
