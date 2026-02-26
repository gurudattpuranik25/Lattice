import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Eye, EyeOff, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle, LayoutGrid, BookOpen, Sparkles } from 'lucide-react';

// --- Vibrant color palette for cards ---
const cardColors = [
  { bg: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)', accent: '#818CF8', soft: 'rgba(99,102,241,0.12)', border: 'rgba(129,140,248,0.3)' },
  { bg: 'linear-gradient(135deg, #059669 0%, #34D399 100%)', accent: '#34D399', soft: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
  { bg: 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)', accent: '#FB923C', soft: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)' },
  { bg: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)', accent: '#F472B6', soft: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)' },
  { bg: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)', accent: '#38BDF8', soft: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)' },
  { bg: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)', accent: '#A78BFA', soft: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
  { bg: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)', accent: '#FBBF24', soft: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
  { bg: 'linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)', accent: '#2DD4BF', soft: 'rgba(45,212,191,0.12)', border: 'rgba(45,212,191,0.3)' },
];

const difficultyConfig = {
  easy: { label: 'Easy', color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
  medium: { label: 'Medium', color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
  hard: { label: 'Hard', color: '#F87171', bg: 'rgba(248,113,113,0.15)' },
};

// --- Grid Card (colorful, flippable) ---
function GridCard({ card, colorScheme, showAnswer, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipped = showAnswer || isFlipped;
  const diff = difficultyConfig[card.difficulty] || difficultyConfig.medium;

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="cursor-pointer group"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 180, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-56"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: colorScheme.bg,
            boxShadow: `0 8px 32px ${colorScheme.soft}, 0 0 0 1px ${colorScheme.border}`,
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.12]"
            style={{ background: '#fff' }} />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-[0.08]"
            style={{ background: '#fff' }} />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
              #{index + 1}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
              style={{ color: '#fff', background: diff.bg, border: `1px solid ${diff.color}`, textShadow: `0 0 8px ${diff.color}` }}>
              {diff.label}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10 py-3">
            <p className="text-white text-center font-semibold leading-relaxed text-[15px]">
              {card.front}
            </p>
          </div>

          <div className="text-center relative z-10">
            <span className="text-xs font-medium text-white/80 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
              Tap to reveal
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#111116',
            boxShadow: `0 8px 32px ${colorScheme.soft}, 0 0 0 1px ${colorScheme.border}`,
            borderTop: `3px solid ${colorScheme.accent}`,
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={12} style={{ color: colorScheme.accent }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: colorScheme.accent }}>
              Answer
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center py-3">
            <p className="text-zinc-300 text-center text-sm leading-relaxed">
              {card.back}
            </p>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-zinc-600">Tap to flip back</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Study Mode Card (full-width, immersive) ---
function StudyCard({ card, colorScheme, index, total }) {
  const [flipped, setFlipped] = useState(false);
  const diff = difficultyConfig[card.difficulty] || difficultyConfig.medium;

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer w-full max-w-2xl mx-auto"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 180, damping: 22 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-72 sm:h-80"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-3xl p-5 sm:p-8 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: colorScheme.bg,
            boxShadow: `0 20px 60px ${colorScheme.soft}, 0 0 0 1px ${colorScheme.border}`,
          }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.1]"
            style={{ background: '#fff' }} />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-[0.07]"
            style={{ background: '#fff' }} />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-sm font-bold text-white/50">
              {index + 1} / {total}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm"
              style={{ color: '#fff', background: diff.bg, border: `1px solid ${diff.color}`, textShadow: `0 0 8px ${diff.color}` }}>
              {diff.label}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10 py-4">
            <p className="text-white text-center font-bold text-xl sm:text-2xl leading-relaxed">
              {card.front}
            </p>
          </div>

          <div className="text-center relative z-10">
            <span className="text-sm font-medium text-white/80 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full">Tap to reveal answer</span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl p-5 sm:p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#111116',
            boxShadow: `0 20px 60px ${colorScheme.soft}, 0 0 0 1px ${colorScheme.border}`,
            borderTop: `4px solid ${colorScheme.accent}`,
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: colorScheme.accent }} />
            <span className="text-xs font-bold uppercase tracking-wider"
              style={{ color: colorScheme.accent }}>
              Answer
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            <p className="text-zinc-200 text-center text-lg leading-relaxed">
              {card.back}
            </p>
          </div>

          <div className="text-center">
            <span className="text-xs text-zinc-600">Tap to see question</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Progress Bar ---
