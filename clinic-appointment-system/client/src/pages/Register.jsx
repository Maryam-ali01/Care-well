import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getError } from '../services/api.js';
import { ErrorBanner, Field } from '../components/UI.jsx';
import { roleHome } from '../utils/format.js';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) {
      e.name = 'Enter your full name.';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = 'Enter a valid email address.';
    }
    if (form.password.length < 6) {
      e.password = 'Use at least 6 characters.';
    }
    if (form.confirm !== form.password) {
      e.confirm = 'Passwords do not match.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) {
      return;
    }
    setBusy(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate('/patient');
    } catch (err) {
      setServerError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-800 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
          <HeartPulse /> Carewell
        </Link>
        <div>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight">
            Book a doctor without the waiting-room phone call.
          </h2>
          <p className="mt-4 max-w-md text-brand-100">
            Create a patient account, pick a doctor, choose a time, and track the answer.
          </p>
        </div>
        <p className="text-sm text-brand-200">Patient accounts are free.</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">It takes under a minute.</p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            <ErrorBanner message={serverError} />
            <Field label="Full name" error={errors.name}>
              <input className="input" value={form.name} onChange={set('name')} placeholder="Maryam Khan" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" className="input" value={form.email} onChange={set('email')} placeholder="you@example.com" />
            </Field>
            <Field label="Phone (optional)">
              <input className="input" value={form.phone} onChange={set('phone')} placeholder="0300 1234567" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Password" error={errors.password}>
                <input type="password" className="input" value={form.password} onChange={set('password')} />
              </Field>
              <Field label="Confirm password" error={errors.confirm}>
                <input type="password" className="input" value={form.confirm} onChange={set('confirm')} />
              </Field>
            </div>
            <button disabled={busy} className="btn-primary w-full">
              {busy ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
