import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

const difficultyColors = {
  easy: 'text-emerald-400 bg-emerald-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  hard: 'text-red-400 bg-red-500/10',
};

function FlashCard({ card, showAnswer, onFlip }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipped = showAnswer || isFlipped;

  return (
    <div
      onClick={() => { setIsFlipped(!isFlipped); onFlip?.(); }}
      className="cursor-pointer perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-52"
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass-card p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white text-center font-medium leading-relaxed">{card.front}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-md ${difficultyColors[card.difficulty] || difficultyColors.medium}`}>
              {card.difficulty}
            </span>
            <span className="text-xs text-zinc-600">Click to flip</span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 glass-card p-6 flex flex-col justify-between bg-indigo-500/[0.03]"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-zinc-300 text-center text-sm leading-relaxed">{card.back}</p>
          </div>
          <span className="text-xs text-zinc-600 text-center">Click to flip back</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function FlashcardsView({ data }) {
  const [cards, setCards] = useState(data?.cards || []);
  const [showAll, setShowAll] = useState(false);
  const [singleMode, setSingleMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cards.length) {
    return <div className="text-center text-zinc-500 py-20">No flashcard data available.</div>;
  }

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  if (singleMode) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-semibold text-xl text-white">{data.title}</h2>
          <button onClick={() => setSingleMode(false)} className="btn-ghost text-sm">Grid View</button>
        </div>

        <div className="mb-4 text-center text-sm text-zinc-400">
          Card {currentIndex + 1} of {cards.length}
        </div>

        <FlashCard card={cards[currentIndex]} showAnswer={false} />

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="btn-secondary p-3 disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <button onClick={handleShuffle} className="btn-ghost flex items-center gap-2">
            <Shuffle size={16} /> Shuffle
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1))}
            disabled={currentIndex === cards.length - 1}
            className="btn-secondary p-3 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-xl text-white">{data.title}</h2>
        <div className="flex items-center gap-2">
          <button onClick={handleShuffle} className="btn-ghost flex items-center gap-2 text-sm">
            <Shuffle size={15} /> Shuffle
          </button>
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            {showAll ? <EyeOff size={15} /> : <Eye size={15} />}
            {showAll ? 'Hide' : 'Show All'}
          </button>
          <button onClick={() => setSingleMode(true)} className="btn-ghost text-sm">
            Study Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <FlashCard card={card} showAnswer={showAll} />
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        {cards.length} cards total
      </p>
    </div>
  );
}
