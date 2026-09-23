import React from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onConfirmStart: () => void;
  onClose?: () => void;
  isPreGameView?: boolean;
}

export const VietnameseInstructionsModal: React.FC<Props> = ({
  isOpen,
  onConfirmStart,
  onClose,
  isPreGameView = true,
}) => {
  if (!isOpen) return null;

  const instructions = [
    'Trò chơi gồm 50 động từ có đuôi ‘-s/-es’.',
    'Em hãy nhấn vào biểu tượng loa bên cạnh từng từ để nghe cách phát âm.',
    'Chú ý lắng nghe âm cuối của mỗi động từ.',
    'Kéo và thả từng thẻ từ vào một trong ba cột: /s/, /ɪz/ hoặc /z/.',
    'Nếu sử dụng điện thoại hoặc máy tính bảng, em có thể chạm vào thẻ từ rồi chạm vào cột muốn chọn.',
    'Em có thể chuyển thẻ sang cột khác trước khi nộp bài.',
    'Tổng thời gian hoàn thành trò chơi là 25 phút.',
    'Mỗi từ được phân loại đúng nhận 10 điểm.',
    'Phân loại sai không bị trừ điểm.',
    'Những từ sai hoặc chưa làm sẽ được chuyển sang Review Round.',
    'Trong Review Round, em được nghe lại từ và nhận gợi ý bằng tiếng Việt.',
    'Đạt từ 70% tổng điểm trở lên, em sẽ nhận được giấy chứng nhận.',
    'Hãy nghe thật kĩ trước khi kéo thả. Chúc em hoàn thành thật tốt!',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-violet-500/30 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.25)] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                HƯỚNG DẪN TRÒ CHƠI
              </h2>
              <p className="text-xs text-violet-300/80">
                S/ES PRONUNCIATION SORTING CHALLENGE
              </p>
            </div>
          </div>
          {!isPreGameView && onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800"
            >
              Đóng
            </button>
          )}
        </div>

        {/* List of 13 rules */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 text-sm">
          {instructions.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-800/80 hover:border-violet-500/30 transition-colors"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold flex items-center justify-center border border-violet-500/40">
                {idx + 1}
              </span>
              <p className="text-slate-200 leading-relaxed text-[13.5px]">
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {isPreGameView ? 'Đồng hồ 15 phút sẽ chỉ bắt đầu tính giờ khi bạn bấm nút này.' : ''}
          </div>
          <button
            onClick={onConfirmStart}
            className="px-6 py-3 text-sm font-bold tracking-wide rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all transform active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>TÔI ĐÃ HIỂU – BẮT ĐẦU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
