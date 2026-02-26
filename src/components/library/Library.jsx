import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useDistills } from '../../hooks/useDistills';
import { formatRelativeDate } from '../../utils/formatDate';
import { getSourceIcon, getSourceLabel, getFormatColor, getSourceColor } from '../../utils/sourceTypeDetector';
import { FORMAT_NAMES } from '../../services/prompts';
import { truncateText } from '../../utils/textTruncator';
import { usePageTitle } from '../../hooks/usePageTitle';
import DistillCard from '../dashboard/DistillCard';
import EmptyState from '../shared/EmptyState';
import LibraryFilters from './LibraryFilters';

export default function Library() {
  const { distills, loading } = useDistills(200);
  const navigate = useNavigate();
  usePageTitle('Library');

  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = useMemo(() => {
    let result = [...distills];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title?.toLowerCase().includes(q) ||
        d.extractedTextPreview?.toLowerCase().includes(q)
      );
    }

    if (sourceFilter !== 'all') {
      result = result.filter(d => d.sourceType === sourceFilter);
    }

    if (sort === 'oldest') {
      result.reverse();
    } else if (sort === 'alpha') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [distills, search, sourceFilter, sort]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Background glow */}
      <div className="absolute -top-10 right-10 w-[200px] sm:w-[350px] h-[150px] sm:h-[250px] bg-purple-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 -left-10 w-[150px] sm:w-[250px] h-[120px] sm:h-[200px] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6 sm:mb-8 relative">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-400 to-purple-500" />
          Library
        </h1>
        <button onClick={() => navigate('/dashboard/new')} className="btn-primary flex items-center gap-2 text-sm px-4 py-2 sm:px-6 sm:py-3">
          <Plus size={16} /> <span className="hidden sm:inline">New Distill</span><span className="sm:hidden">New</span>
        </button>
      </div>

      <LibraryFilters
        search={search} onSearchChange={setSearch}
        sourceFilter={sourceFilter} onSourceFilterChange={setSourceFilter}
        sort={sort} onSortChange={setSort}
        viewMode={viewMode} onViewModeChange={setViewMode}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer h-40 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          illustrationType="library"
          title={distills.length === 0 ? 'Your library is empty' : 'No matching distills'}
          description={distills.length === 0 ? 'Drop something in to get started.' : 'Try adjusting your search or filters.'}
          actionLabel={distills.length === 0 ? 'Create Your First Distill' : undefined}
          actionPath={distills.length === 0 ? '/dashboard/new' : undefined}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((distill, index) => (
            <DistillCard key={distill.id} distill={distill} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((distill, index) => {
            const SourceIcon = getSourceIcon(distill.sourceType);
            const sourceColor = getSourceColor(distill.sourceType);
            return (
              <motion.div
                key={distill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => navigate(`/dashboard/distill/${distill.id}`)}
                className="glass-card glass-card-hover p-4 flex items-center gap-4 cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-md ${sourceColor.bg} flex items-center justify-center flex-shrink-0`}>
                  <SourceIcon size={14} className={sourceColor.text} />
                </div>
                <span className="flex-1 text-sm text-white truncate">{truncateText(distill.title, 60)}</span>
                <span className="text-xs text-zinc-500 hidden sm:block">{getSourceLabel(distill.sourceType, distill.sourceInfo)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md border ${getFormatColor(distill.outputFormat)}`}>
                  {FORMAT_NAMES[distill.outputFormat]}
                </span>
                <span className="text-xs text-zinc-600 hidden md:block w-28 text-right">{formatRelativeDate(distill.createdAt)}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
