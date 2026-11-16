import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api, { getError } from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import { Avatar, ConfirmDialog, ErrorBanner, Loader, StatusBadge } from '../components/UI.jsx';
import { formatDate, formatTime } from '../utils/format.js';

export default function AppointmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);

  const { data: appointment, loading, error, setData } = useFetch(async () => {
    const res = await api.get(`/appointments/${id}`);
    return res.data.appointment;
  }, [id]);

  const back =
    user.role === 'doctor'
      ? '/doctor/requests'
      : user.role === 'admin'
      ? '/admin/appointments'
      : '/patient/appointments';

  const act = async (request, okMessage) => {
    setBusy(true);
    try {
      const res = await request();
      setData(res.data.appointment);
      toast.success(okMessage);
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setBusy(false);
      setConfirmCancel(false);
    }
  };

  const decide = (status) =>
    act(() => api.patch(`/appointments/${id}/status`, { status }), `Appointment ${status}.`);

  const cancel = () => act(() => api.patch(`/appointments/${id}/cancel`), 'Appointment cancelled.');

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={back} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        <ArrowLeft size={16} /> Back to appointments
      </Link>
      {loading && <Loader />}
      <ErrorBanner message={error} />
      {appointment && (
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold">Appointment details</h1>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-mist p-4">
              <p className="text-xs font-semibold text-slate-500">Patient</p>
              <div className="mt-2 flex items-center gap-3">
                <Avatar name={appointment.patient?.name} />
                <div>
                  <p className="font-bold">{appointment.patient?.name || 'Deleted user'}</p>
                  <p className="text-xs text-slate-500">{appointment.patient?.email}</p>
                  {appointment.patient?.phone && (
                    <p className="text-xs text-slate-500">{appointment.patient.phone}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-mist p-4">
              <p className="text-xs font-semibold text-slate-500">Doctor</p>
              <div className="mt-2 flex items-center gap-3">
                <Avatar name={appointment.doctor?.name} />
                <div>
                  <p className="font-bold">{appointment.doctor?.name || 'Deleted user'}</p>
                  <p className="text-xs text-slate-500">
                    {appointment.doctor?.specialization} - {appointment.doctor?.experience} yrs
                  </p>
                </div>
              </div>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-slate-500">Date</dt>
              <dd className="font-bold">{formatDate(appointment.appointmentDate)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">Time</dt>
              <dd className="font-bold">{formatTime(appointment.appointmentTime)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-slate-500">Reason for visit</dt>
              <dd className="mt-1 rounded-xl bg-mist p-3 text-sm">{appointment.reason}</dd>
            </div>
          </dl>

          {user.role === 'doctor' && appointment.status === 'pending' && (
            <div className="mt-6 flex gap-2">
              <button disabled={busy} onClick={() => decide('approved')} className="btn-primary">
                <Check size={16} /> Approve
              </button>
              <button disabled={busy} onClick={() => decide('rejected')} className="btn-danger">
                <X size={16} /> Reject
              </button>
            </div>
          )}
          {user.role === 'patient' && appointment.status === 'pending' && (
            <div className="mt-6">
              <button onClick={() => setConfirmCancel(true)} className="btn-danger">
                Cancel appointment
              </button>
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={confirmCancel}
        danger
        busy={busy}
        title="Cancel this appointment?"
        message="The doctor will no longer see this request."
        confirmLabel="Cancel appointment"
        onConfirm={cancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
}
