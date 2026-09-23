import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Play,
  Settings,
  Volume2,
  VolumeX,
  Music,
  Maximize2,
  Minimize2,
  Trash2,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { StudentProfile } from '../types/game';
import { TutorMascot } from './TutorMascot';

interface Props {
  profile: StudentProfile;
  onChangeProfile: (updated: Partial<StudentProfile>) => void;
  onStartGame: () => void;
  onOpenRules: () => void;
  onOpenInstructions: () => void;
  onOpenTeacherSetup: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onClearData: () => void;
}

export const LoginScreen: React.FC<Props> = ({
  profile,
  onChangeProfile,
  onStartGame,
  onOpenRules,
  onOpenInstructions,
  onOpenTeacherSetup,
  soundEnabled,
  onToggleSound,
  musicEnabled,
  onToggleMusic,
  isFullscreen,
  onToggleFullscreen,
  onClearData,
}) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim() || !profile.className.trim() || !profile.school.trim()) {
      setErrorMessage('Please complete all required information before starting.');
      return;
    }
    setErrorMessage('');
    onStartGame();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* App Branding & Headers (Exact titles from Section I) */}
      <div className="text-center space-y-3">
        {/* Subtitle tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-cyan-400 shadow-inner">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>English for Grades 6, 7, 8 and 9</span>
        </div>

        {/* Primary Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
          SMART ENGLISH TUTOR
        </h1>

        {/* Vietnamese Title replaced with English */}
        <div className="text-xs sm:text-sm font-extrabold text-cyan-300 tracking-wide">
          SMART ENGLISH TUTOR FOR GRADES 6, 7, 8 & 9
        </div>

        {/* Teacher Title - Strict requirement: "Teacher: VŨ THỊ MAI THU" */}
        <div className="inline-block px-4 py-1.5 rounded-xl bg-violet-950/60 border border-violet-500/40 text-violet-200 text-xs sm:text-sm font-bold shadow-md">
          Teacher: VŨ THỊ MAI THU
        </div>

        {/* Game Title & Exercise Description */}
        <div className="pt-2 space-y-1">
          <div className="text-lg sm:text-xl font-black text-amber-400 tracking-wide uppercase">
            S/ES PRONUNCIATION SORTING CHALLENGE
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto italic font-serif">
            “Exercise 1: Classify the verbs according to the pronunciation of their ‘-s/-es’ ending.”
          </p>
        </div>
      </div>

      {/* Mascot greeting */}
      <TutorMascot tip="Welcome to the Phonetics Lab! Please enter your full name, class, and school to start the 50-verb challenge!" />

      {/* Registration Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Student Registration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Required before starting the challenge
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleStart} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={e => onChangeProfile({ fullName: e.target.value })}
              placeholder="e.g. Nguyễn Văn An"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          {/* Class and School in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Class <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.className}
                onChange={e => onChangeProfile({ className: e.target.value })}
                placeholder="e.g. 7A1"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                School <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.school}
                onChange={e => onChangeProfile({ school: e.target.value })}
                placeholder="e.g. THCS Chu Văn An"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
            </div>
          </div>

          {/* Start Game Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-black text-base tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>START GAME</span>
            </button>
          </div>
        </form>
      </div>

      {/* Auxiliary Action Buttons Grid (Required by Section III) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={onOpenInstructions}
          className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition active:scale-95 text-center"
        >
          <HelpCircle className="w-4 h-4 text-violet-400" />
          <span>Instructions (Tiếng Việt)</span>
        </button>

        <button
          type="button"
          onClick={onOpenRules}
          className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition active:scale-95 text-center"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Pronunciation Rules</span>
        </button>

        <button
          type="button"
          onClick={onOpenTeacherSetup}
          className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition active:scale-95 text-center"
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Teacher Setup</span>
        </button>

        <button
          type="button"
          onClick={onClearData}
          className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition active:scale-95 text-center hover:border-rose-500/50 hover:text-rose-300"
          title="Clear saved data"
        >
          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
          <span>Clear My Data</span>
        </button>
      </div>

      {/* Media & System Toggles Bar */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 pt-2">
        <button
          onClick={onToggleSound}
          className="flex items-center gap-1.5 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          <span>Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <span>•</span>

        <button
          onClick={onToggleMusic}
          className="flex items-center gap-1.5 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition"
        >
          <Music className={`w-4 h-4 ${musicEnabled ? 'text-purple-400 animate-bounce' : 'text-slate-500'}`} />
          <span>Music: {musicEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <span>•</span>

        <button
          onClick={onToggleFullscreen}
          className="flex items-center gap-1.5 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
          <span>Full Screen</span>
        </button>
      </div>
    </div>
  );
};
