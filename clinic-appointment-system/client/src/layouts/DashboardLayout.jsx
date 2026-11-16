import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  CalendarPlus,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Stethoscope,
  UserPlus,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar } from '../components/UI.jsx';

const NAV = {
  patient: [
    { to: '/patient', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/patient/doctors', label: 'Find doctors', icon: Stethoscope },
    { to: '/patient/book', label: 'Book appointment', icon: CalendarPlus },
    { to: '/patient/appointments', label: 'My appointments', icon: CalendarCheck },
    { to: '/patient/profile', label: 'Profile', icon: UserRound },
  ],
  doctor: [
    { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/doctor/requests', label: 'Appointment requests', icon: ClipboardList },
    { to: '/doctor/profile', label: 'Profile', icon: UserRound },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Manage users', icon: Users },
    { to: '/admin/doctors/new', label: 'Add doctor', icon: UserPlus },
    { to: '/admin/appointments', label: 'All appointments', icon: CalendarCheck },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = NAV[user.role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="rounded-xl bg-brand-600 p-2 text-white">
          <HeartPulse size={20} />
        </div>
        <span className="text-lg font-extrabold">Carewell</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'
              }`
            }
          >
            <l.icon size={18} />
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-xl bg-mist p-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={user.name} size={36} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{user.name}</p>
            <p className="truncate text-xs capitalize text-slate-500">{user.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-ghost mt-3 w-full">
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-100 bg-white lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 bg-white">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 text-slate-500"
            >
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur sm:px-8">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <p className="hidden text-sm text-slate-500 lg:block">
            Signed in as <span className="font-bold text-ink capitalize">{user.role}</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <Avatar name={user.name} size={38} />
          </div>
        </header>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
