import { useState } from 'react';
import { Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import api, { getError } from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import AppointmentTable from '../../components/AppointmentTable.jsx';
import { EmptyState, ErrorBanner, Loader, PageHeader } from '../../components/UI.jsx';

const TABS = ['all', 'pending', 'approved', 'rejected', 'cancelled'];

export default function AppointmentRequests() {
  const toast = useToast();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState('');

  const { data, loading, error, reload } = useFetch(async () => {
    const res = await api.get('/appointments/doctor');
    return res.data.appointments;
  }, []);

  const rows = (data || []).filter((a) => {
    const matchTab = tab === 'all' || a.status === tab;
    const matchText = (a.patient?.name || '').toLowerCase().includes(q.toLowerCase());
    return matchTab && matchText;
  });

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
    <div>
      <PageHeader title="Appointment requests" subtitle="Only requests assigned to you are shown." />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                tab === t ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search by patient name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      <ErrorBanner message={error} onRetry={reload} />
      {loading && <Loader />}
      {data && (
        <div className="card">
          {rows.length === 0 ? (
            <EmptyState title="No appointments found" text="Try another status or search term." />
          ) : (
            <AppointmentTable
              rows={rows}
              role="doctor"
              busyId={busyId}
              onApprove={(a) => decide(a, 'approved')}
              onReject={(a) => decide(a, 'rejected')}
            />
          )}
        </div>
      )}
    </div>
  );
}
