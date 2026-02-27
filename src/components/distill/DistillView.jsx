import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FolderPlus, Trash2, RefreshCw, Loader2, ChevronDown, Check, Plus, StickyNote, Clock, Layers, BarChart3, Zap, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useCollections } from '../../hooks/useCollections';
import ConfirmDialog from '../shared/ConfirmDialog';
import { getDistill, updateDistill, deleteDistill, addDistillToCollection, removeDistillFromCollection, createCollection } from '../../services/firestoreService';
import { processWithClaude } from '../../services/claudeService';
import { getSourceLabel, getFormatColor } from '../../utils/sourceTypeDetector';
import { FORMAT_NAMES } from '../../services/prompts';
import { usePageTitle } from '../../hooks/usePageTitle';
import ExportButton from './ExportButton';

const CornellNotesView = lazy(() => import('../outputs/CornellNotesView'));
const TimelineView = lazy(() => import('../outputs/TimelineView'));
const FlashcardsView = lazy(() => import('../outputs/FlashcardsView'));
const InfographicView = lazy(() => import('../outputs/InfographicView'));
const KeyTakeawaysView = lazy(() => import('../outputs/KeyTakeawaysView'));
const KnowledgeCardsView = lazy(() => import('../outputs/KnowledgeCardsView'));

const formatComponents = {
  cornellNotes: CornellNotesView,
  timeline: TimelineView,
  flashcards: FlashcardsView,
  infographic: InfographicView,
  keyTakeaways: KeyTakeawaysView,
  knowledgeCards: KnowledgeCardsView,
};

const formatKeys = ['cornellNotes', 'timeline', 'flashcards', 'infographic', 'keyTakeaways', 'knowledgeCards'];

const formatIcons = {
  cornellNotes: StickyNote,
  timeline: Clock,
  flashcards: Layers,
  infographic: BarChart3,
  keyTakeaways: Zap,
  knowledgeCards: LayoutGrid,
};

const presetColors = ['#818CF8', '#34D399', '#FB923C', '#F472B6', '#38BDF8', '#FBBF24'];

