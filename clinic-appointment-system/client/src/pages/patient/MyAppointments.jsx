import { useState } from 'react';
import { Search } from 'lucide-react';
import api, { getError } from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import { useToast } from '../../context/ToastContext.jsx';
import AppointmentTable from '../../components/AppointmentTable.jsx';
import { ConfirmDialog, EmptyState, ErrorBanner, Loader, PageHeader } from '../../components/UI.jsx';

const TABS = ['all', 'pending', 'approved', 'rejected', 'cancelled'];

export default function MyAppointments() {
  const toast = useToast();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const { data, loading, error, reload } = useFetch(async () => {
    const res = await api.get('/appointments/my');
    return res.data.appointments;
  }, []);

  const rows = (data || []).filter((a) => {
    const matchTab = tab === 'all' || a.status === tab;
    const matchText = (a.doctor?.name || '').toLowerCase().includes(q.toLowerCase());
    return matchTab && matchText;
  });

  const cancel = async () => {
    setBusy(true);
    try {
      await api.patch(`/appointments/${target._id}/cancel`);
      toast.success('Appointment cancelled.');
      setTarget(null);
      reload();
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="My appointments" subtitle="Only you can see these." />
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
            placeholder="Search by doctor name"
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
            <EmptyState
              title="No appointments found"
              text={data.length === 0 ? 'Book your first visit with a doctor.' : 'Try another status or search.'}
              actionLabel={data.length === 0 ? 'Find a doctor' : undefined}
              actionTo={data.length === 0 ? '/patient/doctors' : undefined}
            />
          ) : (
            <AppointmentTable rows={rows} role="patient" onCancel={setTarget} />
          )}
        </div>
      )}
      <ConfirmDialog
        open={!!target}
        danger
        busy={busy}
        title="Cancel this appointment?"
        message={target ? `Your request with ${target.doctor?.name} will be cancelled.` : ''}
        confirmLabel="Cancel appointment"
        onConfirm={cancel}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
