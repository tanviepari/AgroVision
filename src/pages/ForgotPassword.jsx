import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Button from '../components/Common/Button';
import { api, apiErrorMessage } from '../services/api';

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

export default function ForgotPassword() {
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { contact });
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
        <h1 className="font-serif text-3xl font-bold text-primary">Reset password</h1>
        <p className="mt-2 text-sm text-text-light">
          Enter the email saved on your account. We will send a reset link if email is set up.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-text-dark mb-1.5">Email</span>
            <input
              type="email"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={inputClass}
              placeholder="you@email.com"
            />
          </label>
          {message && <p className="text-sm text-primary" role="status">{message}</p>}
          {error && <p className="text-sm text-alert" role="alert">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            {submitting ? 'Please wait...' : 'Send reset link'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-semibold text-primary hover:underline">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
