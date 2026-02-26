import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

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
    <section className="relative pt-32 pb-20 overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
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
          className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6"
        >
          Drop <span className="gradient-text">anything</span>.
          <br />
          Understand <span className="gradient-text">everything</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload a PDF. Paste a YouTube link. Drop a document. Lattice uses AI to
          transform it into mind maps, flashcards, knowledge cards, and visual summaries
          you can scan in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <button onClick={handleGetStarted} className="btn-primary text-base px-8 py-3.5">
            Get Started &mdash; Free
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-1.5 text-sm text-zinc-500"
        >
          <Check size={14} className="text-emerald-500" />
          No credit card required
        </motion.p>
      </div>
    </section>
  );
}
