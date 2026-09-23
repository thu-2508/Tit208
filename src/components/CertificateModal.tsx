import React, { useRef } from 'react';
import { X, Download, Printer, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { GameSummary } from '../types/game';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  summary: GameSummary;
}

export const CertificateModal: React.FC<Props> = ({ isOpen, onClose, summary }) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Printable view triggers browser print-to-pdf which renders vector fonts perfectly
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] text-slate-100 overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Action Bar (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Award className="w-5 h-5 text-amber-400" />
            <span>CERTIFICATE OF ACHIEVEMENT</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Sheet (Horizontal Landscape layout) */}
        <div
          ref={certRef}
          id="printable-certificate"
          className="p-6 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 text-slate-100 print:bg-white print:text-slate-900"
        >
          {/* Double Ornate Border Frame */}
          <div className="relative p-6 sm:p-8 rounded-2xl border-4 border-double border-amber-400/80 bg-slate-900/60 shadow-inner print:border-amber-600 print:bg-white">
            {/* Corner Filigree Decors */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

            {/* Certificate Content */}
            <div className="text-center space-y-4">
              {/* Institution & App Branding */}
              <div className="space-y-1">
                <div className="text-xs font-black tracking-[0.25em] text-cyan-400 print:text-cyan-700 uppercase">
                  SMART ENGLISH TUTOR
                </div>
                <div className="text-[11px] font-medium text-slate-400 print:text-slate-600">
                  English for Grades 6, 7, 8 and 9
                </div>
              </div>

              {/* Title */}
              <div className="pt-2">
                <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wider text-amber-300 print:text-amber-800 uppercase drop-shadow">
                  CERTIFICATE OF ACHIEVEMENT
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 print:text-slate-600 italic mt-1 font-serif">
                  This certificate is proudly presented to
                </p>
              </div>

              {/* Student Name */}
              <div className="py-2 border-b-2 border-amber-400/50 max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white print:text-slate-950 font-serif tracking-wide uppercase">
                  {summary.student.fullName || 'STUDENT'}
                </h2>
              </div>

              {/* Class & School */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-300 print:text-slate-700 font-medium">
                <div>
                  Class: <strong className="text-amber-300 print:text-amber-800">{summary.student.className || '7A'}</strong>
                </div>
                <span>•</span>
                <div>
                  School: <strong className="text-amber-300 print:text-amber-800">{summary.student.school || 'THCS'}</strong>
                </div>
              </div>

              {/* Activity Name */}
              <div className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 print:text-slate-600">
                <p className="italic">for successfully completing the</p>
                <div className="text-base sm:text-lg font-bold text-cyan-300 print:text-cyan-800 tracking-wide mt-0.5">
                  S/ES PRONUNCIATION SORTING CHALLENGE
                </div>
              </div>

              {/* Achievement Badge Box */}
              <div className="my-4 max-w-lg mx-auto p-4 rounded-xl bg-slate-950/70 border border-amber-500/40 print:bg-slate-50 print:border-slate-300 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Score</div>
                  <div className="text-lg sm:text-xl font-black text-amber-400 print:text-amber-700">
                    {summary.finalScore}/{summary.maxScore}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Percentage</div>
                  <div className="text-lg sm:text-xl font-black text-cyan-400 print:text-cyan-700">
                    {summary.percentage}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Performance</div>
                  <div className="text-sm sm:text-base font-bold text-emerald-400 print:text-emerald-700 truncate">
                    {summary.performanceLevel}
                  </div>
                </div>
              </div>

              {/* Teacher's Evaluation & Remarks on Certificate */}
              <div className="my-3 max-w-xl mx-auto p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/40 print:bg-amber-50/50 print:border-amber-300 text-left space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400 print:text-amber-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Teacher's Evaluation • Nhận xét của giáo viên</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 print:text-cyan-800">
                    {summary.percentage >= 70 ? '★ Đạt chuẩn cấp chứng nhận (≥ 70%)' : ''}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 print:text-slate-900 font-medium italic font-serif">
                  “{summary.teacherCommentVi}”
                </p>
                <p className="text-[11px] text-slate-400 print:text-slate-600 italic">
                  "{summary.teacherCommentEn}"
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-4 flex items-end justify-between px-4 sm:px-12 text-left">
                {/* Date */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-slate-400 print:text-slate-500">Date of Completion</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-200 print:text-slate-800">
                    {summary.completionDate}
                  </div>
                </div>

                {/* 3D Embossed Gold Seal */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 p-1 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-950 print:bg-white flex flex-col items-center justify-center border-2 border-amber-300">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-[8px] font-bold text-amber-300 uppercase">OFFICIAL</span>
                  </div>
                </div>

                {/* Teacher Signature (Strict requirement: Teacher: VŨ THỊ MAI THU) */}
                <div className="text-right space-y-1">
                  <div className="text-xs font-serif italic text-amber-400 print:text-amber-900 font-semibold text-base">
                    Vũ Thị Mai Thu
                  </div>
                  <div className="h-0.5 w-36 bg-amber-400/60 ml-auto" />
                  <div className="text-xs sm:text-sm font-bold text-slate-200 print:text-slate-900">
                    Teacher: VŨ THỊ MAI THU
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
