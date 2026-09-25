import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Button from '../components/Common/Button';
import { api, apiErrorMessage } from '../services/api';

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        token: params.get('token') || '',
        password,
        confirmPassword,
      });
      setMessage(data.message);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen leaf-pattern bg-bg-warm flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 text-primary">
          <Leaf size={24} />
          <span className="font-serif text-xl font-bold">AgroVision</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-primary">Choose a new password</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-text-dark mb-1.5">New password</span>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-text-dark mb-1.5">Confirm password</span>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
          </label>
          {message && <p className="text-sm text-primary" role="status">{message}</p>}
          {error && <p className="text-sm text-alert" role="alert">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={submitting || Boolean(message)}>
            {submitting ? 'Please wait...' : 'Update password'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-semibold text-primary hover:underline">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
