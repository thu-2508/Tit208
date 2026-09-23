import React from 'react';
import { X, Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { GameSummary } from '../types/game';
import { speechSystem } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  summary: GameSummary;
}

export const ReviewAnswersModal: React.FC<Props> = ({ isOpen, onClose, summary }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              DETAILED ANSWER REVIEW
            </h2>
            <p className="text-xs text-slate-400">
              Review Answers - All {summary.activeVerbs.length} verbs and phonetic analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-750 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Verb</th>
                <th className="py-3 px-3">Base form</th>
                <th className="py-3 px-3">Your choice</th>
                <th className="py-3 px-3">Correct sound</th>
                <th className="py-3 px-3">Base final sound</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Explanation</th>
                <th className="py-3 px-3 text-center">Audio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {summary.activeVerbs.map((verb, idx) => {
                // Determine whether correct in initial or review round
                const initialChoice = summary.initialPlacements[verb.id];
                const reviewChoice = summary.reviewPlacements[verb.id];
                const finalChoice = reviewChoice || initialChoice || 'Unanswered';
                const isFinalCorrect =
                  summary.initialCorrectMap[verb.id] || summary.reviewCorrectMap[verb.id];

                return (
                  <tr
                    key={verb.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isFinalCorrect ? 'bg-emerald-950/10' : 'bg-rose-950/10'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-white text-sm">
                      <span>{verb.stem}</span>
                      <span className="text-amber-400 font-black">{verb.suffix}</span>
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300 font-medium">
                      {verb.base}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          finalChoice === verb.correctGroup
                            ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30'
                            : 'text-rose-300 bg-rose-950/60 border border-rose-500/30'
                        }`}
                      >
                        {finalChoice}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-black text-cyan-400">
                      {verb.correctGroup}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono">
                      {verb.baseFinalSound}
                    </td>
                    <td className="py-2.5 px-3">
                      {isFinalCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs text-[11px] leading-relaxed">
                      {verb.explanationVi}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => speechSystem.speak(verb.word, false)}
                        title={`Listen: ${verb.word}`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-200 border border-slate-700 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
