import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDistills } from '../../hooks/useDistills';
import { getGreeting } from '../../utils/formatDate';
import DropZone from './DropZone';
import RecentDistills from './RecentDistills';
import StatsCards from './StatsCards';

export default function DashboardHome() {
  const { user } = useAuth();
  const { distills, loading } = useDistills();
  const navigate = useNavigate();

  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const handleFileSelect = (file) => {
    navigate('/dashboard/new', { state: { file } });
  };

  const handleUrlSubmit = (url) => {
    navigate('/dashboard/new', { state: { url } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 relative"
    >
      {/* Subtle background glow */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[300px] bg-indigo-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-[300px] h-[250px] bg-violet-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <h1 className="font-heading font-bold text-3xl text-white mb-1">
          {getGreeting()}, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-zinc-400 text-sm flex items-center gap-1.5">
          <Sparkles size={13} className="text-indigo-400/60" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="relative">
        <h2 className="font-heading font-semibold text-lg text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-indigo-500" />
          New Distill
        </h2>
        <DropZone onFileSelect={handleFileSelect} onUrlSubmit={handleUrlSubmit} />
      </div>

      {!loading && <RecentDistills distills={distills} />}

      <StatsCards />
    </motion.div>
  );
}
