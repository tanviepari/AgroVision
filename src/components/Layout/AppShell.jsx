import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { useApp } from '../../context/AppContext';

/**
 * App shell — sticky top navbar + page content.
 * Field Overview is full-bleed; other pages get standard padding.
 */
export default function AppShell() {
  const { toast } = useApp();
  const { pathname } = useLocation();
  const isOverview = pathname === '/app' || pathname === '/app/';

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main
        className={
          isOverview
            ? 'flex-1'
            : 'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10'
        }
        id="main-content"
      >
        <Outlet />
      </main>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === 'error' ? 'bg-alert' : 'bg-primary'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
