import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { getError } from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import { useToast } from '../../context/ToastContext.jsx';
import { ErrorBanner, Field, Loader, PageHeader } from '../../components/UI.jsx';
import { TIME_SLOTS, formatTime, todayString } from '../../utils/format.js';

export default function BookAppointment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    doctor: params.get('doctor') || '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const { data: doctors, loading, error } = useFetch(async () => {
    const res = await api.get('/doctors');
    return res.data.doctors;
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const selected = (doctors || []).find((d) => d._id === form.doctor);

  const validate = () => {
    const e = {};
    if (!form.doctor) {
      e.doctor = 'Choose a doctor.';
    }
    if (!form.appointmentDate) {
      e.appointmentDate = 'Choose a date.';
    } else if (form.appointmentDate < todayString()) {
      e.appointmentDate = 'The date cannot be in the past.';
    }
    if (!form.appointmentTime) {
      e.appointmentTime = 'Choose a time.';
    }
    if (form.reason.trim().length < 3) {
      e.reason = 'Tell the doctor why you are visiting.';
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
      await api.post('/appointments', form);
      toast.success('Appointment requested. The doctor will review it.');
      navigate('/patient/appointments');
    } catch (err) {
      setServerError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Book an appointment" subtitle="Your doctor will approve or reject the request." />
      {loading && <Loader />}
      <ErrorBanner message={error} />
      {doctors && (
        <form onSubmit={submit} noValidate className="card space-y-5 p-6">
          <ErrorBanner message={serverError} />
          <Field label="Doctor" error={errors.doctor}>
            <select className="input" value={form.doctor} onChange={set('doctor')}>
              <option value="">Select a doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} - {d.specialization}
                </option>
              ))}
            </select>
          </Field>
          {selected && (
            <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
              {selected.name} is a {selected.specialization} with {selected.experience} years of experience.
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date" error={errors.appointmentDate}>
              <input
                type="date"
                min={todayString()}
                className="input"
                value={form.appointmentDate}
                onChange={set('appointmentDate')}
              />
            </Field>
            <Field label="Time" error={errors.appointmentTime}>
              <select className="input" value={form.appointmentTime} onChange={set('appointmentTime')}>
                <option value="">Select a time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {formatTime(t)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Reason for visit" error={errors.reason}>
            <textarea
              rows={4}
              className="input"
              value={form.reason}
              onChange={set('reason')}
              placeholder="Briefly describe your symptoms or the purpose of the visit"
            />
          </Field>
          <button disabled={busy} className="btn-primary">
            {busy ? 'Sending request...' : 'Request appointment'}
          </button>
        </form>
      )}
    </div>
  );
}
