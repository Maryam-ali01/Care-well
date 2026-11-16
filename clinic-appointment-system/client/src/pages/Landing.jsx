import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  Ear,
  Eye,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Pill,
  Search,
  Stethoscope,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import useFetch from '../hooks/useFetch.js';
import useGsapIn from '../hooks/useGsapIn.js';
import DoctorCard from '../components/DoctorCard.jsx';
import { Avatar, EmptyState, Loader, StatusBadge } from '../components/UI.jsx';
import { roleHome } from '../utils/format.js';

const SPECIALTIES = [
  { name: 'Cardiology', icon: HeartPulse },
  { name: 'Neurology', icon: Brain },
  { name: 'Pediatrics', icon: Baby },
  { name: 'Orthopedics', icon: Bone },
  { name: 'General medicine', icon: Stethoscope },
  { name: 'ENT', icon: Ear },
  { name: 'Eye care', icon: Eye },
  { name: 'Pharmacy advice', icon: Pill },
];

const STEPS = [
  { icon: UserCheck, title: 'Create a free account', text: 'Register as a patient with your name and email.' },
  { icon: Search, title: 'Find your doctor', text: 'Search by name or filter by specialization.' },
  { icon: CalendarCheck, title: 'Request a time', text: 'Pick a date, a slot, and tell the doctor why you are visiting.' },
  { icon: HeartPulse, title: 'Get the answer', text: 'The doctor approves or declines, and you see it on your dashboard.' },
];

export default function Landing() {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { data, loading } = useFetch(async () => {
    const res = await api.get('/doctors/featured');
    return res.data.doctors;
  }, []);
  useGsapIn(heroRef, true);

  const cta = user ? roleHome[user.role] : '/register';

  return (
    <div className="bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="rounded-xl bg-brand-600 p-1.5 text-white">
              <HeartPulse size={20} />
            </span>
            Carewell
          </Link>
          <nav className="hidden gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#about" className="hover:text-brand-700">About</a>
            <a href="#doctors" className="hover:text-brand-700">Doctors</a>
            <a href="#specializations" className="hover:text-brand-700">Specializations</a>
            <a href="#how" className="hover:text-brand-700">How it works</a>
            <a href="#contact" className="hover:text-brand-700">Contact</a>
          </nav>
          <div className="flex gap-2">
            {user ? (
              <Link to={roleHome[user.role]} className="btn-primary">Open dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary hidden sm:inline-flex">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section ref={heroRef} className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 data-anim className="text-4xl font-extrabold leading-tight sm:text-5xl">
              See the right doctor without the phone queue.
            </h1>
            <p data-anim className="mt-5 max-w-lg text-lg text-slate-600">
              Request an appointment online, and know whether your doctor approved it before you leave home.
            </p>
            <div data-anim className="mt-8 flex flex-wrap gap-3">
              <Link to={cta} className="btn-primary px-6 py-3 text-base">
                Book an appointment
              </Link>
              <a href="#how" className="btn-ghost px-6 py-3 text-base">
                See how it works
              </a>
            </div>
          </div>

          <div data-anim className="card p-6">
            <p className="font-bold">What happens after you request a visit</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-mist p-4">
                <div className="flex items-center gap-3">
                  <Avatar name="You" />
                  <p className="text-sm font-semibold">You send a request</p>
                </div>
                <StatusBadge status="pending" />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-mist p-4">
                <div className="flex items-center gap-3">
                  <Avatar name="Dr Doctor" />
                  <p className="text-sm font-semibold">Your doctor reviews it</p>
                </div>
                <StatusBadge status="approved" />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-mist p-4">
                <div className="flex items-center gap-3">
                  <Avatar name="Cl Inic" />
                  <p className="text-sm font-semibold">You see the decision</p>
                </div>
                <StatusBadge status="rejected" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              A request ends as approved or rejected. You can cancel while it is still pending.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold">A clinic system built around three people</h2>
            <p className="mt-4 text-slate-600">
              Carewell gives patients, doctors, and clinic admins each their own workspace, so everyone sees only what
              they need and nothing else.
            </p>
          </div>
          <div className="space-y-4">
            <div className="card p-5">
              <p className="font-bold">Patients</p>
              <p className="mt-1 text-sm text-slate-600">Find a doctor, request a slot, and follow the status.</p>
            </div>
            <div className="card p-5">
              <p className="font-bold">Doctors</p>
              <p className="mt-1 text-sm text-slate-600">Review requests assigned to you and approve or reject them.</p>
            </div>
            <div className="card p-5">
              <p className="font-bold">Admins</p>
              <p className="mt-1 text-sm text-slate-600">Add doctors, manage accounts, and watch every appointment.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="doctors" className="bg-mist py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-extrabold">Doctors at the clinic</h2>
          <p className="mt-2 text-slate-600">Our most experienced doctors, available for booking.</p>
          <div className="mt-8">
            {loading && <Loader />}
            {!loading && (!data || data.length === 0) && (
              <div className="card">
                <EmptyState title="No doctors listed yet" text="Doctors added by the clinic admin will appear here." />
              </div>
            )}
            {!loading && data && data.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((d) => (
                  <div key={d._id} className="card flex flex-col p-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={d.name} size={48} />
                      <div>
                        <p className="font-bold">{d.name}</p>
                        <p className="text-sm text-brand-700">{d.specialization}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">{d.experience} years of experience</p>
                    <Link to={cta} className="btn-primary mt-5">Book with {d.name.split(' ')[0] === 'Dr.' ? d.name.split(' ')[1] : d.name.split(' ')[0]}</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="specializations" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-extrabold">Medical specializations</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {SPECIALTIES.map((s) => (
            <Link
              to={cta}
              key={s.name}
              className="card flex flex-col items-start gap-3 p-5 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-brand-200"
            >
              <span className="rounded-xl bg-brand-50 p-2.5 text-brand-700">
                <s.icon size={20} />
              </span>
              <span className="font-bold">{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how" className="bg-brand-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-extrabold">How it works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl bg-white/5 p-5">
                <span className="text-sm font-bold text-brand-200">Step {i + 1}</span>
                <s.icon className="mt-3 text-brand-200" />
                <p className="mt-3 font-bold">{s.title}</p>
                <p className="mt-1 text-sm text-brand-100">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-extrabold">Contact the clinic</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="card flex items-start gap-3 p-5">
            <MapPin className="mt-0.5 text-brand-600" />
            <div>
              <p className="font-bold">Visit</p>
              <p className="text-sm text-slate-600">Main Clinic Road, Karachi, Pakistan</p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-5">
            <Phone className="mt-0.5 text-brand-600" />
            <div>
              <p className="font-bold">Call</p>
              <p className="text-sm text-slate-600">+92 21 0000 0000</p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-5">
            <Mail className="mt-0.5 text-brand-600" />
            <div>
              <p className="font-bold">Email</p>
              <a href="mailto:hello@carewell.example" className="text-sm text-brand-700 underline">
                hello@carewell.example
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-sm text-slate-500">
          <span className="flex items-center gap-2 font-bold text-ink">
            <HeartPulse size={18} className="text-brand-600" /> Carewell
          </span>
          <span>Clinic Appointment Management System</span>
        </div>
      </footer>
    </div>
  );
}
