import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES, LANGUAGE_OPTIONS } from '../data/mockData';
import { apiErrorMessage } from '../services/api';

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

export default function Profile() {
  const { farmer, fields, updateFarmer, logout } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: farmer.name,
    contact: farmer.contact,
    email: farmer.email || '',
    location: farmer.location,
    state: farmer.state || '',
    district: farmer.district || '',
    preferredLanguage: farmer.preferredLanguage,
    farmName: farmer.farmName,
  });
  const [notifyIrrigation, setNotifyIrrigation] = useState(farmer.notificationPrefs?.irrigation !== false);
  const [notifyDisease, setNotifyDisease] = useState(farmer.notificationPrefs?.disease !== false);
  const [notifyYield, setNotifyYield] = useState(farmer.notificationPrefs?.yield !== false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await updateFarmer({
        ...form,
        notificationPrefs: {
          irrigation: notifyIrrigation,
          disease: notifyDisease,
          yield: notifyYield,
        },
      });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          Profile & Settings
        </h1>
        <p className="mt-1 text-sm text-text-light">Your details and preferences.</p>
      </div>

      <Card>
        <h2 className="font-serif text-lg font-bold text-primary mb-4">Farmer</h2>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-text-light">Name</span>
            <input
              className={`${inputClass} mt-1`}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-text-light">Contact</span>
            <input
              className={`${inputClass} mt-1`}
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-text-light">Email</span>
            <input
              type="email"
              className={`${inputClass} mt-1`}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-text-light">Location</span>
            <input
              className={`${inputClass} mt-1`}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-text-light">State</span>
            <select
              className={`${inputClass} mt-1`}
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            >
              <option value="">Choose state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-text-light">District</span>
            <input
              className={`${inputClass} mt-1`}
              value={form.district}
              onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-text-light">Preferred language</span>
            <select
              className={`${inputClass} mt-1`}
              value={form.preferredLanguage}
              onChange={(e) =>
                setForm((f) => ({ ...f, preferredLanguage: e.target.value }))
              }
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-alert" role="alert">{error}</p>}
        <Button className="mt-4" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save farmer details'}
        </Button>
      </Card>

      <Card>
        <h2 className="font-serif text-lg font-bold text-primary mb-4">Farm</h2>
        <label className="block mb-4">
          <span className="text-xs font-medium text-text-light">Farm name</span>
          <input
            className={`${inputClass} mt-1`}
            value={form.farmName}
            onChange={(e) => setForm((f) => ({ ...f, farmName: e.target.value }))}
          />
        </label>
        <p className="text-xs font-medium text-text-light mb-2">Your fields</p>
        <ul className="space-y-2">
          {fields.map((f) => (
            <li key={f.id}>
              <Link
                to="/app/field-details"
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 hover:bg-primary-soft/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-text-dark">{f.name}</p>
                  <p className="text-xs text-text-light">
                    {f.crop} · {f.areaAcres} acres
                  </p>
                </div>
                <ChevronRight size={16} className="text-text-light" />
              </Link>
            </li>
          ))}
        </ul>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate('/setup')}
        >
          Add another field
        </Button>
      </Card>

      <Card>
        <h2 className="font-serif text-lg font-bold text-primary mb-4">Preferences</h2>
        <ul className="space-y-3">
          {[
            {
              id: 'irr',
              label: 'Irrigation reminders',
              checked: notifyIrrigation,
              set: setNotifyIrrigation,
            },
            {
              id: 'dis',
              label: 'Crop issue alerts',
              checked: notifyDisease,
              set: setNotifyDisease,
            },
            {
              id: 'yld',
              label: 'Yield forecast updates',
              checked: notifyYield,
              set: setNotifyYield,
            },
          ].map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <span className="text-sm text-text-dark">{item.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={item.checked}
                onClick={() => item.set((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  item.checked ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    item.checked ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
        <Button className="mt-4" variant="secondary" onClick={handleSave} disabled={saving}>
          Save preferences
        </Button>
      </Card>

      <Card>
        <h2 className="font-serif text-lg font-bold text-primary mb-4">Account</h2>
        <Button variant="danger" onClick={handleLogout}>
          <LogOut size={16} />
          Log out
        </Button>
      </Card>
    </div>
  );
}
