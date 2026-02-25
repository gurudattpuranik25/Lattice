import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useCollections } from '../../hooks/useCollections';
import { useDistills } from '../../hooks/useDistills';
import { createCollection, deleteCollection } from '../../services/firestoreService';
import DistillCard from '../dashboard/DistillCard';
import CreateCollectionModal from './CreateCollectionModal';

export default function Collections() {
  const { user } = useAuth();
  const { collections, loading } = useCollections();
  const { distills } = useDistills();
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = async (name, color) => {
    try {
      await createCollection(user.uid, name, color);
      toast.success('Collection created');
    } catch (err) {
      toast.error('Failed to create collection');
    }
  };

  const handleDelete = async (collectionId) => {
    if (!window.confirm('Delete this collection?')) return;
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
      <h1 className="font-heading font-bold text-3xl text-white mb-8">Collections</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left panel */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setSelectedId(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedId === null
                ? 'bg-white/5 text-white border-l-[3px] border-indigo-400 pl-[13px]'
                : 'text-zinc-400 hover:bg-white/5'
            }`}
          >
            <FolderOpen size={16} />
            Uncategorized
            <span className="ml-auto text-xs text-zinc-600">
              {distills.filter(d => !d.collectionId).length}
            </span>
          </button>

          {collections.map(col => (
            <div key={col.id} className="group flex items-center">
              <button
                onClick={() => setSelectedId(col.id)}
                className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedId === col.id
                    ? 'bg-white/5 text-white border-l-[3px] border-indigo-400 pl-[13px]'
                    : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: col.color }} />
                <span className="truncate">{col.name}</span>
                <span className="ml-auto text-xs text-zinc-600">{col.distillCount || 0}</span>
              </button>
              <button
                onClick={() => handleDelete(col.id)}
                className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            onClick={() => setModalOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-zinc-500 hover:text-indigo-400 hover:bg-white/5 transition-all"
          >
            <Plus size={16} />
            New Collection
          </button>
        </div>

        {/* Right panel */}
        <div className="flex-1">
          {filteredDistills.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen size={40} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No distills in this collection</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDistills.map((distill, i) => (
                <DistillCard key={distill.id} distill={distill} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateCollectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </motion.div>
  );
}
