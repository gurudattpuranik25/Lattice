import { Link } from 'react-router-dom';
import DistillCard from './DistillCard';

export default function RecentDistills({ distills }) {
  if (!distills.length) return null;

  const recent = distills.slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-xl text-white flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-violet-500" />
          Recent
        </h2>
        <Link to="/dashboard/library" className="text-sm text-indigo-400/70 hover:text-indigo-300 transition-colors">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {recent.map((distill, index) => (
          <DistillCard key={distill.id} distill={distill} index={index} />
        ))}
      </div>
    </div>
  );
}