function ProgressBar({ current, total, knownCount, colorScheme }) {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500">{current + 1} of {total}</span>
        {knownCount > 0 && (
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} /> {knownCount} mastered
          </span>
        )}
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: colorScheme.accent }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// --- Main Component ---
export default function FlashcardsView({ data }) {
  const [cards, setCards] = useState(data?.cards || []);
  const [showAll, setShowAll] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [known, setKnown] = useState(new Set());

  if (!cards.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
          <LayoutGrid size={22} className="text-purple-400" />
        </div>
        <p className="text-zinc-400 font-medium text-sm">No flashcard data available</p>
        <p className="text-zinc-600 text-xs">Generate this format to create study flashcards</p>
      </div>
    );
  }

  const getColor = (i) => cardColors[i % cardColors.length];

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleReset = () => {
    setCards(data?.cards || []);
    setCurrentIndex(0);
    setKnown(new Set());
  };

  const markKnown = () => {
    setKnown(prev => new Set([...prev, cards[currentIndex].id]));
    if (currentIndex < cards.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const markUnknown = () => {
    setKnown(prev => { const n = new Set(prev); n.delete(cards[currentIndex].id); return n; });
    if (currentIndex < cards.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // --- Study Mode ---
  if (studyMode) {
    const color = getColor(currentIndex);
    return (
      <div className="py-8">
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          <h2 className="font-heading font-bold text-2xl text-white">{data.title}</h2>
          <button onClick={() => setStudyMode(false)}
            className="btn-ghost flex items-center gap-1.5 text-sm">
            <LayoutGrid size={14} /> Grid View
          </button>
        </div>

        <ProgressBar current={currentIndex} total={cards.length} knownCount={known.size} colorScheme={color} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <StudyCard
              card={cards[currentIndex]}
              colorScheme={color}
              index={currentIndex}
              total={cards.length}
            />
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-8 max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          <button onClick={markUnknown}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium">
            <XCircle size={16} /> Still Learning
          </button>

          <button onClick={handleShuffle}
            className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all">
            <Shuffle size={18} />
          </button>

          <button onClick={markKnown}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-medium">
            <CheckCircle2 size={16} /> Got It
          </button>

          <button
            onClick={() => setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1))}
            disabled={currentIndex === cards.length - 1}
            className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Card dots */}
        <div className="flex items-center justify-center gap-1 mt-6 flex-wrap max-w-2xl mx-auto">
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setCurrentIndex(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === currentIndex
                  ? getColor(i).accent
                  : known.has(c.id)
                    ? '#34D399'
                    : 'rgba(255,255,255,0.1)',
                transform: i === currentIndex ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // --- Grid Mode ---
  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">{data.title}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleShuffle}
            className="btn-ghost flex items-center gap-2 text-sm">
            <Shuffle size={15} /> Shuffle
          </button>
          <button onClick={() => setShowAll(!showAll)}
            className="btn-ghost flex items-center gap-2 text-sm">
            {showAll ? <EyeOff size={15} /> : <Eye size={15} />}
            {showAll ? 'Hide All' : 'Reveal All'}
          </button>
          <button onClick={handleReset}
            className="btn-ghost flex items-center gap-2 text-sm">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={() => { setStudyMode(true); setCurrentIndex(0); }}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/25 transition-all font-medium">
            <BookOpen size={14} /> Study Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <GridCard
              card={card}
              colorScheme={getColor(i)}
              showAnswer={showAll}
              index={i}
            />
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <span className="text-sm text-zinc-500">{cards.length} cards</span>
        {known.size > 0 && (
          <span className="text-sm text-emerald-400 ml-3">
            {known.size} mastered
          </span>
        )}
      </div>
    </div>
  );
}
