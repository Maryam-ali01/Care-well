import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getError } from '../services/api.js';
import { ErrorBanner, Field } from '../components/UI.jsx';
import { roleHome } from '../utils/format.js';

const DEMOS = [
  { label: 'Admin', email: 'admin@clinic.com', password: 'Admin123!' },
  { label: 'Doctor', email: 'doctor@clinic.com', password: 'Doctor123!' },
  { label: 'Patient', email: 'patient@clinic.com', password: 'Patient123!' },
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      e.password = 'Enter your password.';
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
      const u = await login(form.email, form.password);
      navigate(roleHome[u.role]);
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
            Your clinic schedule, in one calm place.
          </h2>
          <p className="mt-4 max-w-md text-brand-100">
            Patients request, doctors decide, admins keep watch. Sign in to continue.
          </p>
        </div>
        <p className="text-sm text-brand-200">Carewell Clinic Appointment Management</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to manage your appointments.</p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            <ErrorBanner message={serverError} />
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password" error={errors.password}>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
              />
            </Field>
            <button disabled={busy} className="btn-primary w-full">
              {busy ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New patient?{' '}
            <Link to="/register" className="font-bold text-brand-700">
              Create an account
            </Link>
          </p>

          <div className="mt-8 rounded-xl bg-white p-4 shadow-soft">
            <p className="text-xs font-semibold text-slate-500">Demo accounts (click to fill)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEMOS.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => setForm({ email: d.email, password: d.password })}
                  className="btn-ghost btn-sm"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
