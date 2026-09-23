import React from 'react';
import { Volume2, Sparkles, Inbox } from 'lucide-react';
import { PronunciationGroup, VerbItem } from '../data/verbs';
import { WordCard } from './WordCard';
import { soundEffects } from '../utils/audio';

interface Props {
  group: PronunciationGroup;
  title: string;
  subHint: string;
  colorTheme: 'cyan' | 'purple' | 'emerald';
  words: VerbItem[];
  selectedVerb: VerbItem | null;
  onDropWord: (verbId: number, targetGroup: PronunciationGroup) => void;
  onSelectWord: (verb: VerbItem) => void;
  isCompareMode?: boolean;
  isSlowMode?: boolean;
  isLocked?: boolean;
  showMeaning?: boolean;
  cardStatusMap?: Record<number, 'normal' | 'placed' | 'correct' | 'incorrect'>;
  onAudioPlayed?: (verbId: number) => void;
  onDirectMove?: (verbId: number, target: '/s/' | '/ɪz/' | '/z/' | 'bank') => void;
}

export const DropColumn: React.FC<Props> = ({
  group,
  title,
  subHint,
  colorTheme,
  words,
  selectedVerb,
  onDropWord,
  onSelectWord,
  isCompareMode,
  isSlowMode,
  isLocked = false,
  showMeaning = false,
  cardStatusMap,
  onAudioPlayed,
  onDirectMove,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const themeConfig = {
    cyan: {
      border: 'border-cyan-500/40',
      borderGlow: 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      headerBg: 'bg-cyan-950/50',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      accentColor: 'text-cyan-400',
      dropzoneBg: 'bg-slate-900/60',
      activeTargetIndicator: 'bg-cyan-500/10 border-cyan-400/50',
    },
    purple: {
      border: 'border-purple-500/40',
      borderGlow: 'border-purple-400 ring-2 ring-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      headerBg: 'bg-purple-950/50',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      accentColor: 'text-purple-400',
      dropzoneBg: 'bg-slate-900/60',
      activeTargetIndicator: 'bg-purple-500/10 border-purple-400/50',
    },
    emerald: {
      border: 'border-emerald-500/40',
      borderGlow: 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      headerBg: 'bg-emerald-950/50',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      accentColor: 'text-emerald-400',
      dropzoneBg: 'bg-slate-900/60',
      activeTargetIndicator: 'bg-emerald-500/10 border-emerald-400/50',
    },
  }[colorTheme];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLocked) return;
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLocked) return;

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.verbId) {
          soundEffects.playDrop();
          onDropWord(data.verbId, group);
        }
      }
    } catch {
      // Fallback
    }
  };

  const handleColumnClick = () => {
    if (isLocked) return;
    if (selectedVerb) {
      soundEffects.playDrop();
      onDropWord(selectedVerb.id, group);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleColumnClick}
      className={`flex flex-col h-[580px] sm:h-[620px] rounded-2xl border transition-all duration-300 overflow-hidden bg-slate-900/70 backdrop-blur-sm ${
        isDragOver ? themeConfig.borderGlow : themeConfig.border
      } ${selectedVerb ? 'cursor-pointer hover:border-slate-400' : ''}`}
    >
      {/* Column Header */}
      <div className={`p-4 border-b border-slate-800 ${themeConfig.headerBg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900/80 border border-slate-700/60 shadow-inner">
            <span className={`text-2xl font-black ${themeConfig.accentColor} tracking-tight`}>
              {group}
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>{title}</span>
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-slate-500" />
              <span>{subHint}</span>
            </p>
          </div>
        </div>

        {/* Word count badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold border ${themeConfig.badgeBg} tabular-nums`}
        >
          {words.length} words
        </div>
      </div>

      {/* Drop area banner or tap prompt */}
      {selectedVerb && (
        <div
          className={`px-3 py-2 text-center text-xs font-semibold ${themeConfig.activeTargetIndicator} border-b border-slate-800 text-slate-200 animate-pulse`}
        >
          👉 Tap here to drop “{selectedVerb.word}” into column {group}
        </div>
      )}

      {/* Cards List / Empty State */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 custom-scrollbar">
        {words.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center border-2 border-dashed border-slate-800 rounded-xl">
            <Inbox className="w-10 h-10 mb-2 stroke-[1.5] text-slate-600" />
            <p className="text-sm font-medium text-slate-400">Drop words here</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[180px]">
              Drag a card or tap a card then tap here
            </p>
          </div>
        ) : (
          words.map(verb => (
            <WordCard
              key={verb.id}
              verb={verb}
              isSelected={selectedVerb?.id === verb.id}
              onSelect={onSelectWord}
              status={cardStatusMap ? cardStatusMap[verb.id] || 'placed' : 'placed'}
              isCompareMode={isCompareMode}
              isSlowMode={isSlowMode}
              isLocked={isLocked}
              showMeaning={showMeaning}
              onAudioPlayed={onAudioPlayed}
              onDirectMove={onDirectMove}
            />
          ))
        )}
      </div>
    </div>
  );
};
