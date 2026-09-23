import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { PronunciationGroup, VerbItem, VIETNAMESE_HINTS } from '../data/verbs';
import { soundEffects, speechSystem } from '../utils/audio';

interface Props {
  reviewVerbs: VerbItem[];
  initialScore: number;
  maxScore: number;
  timeMode: 'fixed_5min' | '20s_per_word';
  isCompareMode: boolean;
  onFinishReview: (
    reviewPlacements: Record<number, PronunciationGroup | null>,
    reviewCorrectMap: Record<number, boolean>,
    reviewEarnedScore: number
  ) => void;
}

export const ReviewRound: React.FC<Props> = ({
  reviewVerbs,
  initialScore,
  maxScore,
  timeMode,
  isCompareMode,
  onFinishReview,
}) => {
  // Current verb index in the review queue
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVerb = reviewVerbs[currentIndex];

  // Records for each verb
  const [reviewPlacements, setReviewPlacements] = useState<Record<number, PronunciationGroup | null>>({});
  const [reviewCorrectMap, setReviewCorrectMap] = useState<Record<number, boolean>>({});
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [reviewScore, setReviewScore] = useState(0);

  // Timer for review round
  const initialSeconds = timeMode === '20s_per_word' ? reviewVerbs.length * 20 : 300;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isSlowPlaying, setIsSlowPlaying] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectChoice = (chosenGroup: PronunciationGroup) => {
    if (hasAnsweredCurrent || !currentVerb) return;

    const isCorrect = chosenGroup === currentVerb.correctGroup;
    setReviewPlacements(prev => ({ ...prev, [currentVerb.id]: chosenGroup }));
    setReviewCorrectMap(prev => ({ ...prev, [currentVerb.id]: isCorrect }));
    setHasAnsweredCurrent(true);

    if (isCorrect) {
      soundEffects.playCorrect();
      setReviewScore(prev => prev + 10);
    } else {
      soundEffects.playIncorrect();
      // Speak natural then slow for reinforcement
      speechSystem.speak(currentVerb.word, false, () => {
        setTimeout(() => {
          speechSystem.speak(currentVerb.word, true);
        }, 400);
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < reviewVerbs.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setHasAnsweredCurrent(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    onFinishReview(reviewPlacements, reviewCorrectMap, reviewScore);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentVerb) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-400">No verbs to review!</p>
        <button
          onClick={handleComplete}
          className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold"
        >
          View Results
        </button>
      </div>
    );
  }

  const isCurrentCorrect = reviewCorrectMap[currentVerb.id];
  const userChoice = reviewPlacements[currentVerb.id];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Review Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <RotateCcw className="w-4 h-4" />
            <span>REVIEW ROUND</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Review & Practice Mistakes
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Try the incorrect verbs again. Listen carefully and check the sorting hints.
          </p>
        </div>

        {/* Live Timer & Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold tabular-nums">
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 30 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold tabular-nums">
            {currentIndex + 1} / {reviewVerbs.length} words
          </div>
        </div>
      </div>

      {/* Main Review Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        {/* Word Display & Audio controls */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-4xl sm:text-5xl font-black tracking-wide">
            <span className="text-white drop-shadow-md">{currentVerb.stem}</span>
            <span className="text-amber-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
              {currentVerb.suffix}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            Base verb: <strong className="text-cyan-300 font-bold">{currentVerb.base}</strong> ({currentVerb.meaningVi})
          </p>

          {/* Audio Listen Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={() => speechSystem.speak(currentVerb.word, false)}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-2 text-xs font-bold transition active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Natural Speed</span>
            </button>
            <button
              onClick={() => speechSystem.speak(currentVerb.word, true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 text-xs font-medium transition active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Slow Speed</span>
            </button>
            {isCompareMode && (
              <button
                onClick={() => speechSystem.speakCompare(currentVerb.base, currentVerb.word, false)}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 flex items-center gap-2 text-xs font-bold transition active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>Listen & Compare ({currentVerb.base} → {currentVerb.word})</span>
              </button>
            )}
          </div>
        </div>

        {/* Sorting Hint Box */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300 mb-1">Sorting Hint:</div>
            <p>{VIETNAMESE_HINTS[currentVerb.correctGroup]}</p>
          </div>
        </div>

        {/* 3 Choice Buttons */}
        {!hasAnsweredCurrent ? (
          <div className="space-y-3 pt-2">
            <div className="text-center text-xs text-slate-400 font-medium">
              Choose the correct pronunciation group for “{currentVerb.word}”:
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => handleSelectChoice('/s/')}
                className="py-4 px-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-500/20 border-2 border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-black text-xl sm:text-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg flex flex-col items-center gap-1"
              >
                <span>/s/</span>
                <span className="text-[11px] font-normal text-slate-400">Voiceless</span>
              </button>

              <button
                onClick={() => handleSelectChoice('/ɪz/')}
                className="py-4 px-3 rounded-2xl bg-purple-950/40 hover:bg-purple-500/20 border-2 border-purple-500/40 hover:border-purple-400 text-purple-300 font-black text-xl sm:text-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg flex flex-col items-center gap-1"
              >
                <span>/ɪz/</span>
                <span className="text-[11px] font-normal text-slate-400">Extra syllable</span>
              </button>

              <button
                onClick={() => handleSelectChoice('/z/')}
                className="py-4 px-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-500/20 border-2 border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-black text-xl sm:text-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg flex flex-col items-center gap-1"
              >
                <span>/z/</span>
                <span className="text-[11px] font-normal text-slate-400">Voiced</span>
              </button>
            </div>
          </div>
        ) : (
          /* Feedback Box after choice */
          <div className="space-y-4 pt-2 animate-fadeIn">
            {isCurrentCorrect ? (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-emerald-300 font-bold text-sm sm:text-base">
                      Correct! (+10 points)
                    </div>
                    <p className="text-xs text-emerald-200/80">
                      The ending of “{currentVerb.word}” is pronounced {currentVerb.correctGroup}.
                    </p>
                  </div>
                </div>
                <div className="text-emerald-400 font-black text-xl">+10</div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/50 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-rose-300 font-bold text-sm sm:text-base">
                      Not quite right this time!
                    </div>
                    <p className="text-xs text-rose-200/80">
                      Your choice: <span className="font-mono font-bold text-white">{userChoice}</span> | Correct answer: <span className="font-mono font-black text-cyan-300 text-sm">{currentVerb.correctGroup}</span>
                    </p>
                  </div>
                </div>
                {/* Detailed explanation */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-cyan-300">Detailed Explanation:</div>
                  <p>{currentVerb.explanationVi}</p>
                  <p className="text-slate-400">
                    Final sound of base verb “{currentVerb.base}”: <strong className="text-white">{currentVerb.baseFinalSound}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Continue button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-violet-500/20 active:scale-95 transition"
              >
                <span>{currentIndex < reviewVerbs.length - 1 ? 'Next Verb' : 'Finish Review Round'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
