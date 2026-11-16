import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api, { getError } from '../services/api.js';
import { Avatar, ErrorBanner, Field, PageHeader } from '../components/UI.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    bio: user.bio || '',
    specialization: user.specialization || '',
    experience: user.experience ?? '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isDoctor = user.role === 'doctor';

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (form.name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    setBusy(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        bio: form.bio,
      };
      if (isDoctor) {
        payload.specialization = form.specialization;
        payload.experience = form.experience;
      }
      const res = await api.put('/auth/profile', payload);
      setUser(res.data.user);
      toast.success('Profile updated.');
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="My profile" subtitle="Your details as the clinic sees them." />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card flex flex-col items-center p-6 text-center">
          <Avatar name={user.name} size={72} />
          <p className="mt-3 font-extrabold">{user.name}</p>
          <p className="text-sm capitalize text-brand-700">
            {isDoctor ? user.specialization : user.role}
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Mail size={14} /> {user.email}
          </p>
          {user.phone && (
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <Phone size={14} /> {user.phone}
            </p>
          )}
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6 md:col-span-2">
          <ErrorBanner message={error} />
          <Field label="Full name">
            <input className="input" value={form.name} onChange={set('name')} />
          </Field>
          <Field label="Email (cannot be changed)">
            <input className="input bg-slate-50" value={user.email} disabled />
          </Field>
          <Field label="Phone">
            <input className="input" value={form.phone} onChange={set('phone')} />
          </Field>
          {isDoctor && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Specialization">
                <input className="input" value={form.specialization} onChange={set('specialization')} />
              </Field>
              <Field label="Experience (years)">
                <input type="number" min="0" className="input" value={form.experience} onChange={set('experience')} />
              </Field>
            </div>
          )}
          <Field label="About">
            <textarea rows={3} className="input" value={form.bio} onChange={set('bio')} />
          </Field>
          <button disabled={busy} className="btn-primary">
            {busy ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
