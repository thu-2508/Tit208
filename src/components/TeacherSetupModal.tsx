import React, { useState } from 'react';
import { X, Settings, Sliders, Eye, Shuffle, Check, Play, ListFilter, Volume2 } from 'lucide-react';
import { TeacherSettings } from '../types/game';
import { VERB_DATABASE } from '../data/verbs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: TeacherSettings;
  onSaveSettings: (newSettings: TeacherSettings, startNewGame: boolean) => void;
}

export const TeacherSetupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<TeacherSettings>({ ...settings });
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  if (!isOpen) return null;

  const handleWordCountChange = (count: number) => {
    // When changing count, slice or take words
    let newSelectedIds: number[] = [];
    if (count === 50) {
      newSelectedIds = VERB_DATABASE.map(v => v.id);
    } else {
      // Pick balanced count across 3 categories
      const sGroup = VERB_DATABASE.filter(v => v.correctGroup === '/s/');
      const izGroup = VERB_DATABASE.filter(v => v.correctGroup === '/ɪz/');
      const zGroup = VERB_DATABASE.filter(v => v.correctGroup === '/z/');

      const perGroup = Math.floor(count / 3);
      const remainder = count % 3;

      const selected = [
        ...sGroup.slice(0, perGroup + (remainder > 0 ? 1 : 0)),
        ...izGroup.slice(0, perGroup + (remainder > 1 ? 1 : 0)),
        ...zGroup.slice(0, perGroup),
      ];
      newSelectedIds = selected.map(v => v.id);
    }

    setLocalSettings(prev => ({
      ...prev,
      wordCount: count,
      selectedVerbIds: newSelectedIds,
    }));
  };

  const handleToggleVerb = (id: number) => {
    const isSelected = localSettings.selectedVerbIds.includes(id);
    let newIds = [];
    if (isSelected) {
      if (localSettings.selectedVerbIds.length <= 10) {
        alert('Cần tối thiểu 10 từ để bài tập có ý nghĩa giáo dục.');
        return;
      }
      newIds = localSettings.selectedVerbIds.filter(vId => vId !== id);
    } else {
      newIds = [...localSettings.selectedVerbIds, id];
    }
    setLocalSettings(prev => ({
      ...prev,
      selectedVerbIds: newIds,
      wordCount: newIds.length,
    }));
  };

  const handleSelectAll = () => {
    setLocalSettings(prev => ({
      ...prev,
      wordCount: 50,
      selectedVerbIds: VERB_DATABASE.map(v => v.id),
    }));
  };

  const handleApply = (startNew: boolean) => {
    onSaveSettings(localSettings, startNew);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                TEACHER SETUP & CONFIGURATION
              </h2>
              <p className="text-xs text-cyan-400/80">
                Teacher: VŨ THỊ MAI THU • Secondary School English Curriculum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Grade & Word Count Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Grade Selection */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Grade
              </label>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black text-sm">
                  Grade 7 (Lower Secondary English)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Vocabulary and phonetic difficulty calibrated for Grade 7 students.
              </p>
            </div>

            {/* Word Count */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Word Count Per Session:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[20, 30, 40, 50].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => handleWordCountChange(cnt)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      localSettings.wordCount === cnt
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {cnt} words
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Default: 50 words (Maximum score: {localSettings.wordCount * 10} points).
              </p>
            </div>
          </div>

          {/* Time & Review Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Initial Round Time */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Round 1 Timer (Initial Round)
              </label>
              <div className="flex items-center gap-2">
                {[15, 20, 25, 30].map(min => (
                  <button
                    key={min}
                    onClick={() =>
                      setLocalSettings(prev => ({ ...prev, initialTimeMinutes: min }))
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      localSettings.initialTimeMinutes === min
                        ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {min} mins
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Default time: 25 minutes for 50 verbs.
              </p>
            </div>

            {/* Review Round Time Mode */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Review Round Timer Mode
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setLocalSettings(prev => ({ ...prev, reviewTimeMode: 'fixed_5min' }))
                  }
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    localSettings.reviewTimeMode === 'fixed_5min'
                      ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  Fixed 5 mins
                </button>
                <button
                  onClick={() =>
                    setLocalSettings(prev => ({ ...prev, reviewTimeMode: '20s_per_word' }))
                  }
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                    localSettings.reviewTimeMode === '20s_per_word'
                      ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  20s / incorrect word
                </button>
              </div>
            </div>
          </div>

          {/* Educational Toggles */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Display & Phonetic Support Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Show Vietnamese meaning under words:</span>
                <input
                  type="checkbox"
                  checked={localSettings.showMeaningVi}
                  onChange={e =>
                    setLocalSettings(prev => ({ ...prev, showMeaningVi: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Enable “Listen and Compare” button:</span>
                <input
                  type="checkbox"
                  checked={localSettings.listenCompareEnabled}
                  onChange={e =>
                    setLocalSettings(prev => ({ ...prev, listenCompareEnabled: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Enable Sound Effects:</span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={e =>
                    setLocalSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Enable Ambient Study Music:</span>
                <input
                  type="checkbox"
                  checked={localSettings.musicEnabled}
                  onChange={e =>
                    setLocalSettings(prev => ({ ...prev, musicEnabled: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                />
              </label>
            </div>
          </div>

          {/* Word Selection & Answer Key Preview */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Verbs & Answer Key Preview (Teacher Only)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Selected {localSettings.selectedVerbIds.length}/50 verbs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Select All (50 verbs)
                </button>
                <button
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showAnswerKey ? 'Hide Answers' : 'Preview Answer Key'}</span>
                </button>
              </div>
            </div>

            {/* Word Grid checklist */}
            <div className="max-h-48 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-slate-900/60 rounded-xl border border-slate-850">
              {VERB_DATABASE.map(v => {
                const isSelected = localSettings.selectedVerbIds.includes(v.id);
                return (
                  <button
                    key={v.id}
                    onClick={() => handleToggleVerb(v.id)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs border text-left transition ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/50 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-bold text-white">{v.stem}</span>
                      <span className="font-black text-amber-400">{v.suffix}</span>
                      {showAnswerKey && (
                        <span className="ml-1 font-mono text-[10px] text-amber-400">
                          [{v.correctGroup}]
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => handleApply(false)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            Save Settings for Next Session
          </button>

          <button
            onClick={() => handleApply(true)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Apply & Start New Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
