import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import ScrollToTop from '../shared/ScrollToTop';

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const mainMargin = isDesktop ? (sidebarCollapsed ? 72 : 280) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 relative text-scaled">
      {/* Subtle ambient glow for the dashboard */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-indigo-500/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[280px] w-[500px] h-[300px] bg-violet-500/[0.02] rounded-full blur-3xl" />
      </div>
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(c => !c)} />
      <main
        className="min-h-screen relative"
        style={{ marginLeft: mainMargin, transition: 'margin-left 0.25s ease-out' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 pt-16 lg:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}
