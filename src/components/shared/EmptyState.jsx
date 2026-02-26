import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function EmptyIllustration({ type }) {
  if (type === 'library') {
    return (
      <svg width="140" height="120" viewBox="0 0 140 120" fill="none" className="mx-auto mb-6">
        {/* Stacked pages */}
        <motion.rect x="30" y="30" width="80" height="60" rx="8" fill="#18181B" stroke="#27272A" strokeWidth="1.5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} />
        <motion.rect x="25" y="25" width="80" height="60" rx="8" fill="#18181B" stroke="#27272A" strokeWidth="1.5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} />
        <motion.rect x="20" y="20" width="80" height="60" rx="8" fill="#09090B" stroke="#3F3F46" strokeWidth="1.5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} />
        {/* Lines on top page */}
        <motion.rect x="32" y="34" width="40" height="3" rx="1.5" fill="#3F3F46"
          initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.5, duration: 0.4 }} />
        <motion.rect x="32" y="42" width="30" height="3" rx="1.5" fill="#27272A"
          initial={{ width: 0 }} animate={{ width: 30 }} transition={{ delay: 0.6, duration: 0.4 }} />
        <motion.rect x="32" y="50" width="35" height="3" rx="1.5" fill="#27272A"
          initial={{ width: 0 }} animate={{ width: 35 }} transition={{ delay: 0.7, duration: 0.4 }} />
        {/* Plus icon */}
        <motion.circle cx="100" cy="85" r="16" fill="#818CF8" fillOpacity="0.1" stroke="#818CF8" strokeWidth="1.5"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 200 }} />
        <motion.path d="M100 79V91M94 85H106" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
      </svg>
    );
  }

  if (type === 'collection') {
    return (
      <svg width="140" height="120" viewBox="0 0 140 120" fill="none" className="mx-auto mb-6">
        {/* Folder shape */}
        <motion.path
          d="M25 35C25 31.686 27.686 29 31 29H55L62 37H109C112.314 37 115 39.686 115 43V85C115 88.314 112.314 91 109 91H31C27.686 91 25 88.314 25 85V35Z"
          fill="#09090B" stroke="#3F3F46" strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        />
        {/* Folder flap */}
        <motion.path
          d="M25 35C25 31.686 27.686 29 31 29H55L62 37H25V35Z"
          fill="#18181B" stroke="#3F3F46" strokeWidth="1.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        />
        {/* Dotted circle */}
        <motion.circle cx="70" cy="65" r="14" stroke="#3F3F46" strokeWidth="1.5" strokeDasharray="4 3" fill="none"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} />
        {/* Small sparkle */}
        <motion.path d="M70 56V74M61 65H79" stroke="#52525B" strokeWidth="1.5" strokeLinecap="round"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
      </svg>
    );
  }

  // Default / dashboard empty
  return (
    <svg width="160" height="130" viewBox="0 0 160 130" fill="none" className="mx-auto mb-6">
      {/* Document */}
      <motion.rect x="40" y="15" width="55" height="70" rx="8" fill="#09090B" stroke="#3F3F46" strokeWidth="1.5"
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} />
      <motion.rect x="52" y="30" width="30" height="3" rx="1.5" fill="#3F3F46"
        initial={{ width: 0 }} animate={{ width: 30 }} transition={{ delay: 0.5, duration: 0.3 }} />
      <motion.rect x="52" y="38" width="22" height="3" rx="1.5" fill="#27272A"
        initial={{ width: 0 }} animate={{ width: 22 }} transition={{ delay: 0.6, duration: 0.3 }} />
      <motion.rect x="52" y="46" width="26" height="3" rx="1.5" fill="#27272A"
        initial={{ width: 0 }} animate={{ width: 26 }} transition={{ delay: 0.7, duration: 0.3 }} />
      {/* Arrow curving to output */}
      <motion.path d="M97 50C110 50 115 55 115 65C115 75 110 80 100 80"
        stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
      <motion.path d="M103 76L99 80L103 84" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} />
      {/* Sparkle */}
      <motion.circle cx="115" cy="50" r="3" fill="#818CF8" fillOpacity="0.4"
        initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 1, duration: 0.4 }} />
      <motion.circle cx="108" cy="42" r="2" fill="#7C3AED" fillOpacity="0.3"
        initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 1.1, duration: 0.4 }} />
      {/* Output cards */}
      <motion.rect x="55" y="90" width="24" height="18" rx="4" fill="#818CF8" fillOpacity="0.08" stroke="#818CF8" strokeOpacity="0.2" strokeWidth="1"
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} />
      <motion.rect x="83" y="90" width="24" height="18" rx="4" fill="#7C3AED" fillOpacity="0.08" stroke="#7C3AED" strokeOpacity="0.2" strokeWidth="1"
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} />
    </svg>
  );
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionPath, illustrationType = 'default' }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-20"
    >
      <EmptyIllustration type={illustrationType} />
      <h3 className="font-heading font-semibold text-xl text-zinc-400 mb-2">{title}</h3>
      {description && <p className="text-zinc-500 text-sm mb-6">{description}</p>}
      {actionLabel && actionPath && (
        <button onClick={() => navigate(actionPath)} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