function SaveToCollectionButton({ distill, distillId, onUpdate }) {
  const { user } = useAuth();
  const { collections } = useCollections();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(presetColors[0]);
  const inputRef = useRef(null);

  const handleSelect = async (collectionId) => {
    setOpen(false);
    setCreating(false);
    try {
      const currentCollectionId = distill.collectionId || null;

      if (currentCollectionId === collectionId) {
        // Remove from collection
        await removeDistillFromCollection(user.uid, distillId, collectionId);
        onUpdate({ collectionId: null });
        toast.success('Removed from collection');
      } else {
        // Remove from old collection first
        if (currentCollectionId) {
          await removeDistillFromCollection(user.uid, distillId, currentCollectionId);
        }
        // Add to new collection
        await addDistillToCollection(user.uid, distillId, collectionId);
        onUpdate({ collectionId });
        const col = collections.find(c => c.id === collectionId);
        toast.success(`Saved to "${col?.name}"`);
      }
    } catch {
      toast.error('Failed to update collection');
    }
  };

  const handleCreateAndSave = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const collectionId = await createCollection(user.uid, newName.trim(), newColor);
      setNewName('');
      setNewColor(presetColors[0]);
      setCreating(false);
      // Now save to the new collection
      const currentCollectionId = distill.collectionId || null;
      if (currentCollectionId) {
        await removeDistillFromCollection(user.uid, distillId, currentCollectionId);
      }
      await addDistillToCollection(user.uid, distillId, collectionId);
      onUpdate({ collectionId });
      setOpen(false);
      toast.success(`Created "${newName.trim()}" and saved!`);
    } catch {
      toast.error('Failed to create collection');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCreating(false);
    setNewName('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost flex items-center gap-1.5 text-sm py-2"
      >
        <FolderPlus size={15} />
        {distill.collectionId
          ? collections.find(c => c.id === distill.collectionId)?.name || 'Collection'
          : 'Save to...'}
        <ChevronDown size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={handleClose} />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 glass-card p-1.5 z-50 rounded-xl shadow-xl"
            >
              {collections.map(col => (
                <button
                  key={col.id}
                  onClick={() => handleSelect(col.id)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: col.color }} />
                  <span className="flex-1 text-left truncate">{col.name}</span>
                  {distill.collectionId === col.id && (
                    <Check size={14} className="text-indigo-400 flex-shrink-0" />
                  )}
                </button>
              ))}

              {/* Divider */}
              <div className="my-1 border-t border-white/5" />

              {!creating ? (
                <button
                  onClick={() => {
                    setCreating(true);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/5 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  <span>New Collection</span>
                </button>
              ) : (
                <form onSubmit={handleCreateAndSave} className="p-2 space-y-2.5">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Collection name..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40"
                    autoFocus
                  />
                  <div className="flex gap-1.5">
                    {presetColors.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewColor(c)}
                        className={`w-5 h-5 rounded transition-all ${
                          newColor === c ? 'ring-2 ring-white/60 scale-110' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setCreating(false); setNewName(''); }}
                      className="flex-1 text-xs text-zinc-400 hover:text-white py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newName.trim()}
                      className="flex-1 text-xs text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                    >
                      Create & Save
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DistillView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const outputRef = useRef(null);

  const [distill, setDistill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFormat, setActiveFormat] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  usePageTitle(distill ? `${distill.title} — ${FORMAT_NAMES[activeFormat] || ''}` : 'Loading...');

  useEffect(() => {
    if (!user || !id) return;
    setLoading(true);
    getDistill(user.uid, id).then((data) => {
      if (data) {
        setDistill(data);
        setActiveFormat(data.outputFormat);
        setTitleInput(data.title);
      } else {
        toast.error('Distill not found');
        navigate('/dashboard');
      }
      setLoading(false);
    });
  }, [user, id]);

  const handleFormatSwitch = async (format) => {
    setActiveFormat(format);

    if (distill.outputs?.[format]) return;

    setGenerating(true);
    try {
      const text = distill.extractedTextPreview || '';
      const output = await processWithClaude(text, format);

      const updatedOutputs = { ...distill.outputs, [format]: output };
      await updateDistill(user.uid, id, { outputs: updatedOutputs });
      setDistill(prev => ({ ...prev, outputs: updatedOutputs }));
      toast.success(`${FORMAT_NAMES[format]} generated!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      const text = distill.extractedTextPreview || '';
      const output = await processWithClaude(text, activeFormat);
      const updatedOutputs = { ...distill.outputs, [activeFormat]: output };
      await updateDistill(user.uid, id, { outputs: updatedOutputs });
      setDistill(prev => ({ ...prev, outputs: updatedOutputs }));
      toast.success('Regenerated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDistill(user.uid, id);
      toast.success('Deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleTitleSave = async () => {
    setEditingTitle(false);
    if (titleInput !== distill.title) {
      await updateDistill(user.uid, id, { title: titleInput });
      setDistill(prev => ({ ...prev, title: titleInput }));
    }
  };

  const handleCollectionUpdate = (updates) => {
    setDistill(prev => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <div>
        {/* Top bar skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shimmer w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="shimmer h-7 w-48 sm:w-64 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <div className="shimmer h-9 w-24 rounded-xl" />
            <div className="shimmer h-9 w-28 rounded-xl" />
          </div>
        </div>
        {/* Tabs skeleton */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer h-10 rounded-xl flex-shrink-0" style={{ width: `${70 + Math.random() * 30}px` }} />
          ))}
        </div>
        {/* Content skeleton */}
        <div className="shimmer h-[300px] sm:h-[500px] rounded-2xl" />
      </div>
    );
  }

  if (!distill) return null;

  const OutputComponent = formatComponents[activeFormat];
  const outputData = distill.outputs?.[activeFormat];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </button>

          {editingTitle ? (
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              autoFocus
              className="font-heading font-bold text-xl text-white bg-transparent border-b border-indigo-400 outline-none flex-1"
            />
          ) : (
            <h1
              onClick={() => setEditingTitle(true)}
              className="font-heading font-bold text-xl text-white truncate cursor-pointer hover:text-indigo-300 transition-colors"
            >
              {distill.title}
            </h1>
          )}

          <span className={`text-xs px-2 py-0.5 rounded-md border flex-shrink-0 ${getFormatColor(activeFormat)}`}>
            {getSourceLabel(distill.sourceType, distill.sourceInfo)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <ExportButton targetRef={outputRef} filename={distill.title} textContent={JSON.stringify(outputData, null, 2)} />
          <SaveToCollectionButton distill={distill} distillId={id} onUpdate={handleCollectionUpdate} />
          <button onClick={handleRegenerate} disabled={generating} className="btn-ghost flex items-center gap-1.5 text-sm">
            <RefreshCw size={15} className={generating ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
          <button onClick={() => setConfirmDeleteOpen(true)} className="btn-danger text-sm px-3 py-2">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Format Tabs */}
      <div className="flex gap-1 mb-6 sm:mb-8 overflow-x-auto pb-2 relative scrollbar-hide">
        {formatKeys.map(key => {
          const Icon = formatIcons[key];
          const isActive = activeFormat === key;
          return (
            <button
              key={key}
              onClick={() => handleFormatSwitch(key)}
              className={`relative px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 sm:gap-2 ${
                isActive
                  ? 'text-indigo-300'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-indigo-400' : ''} />
              {FORMAT_NAMES[key]}
              {distill.outputs?.[key] && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              )}
              {isActive && (
                <motion.div
                  layoutId="activeFormatTab"
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-indigo-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
        {/* Base line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />
      </div>

      {/* Output Display */}
      <div ref={outputRef}>
        {generating ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="animate-spin text-indigo-400" />
            <p className="text-zinc-400 text-sm">Generating {FORMAT_NAMES[activeFormat]}...</p>
          </div>
        ) : outputData && OutputComponent ? (
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-zinc-400" />
            </div>
          }>
            <OutputComponent data={outputData} />
          </Suspense>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            {(() => {
              const Icon = formatIcons[activeFormat];
              return (
                <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Icon size={24} className="text-zinc-500" />
                </div>
              );
            })()}
            <div className="text-center">
              <p className="text-zinc-400 font-medium text-sm mb-1">No {FORMAT_NAMES[activeFormat]} generated yet</p>
              <p className="text-zinc-600 text-xs">Click below to generate this format from your content</p>
            </div>
            <button onClick={() => handleFormatSwitch(activeFormat)} className="btn-primary text-sm">
              Generate Now
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this distill?"
        description="This will permanently remove this distill and all its generated outputs. This cannot be undone."
        confirmLabel="Delete Distill"
      />
    </motion.div>
  );
}
