import { Link } from 'react-router-dom';
import { AlertCircle, Inbox, Loader2, X } from 'lucide-react';

export function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
      <Loader2 className="animate-spin" size={18} />
      {label}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) {
    return null;
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
      <span className="flex items-center gap-2">
        <AlertCircle size={16} />
        {message}
      </span>
      {onRetry && (
        <button onClick={onRetry} className="font-semibold underline">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <div className="mb-3 rounded-full bg-brand-50 p-3 text-brand-600">
        <Inbox size={22} />
      </div>
      <p className="font-bold">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
      {actionTo && (
        <Link to={actionTo} className="btn-primary mt-4">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export function StatCard({ icon: Icon, label, value, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-600',
  };
  return (
    <div data-anim className="card flex items-center gap-4 p-5">
      <div className={`rounded-xl p-3 ${tones[tone]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Avatar({ name = '?', size = 40 }) {
  const initials = name
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800"
    >
      {initials}
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger, busy, onConfirm, onCancel }) {
  if (!open) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div role="dialog" aria-modal="true" className="card w-full max-w-md p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-extrabold">{title}</h3>
          <button onClick={onCancel} aria-label="Close" className="text-slate-400 hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-ghost">
            Keep it
          </button>
          <button onClick={onConfirm} disabled={busy} className={danger ? 'btn-danger' : 'btn-primary'}>
            {busy ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
