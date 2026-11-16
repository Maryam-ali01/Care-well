import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CalendarClock, CalendarX2, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import useGsapIn from '../../hooks/useGsapIn.js';
import AppointmentTable from '../../components/AppointmentTable.jsx';
import DoctorCard from '../../components/DoctorCard.jsx';
import { EmptyState, ErrorBanner, Loader, PageHeader, StatCard } from '../../components/UI.jsx';

export default function PatientDashboard() {
  const { user } = useAuth();
  const ref = useRef(null);
  const { data, loading, error, reload } = useFetch(async () => {
    const [appts, docs] = await Promise.all([api.get('/appointments/my'), api.get('/doctors')]);
    return {
      appointments: appts.data.appointments,
      doctors: docs.data.doctors,
    };
  }, []);
  useGsapIn(ref, !loading && !!data);

  const appointments = data?.appointments || [];
  const count = (s) => appointments.filter((a) => a.status === s).length;

  return (
    <div ref={ref}>
      <PageHeader
        title={`Hello, ${user.name.split(' ')[0]}`}
        subtitle="Here is where your appointments stand."
        action={
          <Link to="/patient/book" className="btn-primary">
            Book appointment
          </Link>
        }
      />
      <ErrorBanner message={error} onRetry={reload} />
      {loading && <Loader />}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={ClipboardList} label="Total appointments" value={appointments.length} />
            <StatCard icon={CalendarClock} label="Pending" value={count('pending')} tone="amber" />
            <StatCard icon={CalendarCheck} label="Approved" value={count('approved')} tone="green" />
            <StatCard
              icon={CalendarX2}
              label="Rejected or cancelled"
              value={count('rejected') + count('cancelled')}
              tone="slate"
            />
          </div>

          <section className="card mt-8">
            <div className="flex items-center justify-between p-5">
              <h2 className="font-extrabold">Recent appointments</h2>
              <Link to="/patient/appointments" className="text-sm font-semibold text-brand-700">
                View all
              </Link>
            </div>
            {appointments.length === 0 ? (
              <EmptyState
                title="No appointments yet"
                text="Find a doctor and request your first visit."
                actionLabel="Find a doctor"
                actionTo="/patient/doctors"
              />
            ) : (
              <AppointmentTable rows={appointments.slice(0, 5)} role="patient" />
            )}
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-extrabold">Doctors you can book</h2>
              <Link to="/patient/doctors" className="text-sm font-semibold text-brand-700">
                Browse all
              </Link>
            </div>
            {data.doctors.length === 0 ? (
              <div className="card">
                <EmptyState title="No doctors available" text="The admin has not added any doctors yet." />
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.doctors.slice(0, 3).map((d) => (
                  <DoctorCard key={d._id} doctor={d} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
