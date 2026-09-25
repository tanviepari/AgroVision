import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Common/Button';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES } from '../data/mockData';
import { apiErrorMessage } from '../services/api';

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

const emptyRegister = {
  name: '',
  mobile: '',
  email: '',
  password: '',
  confirmPassword: '',
  location: '',
  state: '',
  district: '',
  termsAccepted: false,
};

export default function Login() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState(emptyRegister);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'register') {
        await register({ ...form, termsAccepted: form.termsAccepted === true });
        navigate('/setup');
      } else {
        const hasFields = await login(contact, password);
        navigate(hasFields ? '/app' : '/setup');
      }
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen leaf-pattern bg-bg-warm flex">
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
            {mode === 'login' ? (
              <>
                <label className="block">
                  <span className="block text-sm font-medium text-text-dark mb-1.5">Mobile or email</span>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="98765 43210 or you@email.com"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-text-dark mb-1.5">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className={`${inputClass} pr-11`}
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
                </label>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Field label="Full name">
                  <input className={inputClass} required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ravi Kumar" />
                </Field>
                <Field label="Mobile number">
                  <input className={inputClass} required inputMode="numeric" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} placeholder="9876543210" />
                </Field>
                <Field label="Email (optional)">
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" />
                </Field>
                <Field label="Password">
                  <input type={showPassword ? 'text' : 'password'} required minLength={8} className={inputClass} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="At least 8 characters" />
                </Field>
                <Field label="Confirm password">
                  <input type={showPassword ? 'text' : 'password'} required className={inputClass} value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                </Field>
                <Field label="Location">
                  <input className={inputClass} required value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Village or town" />
                </Field>
                <Field label="State">
                  <select className={inputClass} required value={form.state} onChange={(e) => update('state', e.target.value)}>
                    <option value="">Choose state</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </Field>
                <Field label="District">
                  <input className={inputClass} required value={form.district} onChange={(e) => update('district', e.target.value)} placeholder="Nashik" />
                </Field>
                <label className="flex items-start gap-2 text-sm text-text-dark">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={form.termsAccepted}
                    onChange={(e) => update('termsAccepted', e.target.checked)}
                    required
                  />
                  <span>I accept the terms and conditions.</span>
                </label>
              </>
            )}

            {error && (
              <p className="text-sm text-alert" role="alert">{error}</p>
            )}

            <Button type="submit" size="lg" fullWidth className="mt-2" disabled={submitting}>
              {submitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-light">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button type="button" className="font-semibold text-primary hover:underline" onClick={() => { setMode('register'); setError(''); }}>
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" className="font-semibold text-primary hover:underline" onClick={() => { setMode('login'); setError(''); }}>
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-text-dark mb-1.5">{label}</span>
      {children}
    </label>
  );
}
