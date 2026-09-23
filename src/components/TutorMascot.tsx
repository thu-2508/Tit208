import React from 'react';
import { Volume2, Sparkles, Award } from 'lucide-react';

interface Props {
  tip?: string;
  onHearTip?: (text: string) => void;
  compact?: boolean;
}

export const TutorMascot: React.FC<Props> = ({
  tip = 'Click the speaker icon to listen carefully to the final sound before sorting!',
  compact = false,
}) => {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-850 to-slate-900 border border-slate-700/80 shadow-lg ${compact ? 'py-2' : ''}`}>
      {/* 3D-styled Mascot Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center animate-pulse">
          <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
            {/* Robot / Owl Tutor Face */}
            <div className="flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
              </div>
              {/* Smile */}
              <div className="w-4 h-1.5 border-b-2 border-amber-400 rounded-full" />
            </div>
            {/* Graduation Cap Badge */}
            <div className="absolute -top-1 -right-1 text-amber-400">
              <Award className="w-4 h-4 fill-amber-400 text-amber-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Speech bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Smart Tutor AI
          </span>
          <span className="text-[10px] text-slate-500">Teacher: VŨ THỊ MAI THU</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug mt-0.5">
          {tip}
        </p>
      </div>
    </div>
  );
};
