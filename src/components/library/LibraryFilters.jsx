import { Search, Grid3x3, List } from 'lucide-react';

const sourceFilters = [
  { key: 'all', label: 'All', activeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  { key: 'pdf', label: 'PDFs', activeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  { key: 'youtube', label: 'YouTube', activeClass: 'bg-red-500/15 text-red-300 border-red-500/30' },
  { key: 'url', label: 'Articles', activeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  { key: 'docx', label: 'Docs', activeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
];

const sortOptions = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'alpha', label: 'Alphabetical' },
];

export default function LibraryFilters({
  search, onSearchChange,
  sourceFilter, onSourceFilterChange,
  sort, onSortChange,
  viewMode, onViewModeChange,
}) {
  return (
    <div className="space-y-4 mb-8">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your distills..."
          className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between">
        <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 -mb-1">
          {sourceFilters.map(f => (
            <button
              key={f.key}
              onClick={() => onSourceFilterChange(f.key)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all border whitespace-nowrap ${
                sourceFilter === f.key
                  ? f.activeClass
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            {sortOptions.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>

          <div className="flex border border-white/5 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-indigo-500/10 text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Grid3x3 size={14} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-indigo-500/10 text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
