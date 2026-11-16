import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getError } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { ErrorBanner, Field, PageHeader } from '../../components/UI.jsx';

export default function AddDoctor() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) {
      e.name = 'Enter the doctor name.';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = 'Enter a valid email.';
    }
    if (form.password.length < 6) {
      e.password = 'Use at least 6 characters.';
    }
    if (!form.specialization.trim()) {
      e.specialization = 'Enter a specialization.';
    }
    if (form.experience === '' || Number(form.experience) < 0) {
      e.experience = 'Enter years of experience.';
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
      await api.post('/admin/doctors', form);
      toast.success(`${form.name} was added.`);
      navigate('/admin/users');
    } catch (err) {
      setServerError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Add a doctor" subtitle="The doctor can log in with these details right away." />
      <form onSubmit={submit} noValidate className="card space-y-5 p-6">
        <ErrorBanner message={serverError} />
        <Field label="Full name" error={errors.name}>
          <input className="input" value={form.name} onChange={set('name')} placeholder="Dr. Ahmed" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" error={errors.email}>
            <input type="email" className="input" value={form.email} onChange={set('email')} />
          </Field>
          <Field label="Temporary password" error={errors.password}>
            <input type="password" className="input" value={form.password} onChange={set('password')} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Specialization" error={errors.specialization}>
            <input
              className="input"
              value={form.specialization}
              onChange={set('specialization')}
              placeholder="Cardiologist"
            />
          </Field>
          <Field label="Experience (years)" error={errors.experience}>
            <input type="number" min="0" className="input" value={form.experience} onChange={set('experience')} />
          </Field>
        </div>
        <Field label="Phone (optional)">
          <input className="input" value={form.phone} onChange={set('phone')} />
        </Field>
        <button disabled={busy} className="btn-primary">
          {busy ? 'Adding doctor...' : 'Add doctor'}
        </button>
      </form>
    </div>
  );
}
