import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Maximize2,
  Minimize2,
  BookOpen,
  HelpCircle,
  Settings,
  Clock,
  RotateCcw,
  CheckCircle2,
  Inbox,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { VERB_DATABASE, VerbItem, PronunciationGroup } from './data/verbs';
import {
  StudentProfile,
  TeacherSettings,
  GameSummary,
  PerformanceTier,
} from './types/game';
import { soundEffects, speechSystem } from './utils/audio';

import { LoginScreen } from './components/LoginScreen';
import { VietnameseInstructionsModal } from './components/VietnameseInstructionsModal';
import { PronunciationRulesModal } from './components/PronunciationRulesModal';
import { TeacherSetupModal } from './components/TeacherSetupModal';
import { WordCard } from './components/WordCard';
import { DropColumn } from './components/DropColumn';
import { ReviewRound } from './components/ReviewRound';
import { ResultsScreen } from './components/ResultsScreen';
import { CertificateModal } from './components/CertificateModal';
import { ParentFeedbackModal } from './components/ParentFeedbackModal';
import { ReviewAnswersModal } from './components/ReviewAnswersModal';
import { TeacherReportModal } from './components/TeacherReportModal';
import { TutorMascot } from './components/TutorMascot';

const STORAGE_KEY_PROFILE = 'smart_english_tutor_profile';
const STORAGE_KEY_SETTINGS = 'smart_english_tutor_settings';

