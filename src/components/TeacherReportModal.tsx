import React from 'react';
import { X, Printer, Download, FileSpreadsheet, UserCheck, Clock, Award, BarChart3 } from 'lucide-react';
import { GameSummary } from '../types/game';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  summary: GameSummary;
}

export const TeacherReportModal: React.FC<Props> = ({ isOpen, onClose, summary }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Verb', 'Base Verb', 'Student Choice', 'Correct Sound', 'Base Final Sound', 'Result', 'Audio Plays'];
    const rows = summary.activeVerbs.map((v, i) => {
      const choice = summary.reviewPlacements[v.id] || summary.initialPlacements[v.id] || 'None';
      const isCorrect = summary.initialCorrectMap[v.id] || summary.reviewCorrectMap[v.id];
      const plays = summary.audioPlayCounts[v.id] || 0;
      return [
        i + 1,
        `"${v.word}"`,
        `"${v.base}"`,
        `"${choice}"`,
        `"${v.correctGroup}"`,
        `"${v.baseFinalSound}"`,
        isCorrect ? 'Correct' : 'Incorrect',
        plays,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Teacher_Report_${summary.student.fullName.replace(/\s+/g, '_') || 'Student'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const minutes = Math.floor(summary.timeUsedSeconds / 60);
  const seconds = summary.timeUsedSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl text-slate-100 overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 print:border-b-2 print:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white print:text-slate-950 tracking-wide flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400 print:text-cyan-800" />
              <span>TEACHER REPORT</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              Teacher in charge: <strong className="text-cyan-300 print:text-slate-900">VŨ THỊ MAI THU</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Student & Session Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <div className="text-[11px] text-slate-400 print:text-slate-500 uppercase font-semibold">Student</div>
              <div className="text-base font-black text-white print:text-slate-900 truncate">
                {summary.student.fullName || 'Not provided'}
              </div>
              <div className="text-xs text-slate-400 print:text-slate-600">
                Class {summary.student.className} • {summary.student.school}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <div className="text-[11px] text-slate-400 print:text-slate-500 uppercase font-semibold">Time Taken</div>
              <div className="text-base font-black text-cyan-400 print:text-cyan-800">
                {minutes}m {seconds}s
              </div>
              <div className="text-xs text-slate-400 print:text-slate-600">
                Date: {summary.completionDate}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <div className="text-[11px] text-slate-400 print:text-slate-500 uppercase font-semibold">Total Score</div>
              <div className="text-base font-black text-amber-400 print:text-amber-800">
                {summary.finalScore} / {summary.maxScore}
              </div>
              <div className="text-xs text-slate-400 print:text-slate-600">
                Accuracy: {summary.percentage}% ({summary.performanceLevel})
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <div className="text-[11px] text-slate-400 print:text-slate-500 uppercase font-semibold">Needs Practice</div>
              <div className="text-base font-black text-rose-400 print:text-rose-800 font-mono">
                Group {summary.weakestGroup}
              </div>
              <div className="text-xs text-slate-400 print:text-slate-600">
                Best: {summary.strongestGroup}
              </div>
            </div>
          </div>

          {/* Performance Breakdown by Pronunciation Group */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 print:border-slate-300 space-y-3">
            <h3 className="font-bold text-white print:text-slate-900 text-sm">
              Accuracy Rate by Pronunciation Group:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex justify-between items-center mb-1 font-bold text-cyan-300">
                  <span>Group /s/ (Voiceless)</span>
                  <span>{summary.sGroupStats.correct}/{summary.sGroupStats.total}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-cyan-400 h-2 rounded-full"
                    style={{
                      width: `${summary.sGroupStats.total > 0 ? (summary.sGroupStats.correct / summary.sGroupStats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  Incorrect: {summary.sGroupStats.total - summary.sGroupStats.correct} words
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
                <div className="flex justify-between items-center mb-1 font-bold text-purple-300">
                  <span>Group /ɪz/ (Extra Syllable)</span>
                  <span>{summary.izGroupStats.correct}/{summary.izGroupStats.total}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-purple-400 h-2 rounded-full"
                    style={{
                      width: `${summary.izGroupStats.total > 0 ? (summary.izGroupStats.correct / summary.izGroupStats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  Incorrect: {summary.izGroupStats.total - summary.izGroupStats.correct} words
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="flex justify-between items-center mb-1 font-bold text-emerald-300">
                  <span>Group /z/ (Voiced)</span>
                  <span>{summary.zGroupStats.correct}/{summary.zGroupStats.total}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-emerald-400 h-2 rounded-full"
                    style={{
                      width: `${summary.zGroupStats.total > 0 ? (summary.zGroupStats.correct / summary.zGroupStats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  Incorrect: {summary.zGroupStats.total - summary.zGroupStats.correct} words
                </div>
              </div>
            </div>
          </div>

          {/* Teacher's Pedagogical Assessment & Certificate Status */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 print:bg-slate-50 print:border-slate-300 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 print:text-amber-800 uppercase tracking-wider text-[11px]">
                Teacher's Evaluation & Assessment • Nhận xét đánh giá
              </span>
              <span className="font-bold text-cyan-300 print:text-cyan-800 font-mono">
                {summary.isEligibleForCertificate
                  ? '✓ Đạt chuẩn cấp giấy chứng nhận (≥ 70%)'
                  : 'Chưa đủ điều kiện cấp chứng nhận (< 70%)'}
              </span>
            </div>
            <p className="text-slate-200 print:text-slate-900 font-medium italic">
              “{summary.teacherCommentVi}”
            </p>
            <p className="text-slate-400 print:text-slate-600 italic">
              "{summary.teacherCommentEn}"
            </p>
          </div>

          {/* Student Detailed Performance Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-white print:text-slate-900 text-sm">
              Detailed Question Breakdown & Audio Play Counts:
            </h3>
            <div className="overflow-x-auto border border-slate-800 print:border-slate-300 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Verb</th>
                    <th className="p-2.5">Base Form</th>
                    <th className="p-2.5">Base Final Sound</th>
                    <th className="p-2.5">Correct Group</th>
                    <th className="p-2.5">Round 1</th>
                    <th className="p-2.5">Review Round</th>
                    <th className="p-2.5">Result</th>
                    <th className="p-2.5 text-center">Audio Plays</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {summary.activeVerbs.map((v, i) => {
                    const initChoice = summary.initialPlacements[v.id] || 'Unanswered';
                    const revChoice = summary.reviewPlacements[v.id];
                    const isFinalCorrect = summary.initialCorrectMap[v.id] || summary.reviewCorrectMap[v.id];
                    const plays = summary.audioPlayCounts[v.id] || 0;

                    return (
                      <tr key={v.id} className="hover:bg-slate-850/50 print:hover:bg-transparent">
                        <td className="p-2.5 text-slate-500">{i + 1}</td>
                        <td className="p-2.5 font-bold text-white print:text-slate-900">{v.word}</td>
                        <td className="p-2.5 text-cyan-300 print:text-cyan-800">{v.base}</td>
                        <td className="p-2.5 text-slate-400 font-mono">{v.baseFinalSound}</td>
                        <td className="p-2.5 font-black text-amber-400 print:text-amber-800 font-mono">{v.correctGroup}</td>
                        <td className="p-2.5 font-mono">{initChoice}</td>
                        <td className="p-2.5 font-mono text-purple-300 print:text-purple-800">{revChoice || '—'}</td>
                        <td className="p-2.5">
                          {isFinalCorrect ? (
                            <span className="text-emerald-400 font-bold">Correct</span>
                          ) : (
                            <span className="text-rose-400 font-bold">Incorrect</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-mono">{plays}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
