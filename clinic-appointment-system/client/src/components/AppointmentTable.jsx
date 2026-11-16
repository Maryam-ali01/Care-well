import { Link } from 'react-router-dom';
import { Check, Eye, X } from 'lucide-react';
import { Avatar, StatusBadge } from './UI.jsx';
import { formatDate, formatTime } from '../utils/format.js';

// role: 'patient' | 'doctor' | 'admin' decides which people columns show and which actions appear.
export default function AppointmentTable({ rows, role, onApprove, onReject, onCancel, busyId }) {
  const showDoctor = role === 'patient' || role === 'admin';
  const showPatient = role === 'doctor' || role === 'admin';

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead className="border-b border-slate-100">
          <tr>
            {showPatient && <th className="th">Patient</th>}
            {showDoctor && <th className="th">Doctor</th>}
            <th className="th">Date</th>
            <th className="th">Time</th>
            <th className="th">Reason</th>
            <th className="th">Status</th>
            <th className="th text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((a) => (
            <tr key={a._id} className="hover:bg-slate-50/60">
              {showPatient && (
                <td className="td">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={a.patient?.name} size={34} />
                    <div>
                      <p className="font-semibold">{a.patient?.name || 'Deleted user'}</p>
                      <p className="text-xs text-slate-500">{a.patient?.email}</p>
                    </div>
                  </div>
                </td>
              )}
              {showDoctor && (
                <td className="td">
                  <p className="font-semibold">{a.doctor?.name || 'Deleted user'}</p>
                  <p className="text-xs text-slate-500">{a.doctor?.specialization}</p>
                </td>
              )}
              <td className="td whitespace-nowrap">{formatDate(a.appointmentDate)}</td>
              <td className="td whitespace-nowrap">{formatTime(a.appointmentTime)}</td>
              <td className="td max-w-[220px] truncate" title={a.reason}>
                {a.reason}
              </td>
              <td className="td">
                <StatusBadge status={a.status} />
              </td>
              <td className="td">
                <div className="flex justify-end gap-1.5">
                  <Link
                    to={`/${role}/appointments/${a._id}`}
                    className="btn-ghost btn-sm"
                    aria-label="View details"
                  >
                    <Eye size={14} />
                    Details
                  </Link>
                  {role === 'doctor' && a.status === 'pending' && (
                    <>
                      <button
                        disabled={busyId === a._id}
                        onClick={() => onApprove(a)}
                        className="btn-primary btn-sm"
                      >
                        <Check size={14} />
                        Approve
                      </button>
                      <button
                        disabled={busyId === a._id}
                        onClick={() => onReject(a)}
                        className="btn-danger btn-sm"
                      >
                        <X size={14} />
                        Reject
                      </button>
                    </>
                  )}
                  {role === 'patient' && a.status === 'pending' && onCancel && (
                    <button onClick={() => onCancel(a)} className="btn-danger btn-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
