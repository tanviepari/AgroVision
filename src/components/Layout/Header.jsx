import { NavLink } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Field Overview' },
  { to: '/disease-scan', label: 'Disease Scan' },
  { to: '/irrigation', label: 'Irrigation' },
  { to: '/yield-forecast', label: 'Yield Forecast' },
];

/**
 * Sticky top navigation with logo, page tabs, notifications, and profile.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/[0.04]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink
          to="/"
          className="font-serif text-xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity"
          aria-label="AgroVision home"
        >
          AgroVision
        </NavLink>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
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

        {/* Mobile nav select */}
        <nav className="md:hidden flex-1 mx-4 overflow-x-auto" aria-label="Mobile navigation">
          <div className="flex gap-4 min-w-max">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative pb-1 text-xs font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-primary after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-primary'
                      : 'text-text-light'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-full p-2 text-text-light hover:bg-gray-100 hover:text-primary transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-alert ring-2 ring-white"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-light transition-colors"
            aria-label="User profile"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
