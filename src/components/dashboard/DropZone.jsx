import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, Link, FileText, Youtube, Globe, FileType } from 'lucide-react';

const fileTypeHints = [
  { icon: FileText, label: 'PDF', color: 'text-orange-400/60' },
  { icon: FileType, label: 'DOCX', color: 'text-cyan-400/60' },
  { icon: Youtube, label: 'YouTube', color: 'text-red-400/60' },
  { icon: Globe, label: 'URL', color: 'text-blue-400/60' },
];

export default function DropZone({ onFileSelect, onUrlSubmit }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUrlSubmit(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-indigo-400 bg-indigo-500/5'
            : 'border-zinc-700 hover:border-indigo-500/40 hover:bg-white/[0.02]'
        }`}
        style={{
          backgroundImage: isDragging ? undefined : undefined,
          borderImage: isDragging
            ? 'linear-gradient(135deg, #818CF8, #7C3AED, #6366F1) 1'
            : undefined,
        }}
      >
        {/* Animated dashed border overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <rect
            x="1" y="1"
            width="calc(100% - 2px)" height="calc(100% - 2px)"
            rx="16" ry="16"
            fill="none"
            stroke={isDragging ? '#818CF8' : isHovering ? 'rgba(129,140,248,0.35)' : 'transparent'}
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeLinecap="round"
            className="transition-all duration-300"
            style={{
              animation: (isDragging || isHovering) ? 'dashMove 1.5s linear infinite' : 'none',
            }}
          />
        </svg>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
        />
        <motion.div
          animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Upload
            size={40}
            className={`mx-auto mb-4 transition-colors duration-300 ${
              isDragging ? 'text-indigo-400' : 'text-indigo-400/50'
            }`}
          />
        </motion.div>
        <h3 className="font-heading font-semibold text-lg text-white mb-1">
          Drop a file, paste a URL, or click to upload
        </h3>
        <p className="text-sm text-zinc-500 mb-5">
          Supports PDF, YouTube, Word docs, and article links
        </p>

        {/* File type icons — visible on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovering || isDragging ? 1 : 0, y: isHovering || isDragging ? 0 : 6 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center gap-5"
        >
          {fileTypeHints.map((hint) => (
            <div key={hint.label} className="flex items-center gap-1.5">
              <hint.icon size={15} className={hint.color} />
              <span className="text-xs text-zinc-600">{hint.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <form onSubmit={handleUrlSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Link size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Or paste a YouTube URL or article link here..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!urlInput.trim()}
          className="btn-primary px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
