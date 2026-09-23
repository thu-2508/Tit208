import React from 'react';
import { Volume2, Check, Frown } from 'lucide-react';
import { VerbItem } from '../data/verbs';
import { soundEffects, speechSystem } from '../utils/audio';

interface Props {
  verb: VerbItem;
  isSelected?: boolean;
  onSelect?: (verb: VerbItem) => void;
  status?: 'normal' | 'placed' | 'correct' | 'incorrect';
  isSlowMode?: boolean;
  isCompareMode?: boolean;
  isLocked?: boolean;
  showMeaning?: boolean;
  onAudioPlayed?: (verbId: number) => void;
  onDirectMove?: (verbId: number, target: '/s/' | '/ɪz/' | '/z/' | 'bank') => void;
}

export const WordCard: React.FC<Props> = ({
  verb,
  isSelected = false,
  onSelect,
  status = 'normal',
  isSlowMode = false,
  isCompareMode = false,
  isLocked = false,
  showMeaning = false,
  onAudioPlayed,
  onDirectMove,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  // Listen to speechSystem state changes
  React.useEffect(() => {
    return speechSystem.subscribe(() => {
      const activeWord = speechSystem.currentlyPlayingWord;
      const match =
        activeWord === verb.word ||
        activeWord === `${verb.base} → ${verb.word}` ||
        activeWord === verb.base;
      setIsPlayingAudio(match);
    });
  }, [verb]);

  const handlePlayAudio = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Never select/drag card when clicking speaker
    soundEffects.playPickup();
    if (onAudioPlayed) onAudioPlayed(verb.id);

    if (isCompareMode) {
      speechSystem.speakCompare(verb.base, verb.word, isSlowMode);
    } else {
      speechSystem.speak(verb.word, isSlowMode);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    soundEffects.playPickup();
    e.dataTransfer.setData('application/json', JSON.stringify({ verbId: verb.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isLocked) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (onSelect) onSelect(verb);
    } else if (e.key === 'p' || e.key === 'P' || e.key === 's') {
      if (e.target === e.currentTarget && e.key === 'p') {
        handlePlayAudio(e);
      }
    } else if (onDirectMove) {
      if (e.key === '1') {
        e.preventDefault();
        onDirectMove(verb.id, '/s/');
      } else if (e.key === '2') {
        e.preventDefault();
        onDirectMove(verb.id, '/ɪz/');
      } else if (e.key === '3') {
        e.preventDefault();
        onDirectMove(verb.id, '/z/');
      } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Escape') {
        e.preventDefault();
        onDirectMove(verb.id, 'bank');
      }
    }
  };

  // Border & background styling based on status
  let cardStyles =
    'relative group cursor-grab active:cursor-grabbing select-none rounded-xl transition-all duration-200 p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow-md border';

  if (isLocked) {
    cardStyles += ' cursor-default';
  }

  if (status === 'correct') {
    cardStyles +=
      ' bg-emerald-950/70 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-emerald-100';
  } else if (status === 'incorrect') {
    cardStyles +=
      ' bg-rose-950/70 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)] text-rose-100';
  } else if (isSelected) {
    cardStyles +=
      ' bg-slate-800/95 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] ring-2 ring-cyan-400 scale-[1.02] text-white';
  } else if (status === 'placed') {
    cardStyles +=
      ' bg-slate-850/90 border-slate-700/80 hover:border-slate-500 hover:shadow-lg text-slate-150';
  } else {
    // Normal word bank card
    cardStyles +=
      ' bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700/90 hover:border-cyan-500/50 hover:shadow-[0_4px_16px_rgba(6,182,212,0.15)] hover:-translate-y-0.5 text-slate-100';
  }

  return (
    <div
      role="button"
      tabIndex={isLocked ? -1 : 0}
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onClick={() => {
        if (!isLocked && onSelect) onSelect(verb);
      }}
      onKeyDown={handleKeyDown}
      aria-label={`Verb card ${verb.word}. Base form: ${verb.base}.`}
      className={cardStyles}
    >
      {/* Word and Stem / Suffix highlights */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="text-base sm:text-lg tracking-wide leading-tight select-none">
          <span className="font-bold text-white group-hover:text-cyan-200 transition-colors">
            {verb.stem}
          </span>
          <span className="font-black text-amber-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
            {verb.suffix}
          </span>
        </div>
        {showMeaning && (
          <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
            {verb.meaningVi}
          </span>
        )}
      </div>

      {/* Action / Status Icons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Status Indicators */}
        {status === 'correct' && (
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            title="Correct!"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        )}
        {status === 'incorrect' && (
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40"
            title="Incorrect - will review in Review Round"
          >
            <Frown className="w-3.5 h-3.5" />
          </span>
        )}

        {/* Independent Speaker Button */}
        <button
          type="button"
          tabIndex={-1}
          onClick={handlePlayAudio}
          title={isCompareMode ? `Listen & Compare: ${verb.base} → ${verb.word}` : `Pronounce: ${verb.word}`}
          aria-label={`Listen to ${verb.word}`}
          className={`p-1.5 rounded-lg transition-all active:scale-90 border ${
            isPlayingAudio
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse'
              : 'bg-slate-800/80 text-cyan-400 hover:text-white hover:bg-cyan-500/20 border-slate-700/80'
          }`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
