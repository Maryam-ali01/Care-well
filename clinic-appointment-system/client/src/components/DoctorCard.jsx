import { Link } from 'react-router-dom';
import { Award, Stethoscope } from 'lucide-react';
import { Avatar } from './UI.jsx';

export default function DoctorCard({ doctor, showBook = true }) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-center gap-3">
        <Avatar name={doctor.name} size={48} />
        <div className="min-w-0">
          <p className="truncate font-bold">{doctor.name}</p>
          <p className="flex items-center gap-1 text-sm text-brand-700">
            <Stethoscope size={14} />
            {doctor.specialization}
          </p>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
        <Award size={15} />
        {doctor.experience} {doctor.experience === 1 ? 'year' : 'years'} of experience
      </p>
      {showBook && (
        <div className="mt-5 flex gap-2">
          <Link to={`/patient/doctors/${doctor._id}`} className="btn-ghost flex-1">
            View profile
          </Link>
          <Link to={`/patient/book?doctor=${doctor._id}`} className="btn-primary flex-1">
            Book
          </Link>
        </div>
      )}
    </div>
  );
}
