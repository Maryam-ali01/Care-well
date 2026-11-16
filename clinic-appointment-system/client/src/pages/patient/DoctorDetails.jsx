import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Award, Mail, Stethoscope } from 'lucide-react';
import api from '../../services/api.js';
import useFetch from '../../hooks/useFetch.js';
import { Avatar, ErrorBanner, Loader } from '../../components/UI.jsx';

export default function DoctorDetails() {
  const { id } = useParams();
  const { data: doctor, loading, error } = useFetch(async () => {
    const res = await api.get(`/doctors/${id}`);
    return res.data.doctor;
  }, [id]);

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/patient/doctors" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        <ArrowLeft size={16} /> Back to doctors
      </Link>
      {loading && <Loader />}
      <ErrorBanner message={error} />
      {doctor && (
        <div className="card p-8">
          <div className="flex items-center gap-4">
            <Avatar name={doctor.name} size={72} />
            <div>
              <h1 className="text-2xl font-extrabold">{doctor.name}</h1>
              <p className="flex items-center gap-1.5 text-brand-700">
                <Stethoscope size={16} /> {doctor.specialization}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-mist p-4">
              <Award className="text-brand-600" />
              <div>
                <p className="text-xs text-slate-500">Experience</p>
                <p className="font-bold">{doctor.experience} years</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-mist p-4">
              <Mail className="text-brand-600" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Contact</p>
                <p className="truncate font-bold">{doctor.email}</p>
              </div>
            </div>
          </div>
          {doctor.bio && <p className="mt-6 text-sm text-slate-600">{doctor.bio}</p>}
          <Link to={`/patient/book?doctor=${doctor._id}`} className="btn-primary mt-8">
            Book an appointment
          </Link>
        </div>
      )}
    </div>
  );
}
