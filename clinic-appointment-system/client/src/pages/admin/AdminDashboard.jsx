import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ClipboardList, Stethoscope, Users } from 'lucide-react';
import api from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import useGsapIn from '../../hooks/useGsapIn.js';
import { EmptyState, ErrorBanner, Loader, PageHeader, StatCard, StatusBadge } from '../../components/UI.jsx';
import { formatDate } from '../../utils/format.js';

const BAR = {
  pending: 'bg-amber-400',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-400',
  cancelled: 'bg-slate-400',
};

export default function AdminDashboard() {
  const ref = useRef(null);
  const { data, loading, error, reload } = useFetch(async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  }, []);
  useGsapIn(ref, !loading && !!data);

  return (
    <div ref={ref}>
      <PageHeader
        title="Clinic overview"
        subtitle="Live numbers from the database."
        action={
          <Link to="/admin/doctors/new" className="btn-primary">
            Add doctor
          </Link>
        }
      />
      <ErrorBanner message={error} onRetry={reload} />
      {loading && <Loader />}
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} label="Registered patients" value={data.totalPatients} />
            <StatCard icon={Stethoscope} label="Registered doctors" value={data.totalDoctors} tone="green" />
            <StatCard icon={ClipboardList} label="Total appointments" value={data.totalAppointments} tone="slate" />
            <StatCard icon={CalendarClock} label="Pending requests" value={data.byStatus.pending} tone="amber" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <section className="card p-5">
              <h2 className="font-extrabold">Appointments by status</h2>
              <div className="mt-5 space-y-4">
                {Object.entries(data.byStatus).map(([status, n]) => (
                  <div key={status}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-semibold capitalize">{status}</span>
                      <span>{n}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${BAR[status]}`}
                        style={{ width: `${data.totalAppointments ? (n / data.totalAppointments) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card lg:col-span-2">
              <div className="flex items-center justify-between p-5">
                <h2 className="font-extrabold">Latest appointments</h2>
                <Link to="/admin/appointments" className="text-sm font-semibold text-brand-700">
                  View all
                </Link>
              </div>
              {data.recentAppointments.length === 0 ? (
                <EmptyState title="No appointments yet" text="Bookings from patients will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px]">
                    <thead className="border-b border-slate-100">
                      <tr>
                        <th className="th">Patient</th>
                        <th className="th">Doctor</th>
                        <th className="th">Date</th>
                        <th className="th">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.recentAppointments.map((a) => (
                        <tr key={a._id}>
                          <td className="td font-semibold">{a.patient?.name || 'Deleted user'}</td>
                          <td className="td">{a.doctor?.name || 'Deleted user'}</td>
                          <td className="td">{formatDate(a.appointmentDate)}</td>
                          <td className="td">
                            <StatusBadge status={a.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
