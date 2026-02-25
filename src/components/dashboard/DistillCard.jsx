import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getSourceIcon, getSourceLabel, getFormatColor } from '../../utils/sourceTypeDetector';
import { formatRelativeDate } from '../../utils/formatDate';
import { truncateText } from '../../utils/textTruncator';
import { FORMAT_NAMES } from '../../services/prompts';

export default function DistillCard({ distill, index = 0 }) {
  const navigate = useNavigate();
  const SourceIcon = getSourceIcon(distill.sourceType);
  const sourceLabel = getSourceLabel(distill.sourceType, distill.sourceInfo);
  const formatColor = getFormatColor(distill.outputFormat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => navigate(`/dashboard/distill/${distill.id}`)}
      className="glass-card glass-card-hover p-6 cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          distill.sourceType === 'pdf' ? 'bg-orange-500/10' :
          distill.sourceType === 'youtube' ? 'bg-red-500/10' :
          distill.sourceType === 'url' ? 'bg-blue-500/10' :
          distill.sourceType === 'docx' ? 'bg-cyan-500/10' :
          'bg-zinc-800'
        }`}>
          <SourceIcon size={16} className={
            distill.sourceType === 'pdf' ? 'text-orange-400' :
            distill.sourceType === 'youtube' ? 'text-red-400' :
            distill.sourceType === 'url' ? 'text-blue-400' :
            distill.sourceType === 'docx' ? 'text-cyan-400' :
            'text-zinc-400'
          } />
        </div>
        <h3 className="font-heading font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {truncateText(distill.title, 80) || 'Untitled'}
        </h3>
      </div>

      <p className="text-xs text-zinc-500 mb-3">{sourceLabel}</p>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-md border ${formatColor}`}>
          {FORMAT_NAMES[distill.outputFormat] || distill.outputFormat}
        </span>
        <span className="text-xs text-zinc-600">
          {formatRelativeDate(distill.createdAt)}
        </span>
      </div>
    </motion.div>
  );
}
