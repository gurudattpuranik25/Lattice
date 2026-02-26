import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plus, BookOpen, FolderOpen, Settings, LogOut, Menu, X, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Plus, label: 'New Distill', path: '/dashboard/new' },
  { icon: BookOpen, label: 'Library', path: '/dashboard/library' },
  { icon: FolderOpen, label: 'Collections', path: '/dashboard/collections' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarContent = (full) => (
    <div className="flex flex-col h-full">
      <div className={`p-6 flex items-center ${full ? 'gap-2.5' : 'justify-center'}`}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <rect width="32" height="32" rx="8" fill="#818CF8"/>
          <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M16 8V24" stroke="white" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="2" fill="white"/>
        </svg>
        {full && <span className="font-heading font-bold text-lg tracking-tight text-white">LATTICE</span>}
      </div>

      <nav className={`flex-1 ${full ? 'px-3' : 'px-2'} space-y-1`}>
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            onClick={() => setMobileOpen(false)}
            title={!full ? label : undefined}
            className={({ isActive }) =>
              `flex items-center ${full ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? full
                    ? 'bg-indigo-500/10 text-white border-l-[3px] border-indigo-400 pl-[9px]'
                    : 'bg-indigo-500/10 text-white'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {full && label}
          </NavLink>
        ))}
      </nav>

      <div className={`p-4 border-t border-white/5 ${!full ? 'flex flex-col items-center' : ''}`}>
        {full ? (
          <div className="flex items-center gap-3 px-2 mb-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-medium">
                {user?.displayName?.[0] || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{user?.displayName}</div>
              <div className="text-xs text-zinc-500 truncate">{user?.email}</div>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-medium">
                {user?.displayName?.[0] || '?'}
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          title={!full ? 'Sign Out' : undefined}
          className={`flex items-center ${full ? 'gap-2 px-3 w-full' : 'justify-center px-2'} py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200`}
        >
          <LogOut size={16} />
          {full && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-zinc-900 border border-white/5"
      >
        <Menu size={20} className="text-zinc-400" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar — always full width */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-zinc-950 border-r border-white/5 z-50"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-4 p-1 text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>
            {sidebarContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="hidden lg:block fixed left-0 top-0 bottom-0 bg-zinc-950 border-r border-white/5 z-30 overflow-hidden"
      >
        {sidebarContent(!collapsed)}
        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-6 right-[-12px] w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all z-40"
        >
          {collapsed ? <ChevronsRight size={12} /> : <ChevronsLeft size={12} />}
        </button>
      </motion.aside>
    </>
  );
}
