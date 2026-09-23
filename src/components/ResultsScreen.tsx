import React, { useEffect } from 'react';
import {
  Trophy,
  Award,
  RotateCcw,
  CheckCircle2,
  FileText,
  Printer,
  Download,
  MessageSquareText,
  BarChart2,
  Volume2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSummary } from '../types/game';
import { soundEffects } from '../utils/audio';

interface Props {
  summary: GameSummary;
  onReviewAnswers: () => void;
  onPlayAgain: () => void;
  onOpenCertificate: () => void;
  onOpenParentFeedback: () => void;
  onOpenTeacherReport: () => void;
}

export const ResultsScreen: React.FC<Props> = ({
  summary,
  onReviewAnswers,
  onPlayAgain,
  onOpenCertificate,
  onOpenParentFeedback,
  onOpenTeacherReport,
}) => {
  useEffect(() => {
    soundEffects.playVictory();

    // Trigger celebration effects
    if (summary.percentage >= 90) {
      // Fireworks effect
      const end = Date.now() + 2500;
      const interval: number = window.setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
      }, 300);
    } else if (summary.percentage >= 70) {
      // Gentle celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [summary.percentage]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadResult = () => {
    const text = `===========================================
CHALLENGE COMPLETED: S/ES PRONUNCIATION SORTING CHALLENGE
SMART ENGLISH TUTOR - English for Grades 6, 7, 8 and 9
Teacher: VŨ THỊ MAI THU
===========================================
Student: ${summary.student.fullName || 'N/A'}
Class: ${summary.student.className || 'N/A'}
School: ${summary.student.school || 'N/A'}
Activity: S/ES PRONUNCIATION SORTING CHALLENGE
Completion Date: ${summary.completionDate}

Initial Round Score: ${summary.initialScore}
Review Round Score: ${summary.reviewScore}
Final Score: ${summary.finalScore}/${summary.maxScore}
Percentage: ${summary.percentage}%
Performance Level: ${summary.performanceLevel}

Group Breakdown:
- /s/: ${summary.sGroupStats.correct}/${summary.sGroupStats.total}
- /ɪz/: ${summary.izGroupStats.correct}/${summary.izGroupStats.total}
- /z/: ${summary.zGroupStats.correct}/${summary.zGroupStats.total}
===========================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Result_${summary.student.fullName.replace(/\s+/g, '_') || 'Student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const minutes = Math.floor(summary.timeUsedSeconds / 60);
  const seconds = summary.timeUsedSeconds % 60;
  const totalCorrectWords =
    summary.sGroupStats.correct + summary.izGroupStats.correct + summary.zGroupStats.correct;
  const totalWords = summary.activeVerbs.length;
  const incorrectWords = totalWords - totalCorrectWords;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn print:p-0 print:bg-white print:text-black">
      {/* Hero Victory Card */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/80 border border-slate-700/80 shadow-2xl overflow-hidden text-center space-y-4">
        {/* Subtle background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>CHALLENGE COMPLETED</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Challenge Completed!
        </h1>

        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Congratulations to <strong className="text-white font-bold">{summary.student.fullName || 'Student'}</strong> for successfully completing the ‘-s/-es’ pronunciation sorting challenge.
        </p>

        {/* Big Score Hero Metric */}
        <div className="pt-2 flex flex-col items-center">
          <div className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-400 tabular-nums drop-shadow-sm">
            {summary.finalScore}
            <span className="text-2xl sm:text-3xl text-slate-400 font-bold">
              /{summary.maxScore}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-slate-800 border border-slate-700 text-cyan-300 tabular-nums">
              {summary.percentage}%
            </span>
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                summary.percentage >= 90
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : summary.percentage >= 70
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {summary.performanceLevel}
            </span>
          </div>
        </div>

        {/* Certificate Callout & Qualification Card */}
        {summary.isEligibleForCertificate ? (
          <div className="pt-2 flex flex-col items-center gap-3">
            <div className="p-4 sm:p-5 w-full rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-yellow-950/70 border-2 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CẤP GIẤY CHỨNG NHẬN ĐẠT CHUẨN (≥ 70%)</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white">
                    Chúc mừng em đã xuất sắc đạt {summary.percentage}%!
                  </div>
                  <p className="text-xs text-slate-300">
                    Em đã đủ điều kiện được cấp Giấy chứng nhận hoàn thành thử thách từ cô giáo Vũ Thị Mai Thu.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenCertificate}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/40 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>XEM & TẢI GIẤY CHỨNG NHẬN</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-400">
                    Tiêu chuẩn cấp Giấy chứng nhận: Đạt từ 70% câu đúng trở lên
                  </div>
                  <p className="text-xs text-slate-400">
                    Kết quả của em: <strong className="text-white">{summary.percentage}%</strong> ({totalCorrectWords}/{totalWords} từ đúng). Em hãy xem lại bảng quy tắc phát âm và bấm <strong className="text-cyan-300">Play Again</strong> để thử sức lại và nhận Giấy chứng nhận nhé!
                  </p>
                </div>
              </div>
              <button
                onClick={onPlayAgain}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 shrink-0 flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử sức lại</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Teacher's Evaluation & Comments Card (Nhận xét ngắn gọn phù hợp với kết quả HS) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-3.5 text-left">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-400/50 flex items-center justify-center text-violet-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Teacher's Evaluation</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-300">Nhận xét của giáo viên</span>
              </h3>
              <div className="text-xs text-violet-300 font-bold">
                Teacher: VŨ THỊ MAI THU
              </div>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              summary.isEligibleForCertificate
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {summary.isEligibleForCertificate
              ? '✓ Cấp chứng nhận (Đạt ≥ 70%)'
              : 'Chưa đủ điều kiện cấp chứng nhận'}
          </span>
        </div>

        {/* Vietnamese Comment */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Lời nhận xét của cô giáo:
          </div>
          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed font-sans">
            “{summary.teacherCommentVi}”
          </p>
        </div>

        {/* English Feedback */}
        <div className="text-xs text-slate-400 italic">
          "{summary.teacherCommentEn}"
        </div>

        {/* Strongest & Weakest Group Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400">Nhóm làm tốt nhất:</span>{' '}
              <strong className="text-white font-mono">{summary.strongestGroup}</strong>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400">Cần lưu ý luyện thêm:</span>{' '}
              <strong className="text-white font-mono">{summary.weakestGroup}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Group Performance Breakdown Gauges (Section XIX requirement) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>Results by Pronunciation Group:</span>
          </h3>
          <span className="text-xs text-slate-400">Target: 3 groups /s/, /ɪz/, /z/</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Group /s/ */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-cyan-400 font-mono">/s/</span>
              <span className="text-xs font-bold text-slate-400">Voiceless ending</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white tabular-nums">
                {summary.sGroupStats.correct}
                <span className="text-sm text-slate-400 font-bold">/{summary.sGroupStats.total}</span>
              </div>
              <div className="text-xs font-bold text-cyan-400 font-mono">
                {Math.round((summary.sGroupStats.correct / summary.sGroupStats.total) * 100 || 0)}%
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-cyan-400 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${(summary.sGroupStats.correct / summary.sGroupStats.total) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

          {/* Group /ɪz/ */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-purple-400 font-mono">/ɪz/</span>
              <span className="text-xs font-bold text-slate-400">Extra syllable</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white tabular-nums">
                {summary.izGroupStats.correct}
                <span className="text-sm text-slate-400 font-bold">/{summary.izGroupStats.total}</span>
              </div>
              <div className="text-xs font-bold text-purple-400 font-mono">
                {Math.round((summary.izGroupStats.correct / summary.izGroupStats.total) * 100 || 0)}%
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-purple-400 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${(summary.izGroupStats.correct / summary.izGroupStats.total) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

          {/* Group /z/ */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-emerald-400 font-mono">/z/</span>
              <span className="text-xs font-bold text-slate-400">Voiced ending</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white tabular-nums">
                {summary.zGroupStats.correct}
                <span className="text-sm text-slate-400 font-bold">/{summary.zGroupStats.total}</span>
              </div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {Math.round((summary.zGroupStats.correct / summary.zGroupStats.total) * 100 || 0)}%
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${(summary.zGroupStats.correct / summary.zGroupStats.total) * 100 || 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Complete Overview Grid (Section XIX metadata requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] uppercase text-slate-400 font-semibold">Student</div>
          <div className="text-sm font-bold text-white truncate">{summary.student.fullName || '—'}</div>
          <div className="text-xs text-slate-400">Class {summary.student.className} • {summary.student.school}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] uppercase text-slate-400 font-semibold">Correct / Incorrect</div>
          <div className="text-sm font-bold text-emerald-400">
            {totalCorrectWords} correct <span className="text-slate-500 font-normal">/</span> <span className="text-rose-400">{incorrectWords} incorrect</span>
          </div>
          <div className="text-xs text-slate-400">Total: {totalWords} verbs</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] uppercase text-slate-400 font-semibold">Round 1 & Review Score</div>
          <div className="text-sm font-bold text-white">
            {summary.initialScore} <span className="text-xs text-purple-400 font-normal">(+{summary.reviewScore} Review)</span>
          </div>
          <div className="text-xs text-slate-400">Total: {summary.finalScore} pts</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] uppercase text-slate-400 font-semibold">Time Taken</div>
          <div className="text-sm font-bold text-cyan-300">
            {minutes}m {seconds}s
          </div>
          <div className="text-xs text-slate-400">Date: {summary.completionDate}</div>
        </div>
      </div>

      {/* Action Buttons Hub (Section XIX requirement: All buttons working) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Actions & Reports
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          {/* Review Answers */}
          <button
            onClick={onReviewAnswers}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition active:scale-95"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Review Answers</span>
          </button>

          {/* Certificate Button */}
          {summary.isEligibleForCertificate ? (
            <button
              onClick={onOpenCertificate}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 border border-amber-500/50 transition active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certificate (≥70%)</span>
            </button>
          ) : (
            <div
              title="Đạt từ 70% trở lên để nhận Giấy chứng nhận"
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-500 text-xs font-semibold flex items-center gap-2 border border-slate-800 cursor-not-allowed opacity-60"
            >
              <Award className="w-4 h-4 text-slate-500" />
              <span>Certificate (Cần ≥70%)</span>
            </div>
          )}

          {/* Copy Parent Feedback */}
          <button
            onClick={onOpenParentFeedback}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition active:scale-95"
          >
            <MessageSquareText className="w-4 h-4 text-emerald-400" />
            <span>Parent Feedback</span>
          </button>

          {/* Teacher Report */}
          <button
            onClick={onOpenTeacherReport}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition active:scale-95"
          >
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>Teacher Report</span>
          </button>

          {/* Print Result */}
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Result</span>
          </button>

          {/* Download Result */}
          <button
            onClick={handleDownloadResult}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          {/* Play Again */}
          <button
            onClick={onPlayAgain}
            className="ml-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-2 transition active:scale-95 shadow-md shadow-cyan-500/25 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
