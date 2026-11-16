import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import DoctorCard from '../../components/DoctorCard.jsx';
import { EmptyState, ErrorBanner, Loader, PageHeader } from '../../components/UI.jsx';

export default function BrowseDoctors() {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const specs = useFetch(async () => {
    const res = await api.get('/doctors/specializations');
    return res.data.specializations;
  }, []);

  const { data, loading, error, reload } = useFetch(async () => {
    const res = await api.get('/doctors', {
      params: {
        q: debouncedQ,
        specialization,
      },
    });
    return res.data.doctors;
  }, [debouncedQ, specialization]);

  return (
    <div>
      <PageHeader title="Find a doctor" subtitle="Search by name or filter by specialization." />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search doctors by name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-56"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option value="">All specializations</option>
          {(specs.data || []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <ErrorBanner message={error} onRetry={reload} />
      {loading && <Loader />}
      {!loading && data && data.length === 0 && (
        <div className="card">
          <EmptyState title="No doctors match" text="Try a different name or clear the specialization filter." />
        </div>
      )}
      {data && data.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((d) => (
            <DoctorCard key={d._id} doctor={d} />
          ))}
        </div>
      )}
    </div>
  );
}
