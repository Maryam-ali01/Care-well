import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Power, Search, Trash2, UserPlus } from 'lucide-react';
import api, { getError } from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Avatar, ConfirmDialog, EmptyState, ErrorBanner, Loader, PageHeader } from '../../components/UI.jsx';
import { formatDate } from '../../utils/format.js';

export default function ManageUsers() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data, loading, error, reload } = useFetch(async () => {
    const res = await api.get('/admin/users', {
      params: {
        q: debouncedQ,
        role,
        status,
      },
    });
    return res.data.users;
  }, [debouncedQ, role, status]);

  const toggle = async (user) => {
    try {
      const res = await api.patch(`/admin/users/${user._id}/status`);
      toast.success(`${user.name} is now ${res.data.user.isActive ? 'active' : 'deactivated'}.`);
      reload();
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      const res = await api.delete(`/admin/users/${target._id}`);
      toast.success(res.data.message);
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
      <PageHeader
        title="Manage users"
        subtitle="Search, activate, deactivate or delete accounts."
        action={
          <Link to="/admin/doctors/new" className="btn-primary">
            <UserPlus size={16} /> Add doctor
          </Link>
        }
      />
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="admin">Admins</option>
        </select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Deactivated</option>
        </select>
      </div>
      <ErrorBanner message={error} onRetry={reload} />
      {loading && <Loader />}
      {data && (
        <div className="card">
          {data.length === 0 ? (
            <EmptyState title="No users found" text="Change the search or filters." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="border-b border-slate-100">
                  <tr>
                    <th className="th">User</th>
                    <th className="th">Role</th>
                    <th className="th">Details</th>
                    <th className="th">Joined</th>
                    <th className="th">Status</th>
                    <th className="th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((u) => (
                    <tr key={u._id}>
                      <td className="td">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={u.name} size={34} />
                          <div>
                            <p className="font-semibold">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td capitalize">{u.role}</td>
                      <td className="td text-slate-500">
                        {u.role === 'doctor' ? `${u.specialization}, ${u.experience} yrs` : '-'}
                      </td>
                      <td className="td whitespace-nowrap">{formatDate(u.createdAt)}</td>
                      <td className="td">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                              : 'bg-slate-100 text-slate-600 ring-slate-200'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="td">
                        {u.role === 'admin' ? (
                          <p className="text-right text-xs text-slate-400">Protected</p>
                        ) : (
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => toggle(u)} className="btn-ghost btn-sm">
                              <Power size={14} />
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => setTarget(u)} className="btn-danger btn-sm">
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={!!target}
        danger
        busy={busy}
        title={`Delete ${target?.name}?`}
        message="This removes the account and all of its appointments. It cannot be undone."
        confirmLabel="Delete user"
        onConfirm={remove}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
