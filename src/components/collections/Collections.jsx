import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useCollections } from '../../hooks/useCollections';
import { useDistills } from '../../hooks/useDistills';
import { createCollection, deleteCollection } from '../../services/firestoreService';
import { usePageTitle } from '../../hooks/usePageTitle';
import DistillCard from '../dashboard/DistillCard';
import EmptyState from '../shared/EmptyState';
import ConfirmDialog from '../shared/ConfirmDialog';
import CreateCollectionModal from './CreateCollectionModal';

export default function Collections() {
  const { user } = useAuth();
  usePageTitle('Collections');
  const { collections, loading } = useCollections();
  const { distills } = useDistills();
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleCreate = async (name, color) => {
    try {
      await createCollection(user.uid, name, color);
      toast.success('Collection created');
    } catch (err) {
      toast.error('Failed to create collection');
    }
  };

  const handleDelete = async (collectionId) => {
    try {
      await deleteCollection(user.uid, collectionId);
      if (selectedId === collectionId) setSelectedId(null);
      toast.success('Collection deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const filteredDistills = selectedId
    ? distills.filter(d => d.collectionId === selectedId)
    : distills.filter(d => !d.collectionId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-6 sm:mb-8 flex items-center gap-3">
        <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-400 to-teal-400" />
        Collections
      </h1>

      {loading ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shimmer h-11 rounded-xl" />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shimmer h-36 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : (
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left panel — horizontal scroll on mobile, vertical sidebar on desktop */}
        <div className="w-full lg:w-64 flex-shrink-0">
          {/* Collection tabs — wrapped grid on mobile, vertical sidebar on desktop */}
          <div className="flex flex-wrap lg:flex-col gap-2">
            <button
              onClick={() => setSelectedId(null)}
              className={`flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all lg:w-full ${
                selectedId === null
                  ? 'bg-white/5 text-white lg:border-l-[3px] lg:border-indigo-400 lg:pl-[13px]'
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              <FolderOpen size={16} />
              Uncategorized
              <span className="text-xs text-zinc-600">
                {distills.filter(d => !d.collectionId).length}
              </span>
            </button>

            {collections.map(col => (
              <div key={col.id} className="group flex items-center">
                <button
                  onClick={() => setSelectedId(col.id)}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-sm font-medium transition-all lg:w-full ${
                    selectedId === col.id
                      ? 'bg-white/5 text-white lg:border-l-[3px] lg:border-indigo-400 lg:pl-[13px]'
                      : 'text-zinc-400 hover:bg-white/5'
                  }`}
                >
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: col.color }} />
                  <span className="truncate">{col.name}</span>
                  <span className="text-xs text-zinc-600 lg:ml-auto">{col.distillCount || 0}</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(col)}
                  className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-3 rounded-xl text-sm text-zinc-500 hover:text-indigo-400 hover:bg-white/5 transition-all lg:w-full"
            >
              <Plus size={16} />
              New Collection
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1">
          {filteredDistills.length === 0 ? (
            <EmptyState
              illustrationType="collection"
              title="No distills here yet"
              description={selectedId ? 'Save distills to this collection from the distill view.' : 'Uncategorized distills will appear here.'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDistills.map((distill, i) => (
                <DistillCard key={distill.id} distill={distill} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      <CreateCollectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="All distills in this collection will be permanently deleted. This cannot be undone."
        confirmLabel="Delete Collection"
        variant="danger"
      />
    </motion.div>
  );
}