export default function App() {
  // 1. Student Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return { fullName: '', className: '', school: '' };
  });

  // 2. Teacher Settings
  const [settings, setSettings] = useState<TeacherSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.initialTimeMinutes === 15) {
          parsed.initialTimeMinutes = 25;
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return {
      grade: 'Grade 7',
      wordCount: 50,
      initialTimeMinutes: 25,
      reviewTimeMode: 'fixed_5min',
      showMeaningVi: false,
      listenCompareEnabled: true,
      soundEnabled: true,
      musicEnabled: false,
      shuffled: true,
      selectedVerbIds: VERB_DATABASE.map(v => v.id),
    };
  });

  // Save profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Active Verbs list according to settings
  const [activeVerbs, setActiveVerbs] = useState<VerbItem[]>(() => {
    const list = VERB_DATABASE.filter(v => settings.selectedVerbIds.includes(v.id));
    return [...list].sort(() => Math.random() - 0.5);
  });

  // App Screen
  const [currentScreen, setCurrentScreen] = useState<
    'LOGIN' | 'PLAYING' | 'REVIEW_ROUND' | 'RESULTS'
  >('LOGIN');

  // Modals
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isPreGameInstructions, setIsPreGameInstructions] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isTeacherSetupOpen, setIsTeacherSetupOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isParentFeedbackOpen, setIsParentFeedbackOpen] = useState(false);
  const [isReviewAnswersOpen, setIsReviewAnswersOpen] = useState(false);
  const [isTeacherReportOpen, setIsTeacherReportOpen] = useState(false);

  // Placements in Initial Round: verbId -> group or null (null = in word bank)
  const [userPlacements, setUserPlacements] = useState<
    Record<number, PronunciationGroup | null>
  >({});

  // Mobile / Tap selection
  const [selectedVerb, setSelectedVerb] = useState<VerbItem | null>(null);

  // Card status map for initial submission feedback
  const [cardStatusMap, setCardStatusMap] = useState<
    Record<number, 'normal' | 'placed' | 'correct' | 'incorrect'>
  >({});
  const [isRoundLocked, setIsRoundLocked] = useState(false);

  // Speech and Audio controls
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(settings.listenCompareEnabled);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [musicEnabled, setMusicEnabled] = useState(settings.musicEnabled);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioPlayCounts, setAudioPlayCounts] = useState<Record<number, number>>({});

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(settings.initialTimeMinutes * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Results data
  const [initialScore, setInitialScore] = useState(0);
  const [initialCorrectMap, setInitialCorrectMap] = useState<Record<number, boolean>>({});
  const [reviewPlacements, setReviewPlacements] = useState<
    Record<number, PronunciationGroup | null>
  >({});
  const [reviewCorrectMap, setReviewCorrectMap] = useState<Record<number, boolean>>({});
  const [reviewEarnedScore, setReviewEarnedScore] = useState(0);
  const [summaryData, setSummaryData] = useState<GameSummary | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'info' | 'success' | 'warning' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // Sound sync
  useEffect(() => {
    soundEffects.soundEnabled = soundEnabled;
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const toggleMusic = () => {
    const newState = soundEffects.toggleBackgroundMusic();
    setMusicEnabled(newState);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Timer Countdown logic (Starts strictly on "TÔI ĐÃ HIỂU – BẮT ĐẦU")
  useEffect(() => {
    if (!timerRunning || currentScreen !== 'PLAYING') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimerRunning(false);
          // Auto submit when time is up
          handleAutoSubmitOnTimeout();
          return 0;
        }

        // Section XIV requirements:
        // When 5 minutes remaining (300s):
        if (prev === 300) {
          showToast('5 minutes remaining.', 'warning');
        }
        // When 1 minute remaining (60s):
        if (prev === 60) {
          showToast('1 minute remaining. Check your answers!', 'warning');
        }
        // When 10 seconds remaining:
        if (prev <= 10 && prev > 0) {
          soundEffects.playWarningTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, currentScreen]);

  // Audio Play Counter
  const handleAudioPlayed = (verbId: number) => {
    setAudioPlayCounts(prev => ({
      ...prev,
      [verbId]: (prev[verbId] || 0) + 1,
    }));
  };

  // Keyboard navigation on Playing stage
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (currentScreen !== 'PLAYING' || isRoundLocked) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (selectedVerb) {
        if (e.key === '1') {
          handleDropWord(selectedVerb.id, '/s/');
        } else if (e.key === '2') {
          handleDropWord(selectedVerb.id, '/ɪz/');
        } else if (e.key === '3') {
          handleDropWord(selectedVerb.id, '/z/');
        } else if (e.key === '0' || e.key === 'Escape') {
          handleMoveToBank(selectedVerb.id);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentScreen, selectedVerb, isRoundLocked]);

  // Direct move handler (from WordCard keyboard shortcuts)
  const handleDirectMove = (
    verbId: number,
    target: '/s/' | '/ɪz/' | '/z/' | 'bank'
  ) => {
    if (isRoundLocked) return;
    if (target === 'bank') {
      handleMoveToBank(verbId);
    } else {
      handleDropWord(verbId, target);
    }
  };

  // Action: Start Game flow
  const handleStartGameClick = () => {
    setIsPreGameInstructions(true);
    setIsInstructionsOpen(true);
  };

  // Action: Confirm start from Vietnamese instructions
  const handleConfirmInstructionsStart = () => {
    setIsInstructionsOpen(false);
    setIsPreGameInstructions(false);

    // Initialize/reset board for this session
    setUserPlacements({});
    setCardStatusMap({});
    setIsRoundLocked(false);
    setSelectedVerb(null);
    setTimeLeft(settings.initialTimeMinutes * 60);

    setCurrentScreen('PLAYING');
    setTimerRunning(true);
    showToast('Bắt đầu thử thách! Lắng nghe kĩ âm cuối trước khi phân loại.', 'info');
  };

  // Drop or place word into a column
  const handleDropWord = (verbId: number, targetGroup: PronunciationGroup) => {
    if (isRoundLocked) return;
    setUserPlacements(prev => ({
      ...prev,
      [verbId]: targetGroup,
    }));
    // If it was selected via tap, deselect it
    if (selectedVerb?.id === verbId) {
      setSelectedVerb(null);
    }
  };

  // Move word back to word bank
  const handleMoveToBank = (verbId: number) => {
    if (isRoundLocked) return;
    setUserPlacements(prev => ({
      ...prev,
      [verbId]: null,
    }));
    if (selectedVerb?.id === verbId) {
      setSelectedVerb(null);
    }
  };

  // Reset words with confirmation (Section XVI requirement)
  const handleResetWords = () => {
    if (isRoundLocked) return;
    const confirmed = window.confirm('Are you sure you want to reset all words?');
    if (confirmed) {
      setUserPlacements({});
      setSelectedVerb(null);
      showToast('Toàn bộ thẻ đã được đưa về Word Bank.', 'info');
    }
  };

  // Words filtering for the 3 columns and Word Bank
  const wordsInBank = useMemo(() => {
    return activeVerbs.filter(v => !userPlacements[v.id]);
  }, [activeVerbs, userPlacements]);

  const wordsInS = useMemo(() => {
    return activeVerbs.filter(v => userPlacements[v.id] === '/s/');
  }, [activeVerbs, userPlacements]);

  const wordsInIz = useMemo(() => {
    return activeVerbs.filter(v => userPlacements[v.id] === '/ɪz/');
  }, [activeVerbs, userPlacements]);

  const wordsInZ = useMemo(() => {
    return activeVerbs.filter(v => userPlacements[v.id] === '/z/');
  }, [activeVerbs, userPlacements]);

  const placedCount = activeVerbs.length - wordsInBank.length;
  const remainingCount = wordsInBank.length;

  // Check answers validation and evaluation
  const handleCheckAnswers = () => {
    if (isRoundLocked) return;

    // Check if there are verbs still remaining in the Word Bank
    if (remainingCount > 0) {
      const confirmEarlySubmit = window.confirm(
        `Em vẫn còn ${remainingCount} từ trong Word Bank chưa xếp. Em có muốn nộp bài luôn không?\n(Các từ chưa xếp sẽ tính 0 điểm và được chuyển vào vòng ôn tập Review Round)`
      );
      if (!confirmEarlySubmit) return;
    }

    evaluateRound();
  };

  const handleAutoSubmitOnTimeout = () => {
    showToast('Hết giờ! Hệ thống đang tự động chấm bài...', 'warning');
    evaluateRound();
  };

  const evaluateRound = () => {
    setIsRoundLocked(true);
    setTimerRunning(false);

    let earned = 0;
    const correctMap: Record<number, boolean> = {};
    const newStatusMap: Record<number, 'correct' | 'incorrect'> = {};
    const wrongList: VerbItem[] = [];

    activeVerbs.forEach(verb => {
      const placed = userPlacements[verb.id];
      const isCorrect = placed === verb.correctGroup;
      correctMap[verb.id] = isCorrect;

      if (isCorrect) {
        earned += 10;
        newStatusMap[verb.id] = 'correct';
      } else {
        newStatusMap[verb.id] = 'incorrect';
        wrongList.push(verb);
      }
    });

    setInitialScore(earned);
    setInitialCorrectMap(correctMap);
    setCardStatusMap(newStatusMap);

    if (wrongList.length === 0) {
      // 100% perfect!
      soundEffects.playCorrect();
      confetti({ particleCount: 100, spread: 80 });
      showToast('Perfect pronunciation! Tuyệt đối chính xác!', 'success');
      setTimeout(() => {
        finalizeSummary(earned, 0, {}, {});
      }, 1600);
    } else {
      soundEffects.playIncorrect();
      showToast('You have some verbs to review. Let’s try them again!', 'info');
      // Delay slightly so student sees checkmarks/red borders, then transition to Review Round
      setTimeout(() => {
        setCurrentScreen('REVIEW_ROUND');
      }, 2000);
    }
  };

  // Review Round completion callback
  const handleFinishReview = (
    revPlacements: Record<number, PronunciationGroup | null>,
    revCorrectMap: Record<number, boolean>,
    revEarned: number
  ) => {
    setReviewPlacements(revPlacements);
    setReviewCorrectMap(revCorrectMap);
    setReviewEarnedScore(revEarned);

    finalizeSummary(initialScore, revEarned, revPlacements, revCorrectMap);
  };

  // Finalize full game summary
  const finalizeSummary = (
    initScore: number,
    revScore: number,
    revPlacements: Record<number, PronunciationGroup | null>,
    revCorrectMap: Record<number, boolean>
  ) => {
    const finalScore = initScore + revScore;
    const maxScore = activeVerbs.length * 10;
    const percentage = Math.round((finalScore / maxScore) * 100);

    let performanceLevel: PerformanceTier = 'More Practice Needed';
    if (percentage >= 90) performanceLevel = 'Outstanding';
    else if (percentage >= 80) performanceLevel = 'Excellent';
    else if (percentage >= 70) performanceLevel = 'Good';
    else if (percentage >= 50) performanceLevel = 'Keep Practising';

    // Calculate group stats
    const sVerbs = activeVerbs.filter(v => v.correctGroup === '/s/');
    const izVerbs = activeVerbs.filter(v => v.correctGroup === '/ɪz/');
    const zVerbs = activeVerbs.filter(v => v.correctGroup === '/z/');

    const getFinalCorrect = (verbId: number) => {
      return initialCorrectMap[verbId] || revCorrectMap[verbId] || false;
    };

    const sCorrect = sVerbs.filter(v => getFinalCorrect(v.id)).length;
    const izCorrect = izVerbs.filter(v => getFinalCorrect(v.id)).length;
    const zCorrect = zVerbs.filter(v => getFinalCorrect(v.id)).length;

    const sRate = sVerbs.length ? sCorrect / sVerbs.length : 0;
    const izRate = izVerbs.length ? izCorrect / izVerbs.length : 0;
    const zRate = zVerbs.length ? zCorrect / zVerbs.length : 0;

    const groupRates = [
      { group: '/s/' as PronunciationGroup, rate: sRate },
      { group: '/ɪz/' as PronunciationGroup, rate: izRate },
      { group: '/z/' as PronunciationGroup, rate: zRate },
    ];
    groupRates.sort((a, b) => a.rate - b.rate);

    const weakestGroup = groupRates[0].group;
    const strongestGroup = groupRates[groupRates.length - 1].group;

    const totalUsedTime = settings.initialTimeMinutes * 60 - timeLeft;

    // Certificate eligibility: >= 70%
    const isEligibleForCertificate = percentage >= 70;

    // Pedagogical comments tailored to student score
    let teacherCommentVi = '';
    let teacherCommentEn = '';

    if (percentage >= 90) {
      teacherCommentVi = `Xuất sắc! Em phát âm và phân loại cực kỳ chính xác các âm đuôi '-s/-es' (${percentage}%). Nắm rất vững các quy tắc ngữ âm. Cô khen ngợi tinh thần học tập tuyệt vời của em!`;
      teacherCommentEn = `Outstanding! Exceptional mastery of the '-s/-es' pronunciation rules with ${percentage}% accuracy. Excellent phonetic precision!`;
    } else if (percentage >= 80) {
      teacherCommentVi = `Rất tốt! Em đã phân loại đúng hầu hết các từ (${percentage}%). Em nắm vững quy tắc cơ bản; hãy chú ý thêm nhóm âm ${weakestGroup} để đạt kết quả hoàn hảo nhé.`;
      teacherCommentEn = `Very good! High accuracy (${percentage}%) across pronunciation groups. Keep sharpening your focus on group ${weakestGroup}!`;
    } else if (percentage >= 70) {
      teacherCommentVi = `Khá tốt! Em đạt ${percentage}%, đủ điều kiện nhận Giấy chứng nhận hoàn thành thử thách. Hãy tiếp tục luyện nghe và luyện nói thêm ở nhóm âm ${weakestGroup} nhé!`;
      teacherCommentEn = `Good job! Reached ${percentage}% and qualified for the Certificate of Achievement. Keep practicing the ${weakestGroup} ending sound!`;
    } else if (percentage >= 50) {
      teacherCommentVi = `Em đã có nhiều cố gắng (${percentage}%). Để đạt Giấy chứng nhận (từ 70% trở lên), em hãy ôn lại bảng quy tắc phát âm và thử sức lại nhé!`;
      teacherCommentEn = `Good effort (${percentage}%). Please review the pronunciation guidelines and practice again to qualify for the certificate (≥ 70%).`;
    } else {
      teacherCommentVi = `Em cần rèn luyện thêm về cách nhận biết âm vô thanh và âm hữu thanh trước khi thêm '-s/-es' (${percentage}%). Hãy nghe kĩ loa mẫu và thử lại nhé!`;
      teacherCommentEn = `More practice needed (${percentage}%). Listen carefully to the audio samples and review the phonetic rules. You can do it!`;
    }

    const summary: GameSummary = {
      student: profile,
      activeVerbs,
      initialPlacements: userPlacements,
      initialCorrectMap,
      reviewPlacements: revPlacements,
      reviewCorrectMap: revCorrectMap,
      audioPlayCounts,
      timeUsedSeconds: Math.max(totalUsedTime, 1),
      initialScore: initScore,
      reviewScore: revScore,
      finalScore,
      maxScore,
      percentage,
      completionDate: new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      performanceLevel,
      sGroupStats: { correct: sCorrect, total: sVerbs.length },
      izGroupStats: { correct: izCorrect, total: izVerbs.length },
      zGroupStats: { correct: zCorrect, total: zVerbs.length },
      weakestGroup,
      strongestGroup,
      teacherCommentVi,
      teacherCommentEn,
      isEligibleForCertificate,
    };

    setSummaryData(summary);
    setCurrentScreen('RESULTS');
  };

  // Play Again: Retains profile, resets scores and words
  const handlePlayAgain = () => {
    setUserPlacements({});
    setCardStatusMap({});
    setIsRoundLocked(false);
    setSelectedVerb(null);
    setInitialScore(0);
    setInitialCorrectMap({});
    setReviewPlacements({});
    setReviewCorrectMap({});
    setReviewEarnedScore(0);
    setTimeLeft(settings.initialTimeMinutes * 60);

    // Shuffle verbs again
    const list = VERB_DATABASE.filter(v => settings.selectedVerbIds.includes(v.id));
    setActiveVerbs([...list].sort(() => Math.random() - 0.5));

    setCurrentScreen('PLAYING');
    setTimerRunning(true);
    showToast('New game session started! Good luck!', 'info');
  };

  // Clear data
  const handleClearData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear your saved student profile on this browser?'
    );
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      setProfile({ fullName: '', className: '', school: '' });
      showToast('Profile data cleared successfully.', 'info');
    }
  };

  // Save Settings from Teacher Setup
  const handleSaveTeacherSettings = (
    newSettings: TeacherSettings,
    startNewGame: boolean
  ) => {
    setSettings(newSettings);
    setIsCompareMode(newSettings.listenCompareEnabled);
    setSoundEnabled(newSettings.soundEnabled);
    setMusicEnabled(newSettings.musicEnabled);

    const list = VERB_DATABASE.filter(v => newSettings.selectedVerbIds.includes(v.id));
    setActiveVerbs(
      newSettings.shuffled ? [...list].sort(() => Math.random() - 0.5) : list
    );

    if (startNewGame) {
      setUserPlacements({});
      setCardStatusMap({});
      setIsRoundLocked(false);
      setSelectedVerb(null);
      setTimeLeft(newSettings.initialTimeMinutes * 60);
      setCurrentScreen('PLAYING');
      setTimerRunning(true);
      showToast('Configuration applied and new session started!', 'success');
    } else {
      showToast('Teacher settings saved successfully.', 'success');
    }
  };

  // Incorrect verbs list for Review Round
  const incorrectVerbsForReview = useMemo(() => {
    return activeVerbs.filter(v => !initialCorrectMap[v.id]);
  }, [activeVerbs, initialCorrectMap]);

  // Format timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] animate-fadeIn pointer-events-none">
          <div
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-500/80 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : toastMessage.type === 'warning'
                ? 'bg-amber-900/90 border-amber-500/80 text-amber-100 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
                : toastMessage.type === 'error'
                ? 'bg-rose-900/90 border-rose-500/80 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.5)]'
                : 'bg-slate-900/90 border-cyan-500/80 text-cyan-100 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Global Top Bar (Complies strictly with the 3-zone contract) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between print:hidden">
        {/* Zone 1: Single text element brand mark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentScreen !== 'LOGIN') {
                const conf = window.confirm('Return to main menu?');
                if (conf) {
                  setTimerRunning(false);
                  setCurrentScreen('LOGIN');
                }
              }
            }}
            className="text-left group cursor-pointer"
          >
            <span className="text-base sm:text-lg font-black tracking-wider text-white group-hover:text-cyan-400 transition-colors uppercase whitespace-nowrap">
              SMART ENGLISH TUTOR
            </span>
          </button>
          <span className="hidden md:inline-block text-xs font-medium text-slate-500">
            • Teacher: VŨ THỊ MAI THU
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <button
            onClick={() => setIsInstructionsOpen(true)}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
            <span>Instructions</span>
          </button>

          <button
            onClick={() => setIsRulesOpen(true)}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Phonetic Rules</span>
          </button>

          <button
            onClick={() => setIsTeacherSetupOpen(true)}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Teacher Setup</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Media Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 transition cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Music toggle */}
          <button
            onClick={toggleMusic}
            title={musicEnabled ? 'Stop music' : 'Play ambient study music'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 transition cursor-pointer"
          >
            <Music
              className={`w-4 h-4 ${
                musicEnabled ? 'text-purple-400 animate-pulse' : 'text-slate-500'
              }`}
            />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle fullscreen"
            className="hidden sm:inline-flex p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500 transition cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-amber-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col">
        {/* Screen 1: Login / Welcome Screen */}
        {currentScreen === 'LOGIN' && (
          <LoginScreen
            profile={profile}
            onChangeProfile={updated => setProfile(prev => ({ ...prev, ...updated }))}
            onStartGame={handleStartGameClick}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenInstructions={() => {
              setIsPreGameInstructions(false);
              setIsInstructionsOpen(true);
            }}
            onOpenTeacherSetup={() => setIsTeacherSetupOpen(true)}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            musicEnabled={musicEnabled}
            onToggleMusic={toggleMusic}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onClearData={handleClearData}
          />
        )}

        {/* Screen 2: Interactive Playing Stage */}
        {currentScreen === 'PLAYING' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Live Stats Header Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
              {/* Left: Timer & Warning State */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border tabular-nums transition-all ${
                    timeLeft <= 60
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      : timeLeft <= 300
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-700 text-cyan-300'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-base sm:text-lg font-black">{timeFormatted}</span>
                </div>

                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-white">
                    {profile.fullName || 'Student'} ({profile.className ? `Class ${profile.className}` : 'Class 7'})
                  </div>
                  <div className="text-slate-400 text-[11px] truncate max-w-[180px]">
                    {profile.school || 'Secondary School'}
                  </div>
                </div>
              </div>

              {/* Center: Live Stats Counters */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Words Placed</div>
                  <div className="text-base font-black text-cyan-400 tabular-nums">
                    {placedCount} / {activeVerbs.length}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Remaining</div>
                  <div className="text-base font-black text-amber-400 tabular-nums">
                    {remainingCount}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Max Score</div>
                  <div className="text-base font-black text-emerald-400 tabular-nums">
                    {activeVerbs.length * 10}
                  </div>
                </div>
              </div>

              {/* Right: Controls (Listen & Compare, Slow, Check Answers, Reset) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSlowMode(prev => !prev)}
                  title="Audio playback speed: Normal / Slow"
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    isSlowMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Slow: {isSlowMode ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setIsCompareMode(prev => !prev)}
                  title="Listen and compare base verb with inflected -s/-es form"
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition hidden md:inline-flex cursor-pointer ${
                    isCompareMode
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Listen & Compare
                </button>

                <button
                  onClick={handleResetWords}
                  title="Return all cards back to Word Bank"
                  className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-rose-300 border border-slate-800 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleCheckAnswers}
                  disabled={isRoundLocked}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer ${
                    remainingCount === 0 && !isRoundLocked
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 ring-2 ring-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.6)] animate-pulse'
                      : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/50'
                  }`}
                  title={
                    remainingCount === 0
                      ? 'Đã xếp xong tất cả các từ! Bấm để nộp bài'
                      : `Còn ${remainingCount} từ chưa xếp trong Word Bank. Bấm để nộp bài sớm.`
                  }
                >
                  <CheckCircle2 className="w-4 h-4 font-black" />
                  <span>
                    {remainingCount === 0 ? 'NỘP BÀI (SUBMIT)' : `Nộp bài (${remainingCount} từ)`}
                  </span>
                </button>
              </div>
            </div>

            {/* Smart Mascot Helper */}
            <TutorMascot
              tip={
                selectedVerb
                  ? `Selected card: “${selectedVerb.word}”. Tap one of the 3 columns (/s/, /ɪz/, or /z/) below to place it.`
                  : isCompareMode
                  ? 'Listen & Compare mode is ON: Listen carefully to the base verb followed by the -s/-es ending!'
                  : 'Drag and drop cards, or tap a card and tap a column. Keys 1, 2, 3 on your keyboard also work!'
              }
              compact
            />

            {/* Word Bank Container */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Word Bank ({wordsInBank.length} verbs remaining)
                  </h3>
                </div>
                {selectedVerb && (
                  <button
                    onClick={() => setSelectedVerb(null)}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Deselect card
                  </button>
                )}
              </div>

              {/* Word Bank Cards Grid */}
              <div className="max-h-44 sm:max-h-52 overflow-y-auto custom-scrollbar p-1">
                {wordsInBank.length === 0 ? (
                  <div className="py-6 px-4 text-center bg-emerald-950/30 rounded-2xl border-2 border-dashed border-emerald-500/50 space-y-3">
                    <div className="text-sm sm:text-base text-emerald-300 font-extrabold flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                      <span>Tuyệt vời! Em đã hoàn thành xếp tất cả {activeVerbs.length} động từ vào 3 cột.</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Hãy rà soát lại nếu cần, sau đó bấm <strong>NỘP BÀI</strong> để xem kết quả, nhận xét và cấp Giấy chứng nhận!
                    </p>
                    <button
                      onClick={handleCheckAnswers}
                      disabled={isRoundLocked}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm tracking-wider shadow-[0_0_30px_rgba(52,211,153,0.5)] transform hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 fill-slate-950 text-emerald-500" />
                      <span>NỘP BÀI NGAY (SUBMIT)</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {wordsInBank.map(verb => (
                      <WordCard
                        key={verb.id}
                        verb={verb}
                        isSelected={selectedVerb?.id === verb.id}
                        onSelect={v => {
                          if (selectedVerb?.id === v.id) {
                            setSelectedVerb(null);
                          } else {
                            setSelectedVerb(v);
                          }
                        }}
                        status="normal"
                        isSlowMode={isSlowMode}
                        isCompareMode={isCompareMode}
                        isLocked={isRoundLocked}
                        showMeaning={settings.showMeaningVi}
                        onAudioPlayed={handleAudioPlayed}
                        onDirectMove={handleDirectMove}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Three Pronunciation Drop Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Column 1: /s/ */}
              <DropColumn
                group="/s/"
                title="Group /s/"
                subHint="Voiceless ending (/p/, /t/, /k/, /f/, /θ/)"
                colorTheme="cyan"
                words={wordsInS}
                selectedVerb={selectedVerb}
                onDropWord={handleDropWord}
                onSelectWord={v => {
                  if (selectedVerb?.id === v.id) {
                    setSelectedVerb(null);
                  } else {
                    setSelectedVerb(v);
                  }
                }}
                isCompareMode={isCompareMode}
                isSlowMode={isSlowMode}
                isLocked={isRoundLocked}
                showMeaning={settings.showMeaningVi}
                cardStatusMap={cardStatusMap}
                onAudioPlayed={handleAudioPlayed}
                onDirectMove={handleDirectMove}
              />

              {/* Column 2: /ɪz/ */}
              <DropColumn
                group="/ɪz/"
                title="Group /ɪz/"
                subHint="Extra syllable (/s/, /z/, /ʃ/, /ʒ/, /tʃ/, /dʒ/)"
                colorTheme="purple"
                words={wordsInIz}
                selectedVerb={selectedVerb}
                onDropWord={handleDropWord}
                onSelectWord={v => {
                  if (selectedVerb?.id === v.id) {
                    setSelectedVerb(null);
                  } else {
                    setSelectedVerb(v);
                  }
                }}
                isCompareMode={isCompareMode}
                isSlowMode={isSlowMode}
                isLocked={isRoundLocked}
                showMeaning={settings.showMeaningVi}
                cardStatusMap={cardStatusMap}
                onAudioPlayed={handleAudioPlayed}
                onDirectMove={handleDirectMove}
              />

              {/* Column 3: /z/ */}
              <DropColumn
                group="/z/"
                title="Group /z/"
                subHint="Voiced ending (vowels & remaining voiced)"
                colorTheme="emerald"
                words={wordsInZ}
                selectedVerb={selectedVerb}
                onDropWord={handleDropWord}
                onSelectWord={v => {
                  if (selectedVerb?.id === v.id) {
                    setSelectedVerb(null);
                  } else {
                    setSelectedVerb(v);
                  }
                }}
                isCompareMode={isCompareMode}
                isSlowMode={isSlowMode}
                isLocked={isRoundLocked}
                showMeaning={settings.showMeaningVi}
                cardStatusMap={cardStatusMap}
                onAudioPlayed={handleAudioPlayed}
                onDirectMove={handleDirectMove}
              />
            </div>

            {/* Dedicated Bottom Submission Bar when finished or in progress */}
            <div
              className={`p-4 rounded-2xl border backdrop-blur-md transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                remainingCount === 0
                  ? 'bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                    remainingCount === 0
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {placedCount}/{activeVerbs.length}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>
                      {remainingCount === 0
                        ? '🎉 Đã hoàn thành xếp tất cả các động từ!'
                        : `Tiến độ: Đã xếp ${placedCount}/${activeVerbs.length} từ`}
                    </span>
                    {remainingCount === 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                        Sẵn sàng nộp
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {remainingCount === 0
                      ? 'Nhấn nút Nộp bài để hoàn tất thử thách và xem đánh giá của giáo viên.'
                      : `Còn ${remainingCount} từ trong Word Bank. Em có thể nộp bất cứ lúc nào.`}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckAnswers}
                disabled={isRoundLocked}
                className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                  remainingCount === 0
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 ring-2 ring-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.5)] transform hover:scale-102'
                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>NỘP BÀI (SUBMIT)</span>
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: Review Round */}
        {currentScreen === 'REVIEW_ROUND' && (
          <ReviewRound
            reviewVerbs={incorrectVerbsForReview}
            initialScore={initialScore}
            maxScore={activeVerbs.length * 10}
            timeMode={settings.reviewTimeMode}
            isCompareMode={isCompareMode}
            onFinishReview={handleFinishReview}
          />
        )}

        {/* Screen 4: Results Screen */}
        {currentScreen === 'RESULTS' && summaryData && (
          <ResultsScreen
            summary={summaryData}
            onReviewAnswers={() => setIsReviewAnswersOpen(true)}
            onPlayAgain={handlePlayAgain}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            onOpenParentFeedback={() => setIsParentFeedbackOpen(true)}
            onOpenTeacherReport={() => setIsTeacherReportOpen(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      <VietnameseInstructionsModal
        isOpen={isInstructionsOpen}
        onConfirmStart={handleConfirmInstructionsStart}
        onClose={() => setIsInstructionsOpen(false)}
        isPreGameView={isPreGameInstructions}
      />

      <PronunciationRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <TeacherSetupModal
        isOpen={isTeacherSetupOpen}
        onClose={() => setIsTeacherSetupOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveTeacherSettings}
      />

      {summaryData && (
        <>
          <CertificateModal
            isOpen={isCertificateOpen}
            onClose={() => setIsCertificateOpen(false)}
            summary={summaryData}
          />

          <ParentFeedbackModal
            isOpen={isParentFeedbackOpen}
            onClose={() => setIsParentFeedbackOpen(false)}
            summary={summaryData}
          />

          <ReviewAnswersModal
            isOpen={isReviewAnswersOpen}
            onClose={() => setIsReviewAnswersOpen(false)}
            summary={summaryData}
          />

          <TeacherReportModal
            isOpen={isTeacherReportOpen}
            onClose={() => setIsTeacherReportOpen(false)}
            summary={summaryData}
          />
        </>
      )}
    </div>
  );
}
