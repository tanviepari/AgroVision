import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useApp } from '../context/AppContext';
import { LANGUAGE_OPTIONS } from '../data/mockData';

const inputClass =
  'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

export default function Profile() {
  const { farmer, fields, updateFarmer, logout } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: farmer.name,
    contact: farmer.contact,
    location: farmer.location,
    preferredLanguage: farmer.preferredLanguage,
    farmName: farmer.farmName,
  });
  const [notifyIrrigation, setNotifyIrrigation] = useState(true);
  const [notifyDisease, setNotifyDisease] = useState(true);
  const [notifyYield, setNotifyYield] = useState(true);

  const handleSave = () => {
    updateFarmer(form);
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
            <span className="text-xs font-medium text-text-light">Location</span>
            <input
              className={`${inputClass} mt-1`}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
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
        <Button className="mt-4" onClick={handleSave}>
          Save farmer details
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
