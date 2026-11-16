import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CalendarClock, CalendarX2, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import api, { getError } from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import useGsapIn from '../../hooks/useGsapIn.js';
import AppointmentTable from '../../components/AppointmentTable.jsx';
import { EmptyState, ErrorBanner, Loader, PageHeader, StatCard } from '../../components/UI.jsx';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const ref = useRef(null);
  const [busyId, setBusyId] = useState('');

  const { data, loading, error, reload } = useFetch(async () => {
    const res = await api.get('/appointments/doctor');
    return res.data.appointments;
  }, []);
  useGsapIn(ref, !loading && !!data);

  const list = data || [];
  const count = (s) => list.filter((a) => a.status === s).length;
  const pending = list.filter((a) => a.status === 'pending');

  const decide = async (appointment, status) => {
    setBusyId(appointment._id);
    try {
      await api.patch(`/appointments/${appointment._id}/status`, { status });
      toast.success(`Appointment ${status}.`);
      reload();
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setBusyId('');
    }
  };

  return (
    <div ref={ref}>
      <PageHeader
        title={`Good day, ${user.name}`}
        subtitle={`${user.specialization || 'Doctor'} - ${user.experience ?? 0} years of experience`}
        action={
          <Link to="/doctor/requests" className="btn-primary">
            All requests
          </Link>
        }
      />
      <ErrorBanner message={error} onRetry={reload} />
      {loading && <Loader />}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={ClipboardList} label="Total appointments" value={list.length} />
            <StatCard icon={CalendarClock} label="Pending" value={count('pending')} tone="amber" />
            <StatCard icon={CalendarCheck} label="Approved" value={count('approved')} tone="green" />
            <StatCard icon={CalendarX2} label="Rejected" value={count('rejected')} tone="red" />
          </div>

          <section className="card mt-8">
            <h2 className="p-5 font-extrabold">Waiting for your decision</h2>
            {pending.length === 0 ? (
              <EmptyState title="Nothing pending" text="New patient requests will show up here." />
            ) : (
              <AppointmentTable
                rows={pending}
                role="doctor"
                busyId={busyId}
                onApprove={(a) => decide(a, 'approved')}
                onReject={(a) => decide(a, 'rejected')}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
