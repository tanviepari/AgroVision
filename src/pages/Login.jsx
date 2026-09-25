import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login, registerStart } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | register
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'register') {
      registerStart();
      navigate('/setup');
    } else {
      login();
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen leaf-pattern bg-bg-warm flex">
      {/* Visual panel */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-primary flex-col justify-between p-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=1400&fit=crop')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-primary/75" aria-hidden="true" />
        <div className="relative z-10 flex items-center gap-2 text-white">
          <Leaf size={28} />
          <span className="font-serif text-2xl font-bold">AgroVision</span>
        </div>
        <div className="relative z-10 max-w-md text-white">
          <h1 className="font-serif text-4xl font-bold leading-tight">
            Your friendly digital farm assistant
          </h1>
          <p className="mt-4 text-white/85 text-base leading-relaxed">
            Check crop health, know when to water, and see what your harvest might look
            like — all in one simple place.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 text-primary">
            <Leaf size={24} />
            <span className="font-serif text-xl font-bold">AgroVision</span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-primary">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-text-light text-sm">
            {mode === 'login'
              ? 'Sign in to check on your fields.'
              : 'Join AgroVision and set up your first field.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-text-dark mb-1.5">
                Mobile or email
              </label>
              <input
                id="contact"
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="98765 43210 or you@email.com"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-dark"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" fullWidth className="mt-2">
              {mode === 'login' ? 'Log in' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-light">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setMode('register')}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setMode('login')}
                >
                  Log in
                </button>
              </>
            )}
          </p>

          <p className="mt-8 text-center text-xs text-text-light">
            Demo only — any details will sign you in.{' '}
            <Link to="/app" className="text-primary underline" onClick={() => login()}>
              Skip to app
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
