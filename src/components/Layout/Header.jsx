import { NavLink, Link } from 'react-router-dom';
import { Bell, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const navLinks = [
  { to: '/app', end: true, label: 'Field Overview' },
  { to: '/app/disease-scan', label: 'Disease Scan' },
  { to: '/app/irrigation', label: 'Irrigation' },
  { to: '/app/yield', label: 'Yield Forecast' },
  { to: '/app/history', label: 'Field History' },
];

/**
 * Sticky top navbar — logo, centered links, notifications + profile.
 */
export default function Header() {
  const { unreadCount } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/[0.04]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/app"
          className="font-serif text-xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity"
          aria-label="AgroVision home"
        >
          AgroVision
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `relative pb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary'
                    : 'text-text-light hover:text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/app/notifications"
            className="relative rounded-full p-2 text-text-light hover:bg-gray-100 hover:text-primary transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-alert ring-2 ring-white"
                aria-hidden="true"
              />
            )}
          </Link>
          <Link
            to="/app/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-light transition-colors"
            aria-label="Profile and settings"
          >
            <User size={18} />
          </Link>
          <button
            type="button"
            className="md:hidden rounded-full p-2 text-text-light hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="md:hidden border-t border-border px-4 py-3 space-y-1 bg-white"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-primary-soft text-primary' : 'text-text-dark hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
