import { motion } from 'framer-motion';
import { Check, ChevronDown, FileText, Youtube, FileType, Link2, FileCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const floatingBadges = [
  { label: 'PDF', color: 'bg-red-500/15 text-red-400 border-red-500/20', x: -460, y: -80, delay: 0 },
  { label: 'YouTube', color: 'bg-rose-500/15 text-rose-400 border-rose-500/20', x: 440, y: -70, delay: 0.8 },
  { label: 'DOCX', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', x: -420, y: 100, delay: 1.6 },
  { label: 'URL', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', x: 480, y: 90, delay: 0.4 },
  { label: 'TXT', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', x: -500, y: 10, delay: 1.2 },
];

const formatIcons = [
  { icon: FileText, label: 'PDF', color: 'text-red-400/50' },
  { icon: Youtube, label: 'YouTube', color: 'text-rose-400/50' },
  { icon: FileType, label: 'DOCX', color: 'text-blue-400/50' },
  { icon: Link2, label: 'URL', color: 'text-emerald-400/50' },
  { icon: FileCode, label: 'TXT', color: 'text-amber-400/50' },
];

export default function HeroSection() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      try {
        await signInWithGoogle();
        navigate('/dashboard');
      } catch (err) {
        console.error('Sign in failed:', err);
      }
    }
  };

  return (
    <section className="relative pt-28 sm:pt-40 pb-16 sm:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-violet-500/6 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Floating badges — hidden on mobile */}
        <div className="hidden lg:block">
          {floatingBadges.map((badge) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + badge.delay }}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{ marginLeft: badge.x, marginTop: badge.y }}
            >
              <div
                className={`float-badge px-3 py-1.5 rounded-full text-xs font-semibold border ${badge.color} backdrop-blur-sm`}
                style={{ animationDelay: `${badge.delay}s` }}
              >
                {badge.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm text-indigo-300 font-medium">AI-Powered Learning</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 sm:mb-6"
        >
          Drop <span className="gradient-text">anything</span>.
          <br />
          Understand <span className="gradient-text">everything</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed px-2 sm:px-0"
        >
          Upload a PDF. Paste a YouTube link. Drop a document. Lattice uses AI to
          transform it into mind maps, flashcards, knowledge cards, and visual summaries
          you can scan in minutes.
        </motion.p>

        {/* Supported format icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          {formatIcons.map((fmt) => (
            <div key={fmt.label} className="flex items-center gap-1.5" title={fmt.label}>
              <fmt.icon size={16} className={fmt.color} />
              <span className="text-xs text-zinc-600 hidden sm:inline">{fmt.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <button onClick={handleGetStarted} className="btn-primary btn-glow text-base px-8 py-3.5">
            Get Started &mdash; Free
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 mb-16"
        >
          <Check size={14} className="text-emerald-500" />
          No credit card required
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center"
        >
          <ChevronDown size={20} className="text-zinc-600 scroll-indicator" />
        </motion.div>
      </div>
    </section>
  );
}
