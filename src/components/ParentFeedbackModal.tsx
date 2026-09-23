import React, { useState } from 'react';
import { X, Copy, Check, Download, MessageSquareText, HeartHandshake } from 'lucide-react';
import { GameSummary } from '../types/game';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  summary: GameSummary;
}

export const ParentFeedbackModal: React.FC<Props> = ({ isOpen, onClose, summary }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Level term mapping
  let levelTerm = 'at a basic level';
  if (summary.percentage >= 90) levelTerm = 'outstandingly';
  else if (summary.percentage >= 80) levelTerm = 'very well';
  else if (summary.percentage >= 70) levelTerm = 'well';
  else if (summary.percentage < 50) levelTerm = 'with room for improvement';

  const feedbackText = `Dear Parents of ${summary.student.fullName || 'Student'} (Class ${summary.student.className || '7'}, ${summary.student.school || 'Secondary School'}),

Student ${summary.student.fullName || 'Student'} has completed the 'PRONUNCIATION OF THE -S/-ES ENDING' challenge with a score of ${summary.finalScore}/${summary.maxScore} points (${summary.percentage}%, ${summary.performanceLevel}).

The student has demonstrated ${levelTerm} pronunciation differentiation among the three ending sounds (/s/, /ɪz/, /z/). Their strongest performance was in group ${summary.strongestGroup} (${summary.strongestGroup === '/s/' ? 'voiceless sounds' : summary.strongestGroup === '/ɪz/' ? 'sibilant / extra syllable sounds' : 'voiced sounds'}), and additional practice is recommended for group ${summary.weakestGroup}. Please continue encouraging regular listening and speaking practice at home.

Subject Teacher: VŨ THỊ MAI THU
Application: SMART ENGLISH TUTOR - S/ES PRONUNCIATION SORTING CHALLENGE
Completion Date: ${summary.completionDate}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(feedbackText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([feedbackText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Parent_Feedback_${summary.student.fullName.replace(/\s+/g, '_') || 'Student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                PARENT FEEDBACK
              </h2>
              <p className="text-xs text-emerald-400/80">
                Automatically personalized based on student performance
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

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-sm leading-relaxed text-slate-200 whitespace-pre-line select-text">
            {feedbackText}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span>
              Teachers can easily copy this note to send to parents via messaging or email.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Note (.txt)</span>
          </button>

          <button
            onClick={handleCopy}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-md ${
              copied
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Parent Feedback</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
