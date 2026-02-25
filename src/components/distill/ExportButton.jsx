import { useState, useRef } from 'react';
import { Download, Image, FileText, Copy, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToPNG, exportToPDF, copyTextToClipboard } from '../../services/exportService';
import toast from 'react-hot-toast';

export default function ExportButton({ targetRef, filename = 'lattice-export', textContent }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleExport = async (type) => {
    setOpen(false);
    try {
      if (type === 'png') {
        await exportToPNG(targetRef.current, filename);
        toast.success('Exported as PNG');
      } else if (type === 'pdf') {
        await exportToPDF(targetRef.current, filename);
        toast.success('Exported as PDF');
      } else if (type === 'text') {
        await copyTextToClipboard(textContent || '');
        toast.success('Copied to clipboard');
      }
    } catch (err) {
      toast.error('Export failed. Please try again.');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary flex items-center gap-2 text-sm py-2"
      >
        <Download size={16} />
        Export
        <ChevronDown size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 glass-card p-1.5 z-50 rounded-xl shadow-xl"
            >
              <button
                onClick={() => handleExport('png')}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Image size={15} /> Export as PNG
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <FileText size={15} /> Export as PDF
              </button>
              <button
                onClick={() => handleExport('text')}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Copy size={15} /> Copy Text
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
