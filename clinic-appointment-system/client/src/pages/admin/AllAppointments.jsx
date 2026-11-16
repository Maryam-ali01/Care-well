import { useState } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import AppointmentTable from '../../components/AppointmentTable.jsx';
import { EmptyState, ErrorBanner, Loader, PageHeader } from '../../components/UI.jsx';

export default function AllAppointments() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  const { data, loading, error, reload } = useFetch(async () => {
    const res = await api.get('/admin/appointments');
    return res.data.appointments;
  }, []);

  const rows = (data || []).filter((a) => {
    const text = `${a.patient?.name || ''} ${a.doctor?.name || ''}`.toLowerCase();
    const matchText = text.includes(q.toLowerCase());
    const matchStatus = !status || a.status === status;
    return matchText && matchStatus;
  });

  return (
    <div>
      <PageHeader title="All appointments" subtitle="Every booking across the clinic." />
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search by patient or doctor name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <ErrorBanner message={error} onRetry={reload} />
      {loading && <Loader />}
      {data && (
        <div className="card">
          {rows.length === 0 ? (
            <EmptyState title="No appointments found" text="Nothing matches the current filters." />
          ) : (
            <AppointmentTable rows={rows} role="admin" />
          )}
        </div>
      )}
    </div>
  );
}
