import React from 'react';
import { X, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { speechSystem } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PronunciationRulesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const playExample = (word: string) => {
    speechSystem.speak(word, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                PRONUNCIATION RULES FOR “-S/-ES” ENDINGS
              </h2>
              <p className="text-xs text-cyan-400/80">
                Standard phonetic rules for secondary school students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm">
          {/* Rule 1: /s/ */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-base font-black rounded-lg bg-cyan-500 text-slate-950">
                  /s/
                </span>
                <span className="font-semibold text-cyan-300 text-base">
                  1. Ending “-s/-es” pronounced as /s/
                </span>
              </div>
              <span className="text-xs text-cyan-400/80 font-medium">Voiceless Consonant Sounds</span>
            </div>
            <p className="text-slate-300">
              Pronounced <strong className="text-cyan-400">/s/</strong> when the base verb ends with one of the following voiceless consonant sounds:
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold">/p/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold">/t/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold">/k/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold">/f/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold">/θ/</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
              <span className="text-slate-400">Examples:</span>
              <button
                onClick={() => playExample('stops')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
              >
                <span>stops /stɒps/</span>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={() => playExample('works')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
              >
                <span>works /wɜːks/</span>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={() => playExample('laughs')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
              >
                <span>laughs /lɑːfs/</span>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Easy Memory Tip:</strong> Sounds: <strong>p</strong>, <strong>t</strong>, <strong>k</strong>, <strong>f</strong>, <strong>θ</strong> (th) — vocal cords do not vibrate.
              </span>
            </div>
          </div>

          {/* Rule 2: /ɪz/ */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-base font-black rounded-lg bg-purple-500 text-slate-950">
                  /ɪz/
                </span>
                <span className="font-semibold text-purple-300 text-base">
                  2. Ending “-s/-es” pronounced as /ɪz/
                </span>
              </div>
              <span className="text-xs text-purple-400/80 font-medium">Sibilant Sounds & Extra Syllable</span>
            </div>
            <p className="text-slate-300">
              Pronounced <strong className="text-purple-400">/ɪz/</strong> when the base verb ends with sibilant (hissing or buzzing) sounds:
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-purple-500/30 text-purple-300 font-bold">/s/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-purple-500/30 text-purple-300 font-bold">/z/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-purple-500/30 text-purple-300 font-bold">/ʃ/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-purple-500/30 text-purple-300 font-bold">/ʒ/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-purple-500/30 text-purple-300 font-bold">/tʃ/</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-purple-500/30 text-purple-300 font-bold">/dʒ/</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
              <span className="text-slate-400">Examples:</span>
              <button
                onClick={() => playExample('watches')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition"
              >
                <span>watches /ˈwɒtʃɪz/</span>
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              </button>
              <button
                onClick={() => playExample('washes')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition"
              >
                <span>washes /ˈwɒʃɪz/</span>
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              </button>
              <button
                onClick={() => playExample('changes')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition"
              >
                <span>changes /ˈtʃeɪndʒɪz/</span>
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Easy Memory Tip:</strong> Verbs ending in letters like <em>s, z, ch, sh, x, ge</em> create an extra syllable pronounced <strong>/ɪz/</strong>.
              </span>
            </div>
          </div>

          {/* Rule 3: /z/ */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-base font-black rounded-lg bg-emerald-500 text-slate-950">
                  /z/
                </span>
                <span className="font-semibold text-emerald-300 text-base">
                  3. Ending “-s/-es” pronounced as /z/
                </span>
              </div>
              <span className="text-xs text-emerald-400/80 font-medium">Voiced Sounds & Vowels</span>
            </div>
            <p className="text-slate-300">
              Pronounced <strong className="text-emerald-400">/z/</strong> after:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li>All vowel sounds (both monophthongs and diphthongs)</li>
              <li>All remaining voiced consonant sounds (such as /b/, /d/, /g/, /v/, /ð/, /m/, /n/, /ŋ/, /l/, /r/).</li>
            </ul>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
              <span className="text-slate-400">Examples:</span>
              <button
                onClick={() => playExample('plays')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
              >
                <span>plays /pleɪz/</span>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => playExample('runs')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
              >
                <span>runs /rʌnz/</span>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => playExample('reads')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
              >
                <span>reads /riːdz/</span>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <span>📌 Core Phonetic Note:</span>
            </div>
            <p>
              • Always <strong>focus on the final sound of the base verb</strong>, <em>not just the last written letter</em>.
            </p>
            <p>
              • For example: <span className="font-semibold text-cyan-300">laughs</span> ends with letters ‘gh’, but its base pronunciation is <span className="font-mono text-cyan-300">/lɑːf/</span> (ending in the voiceless sound /f/), so adding ‘-s’ is pronounced <span className="font-mono text-cyan-300">/s/</span>.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
