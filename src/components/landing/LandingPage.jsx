import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../shared/Navbar';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import FormatShowcase from './FormatShowcase';
import StatsSection from './StatsSection';
import LandingFooter from './LandingFooter';

export default function LandingPage() {
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
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <HeroSection />

      {/* Animated Demo Section */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-zinc-500 font-mono">lattice</span>
            </div>
            <div className="p-8 md:p-12">
              <div className="mb-6">
                <div className="text-xs text-zinc-500 mb-2 font-mono">INPUT</div>
                <motion.div
                  className="glass-card p-4 rounded-xl font-mono text-sm text-zinc-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                >
                  <span className="text-zinc-500">URL:</span>{' '}
                  <span className="text-indigo-400">https://youtube.com/watch?v=dQw4w9WgXcQ</span>
                </motion.div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-2 font-mono">OUTPUT &mdash; MIND MAP</div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Core Concept', cls: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 col-span-3 md:col-span-5' },
                    { label: 'Key Idea A', cls: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' },
                    { label: 'Key Idea B', cls: 'bg-amber-500/10 text-amber-300 border border-amber-500/20' },
                    { label: 'Detail 1', cls: 'bg-emerald-500/5 text-zinc-300 border border-emerald-500/10' },
                    { label: 'Detail 2', cls: 'bg-emerald-500/5 text-zinc-300 border border-emerald-500/10' },
                    { label: 'Detail 3', cls: 'bg-amber-500/5 text-zinc-300 border border-amber-500/10' },
                    { label: 'Key Idea C', cls: 'bg-purple-500/10 text-purple-300 border border-purple-500/20' },
                    { label: 'Detail 4', cls: 'bg-purple-500/5 text-zinc-300 border border-purple-500/10' },
                    { label: 'Detail 5', cls: 'bg-purple-500/5 text-zinc-300 border border-purple-500/10' },
                    { label: 'Summary', cls: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' },
                  ].map(({ label, cls }, i) => (
                    <motion.div
                      key={label}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                        delay: 2 + i * 0.12,
                      }}
                      className={`p-3 rounded-xl text-center text-xs font-medium ${cls}`}
                    >
                      {label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <HowItWorks />
      <FormatShowcase />
      <StatsSection />

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Start understanding faster
              </h2>
              <p className="text-zinc-400 text-lg mb-8">
                Your next PDF, lecture, or article is waiting to be distilled.
              </p>
              <button onClick={handleGetStarted} className="btn-primary text-base px-10 py-4">
                Get Started Free
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
