'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { isPass } from '@/lib/similarity';
import { diffChars } from 'diff';

interface STTTestScreenProps {
  originalVerse: string;
  onSuccess: () => void;
  onListeningChange?: (isListening: boolean) => void;
}

export function STTTestScreen({ originalVerse, onSuccess, onListeningChange }: STTTestScreenProps) {
  const { text, isListening, startListening, stopListening, isSupported } = useSpeechRecognition();
  const [feedback, setFeedback] = useState<'none' | 'success' | 'fail'>('none');
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  // 1. 실시간 성공 확인 (말하는 도중에도 일치하면 성공 처리)
  useEffect(() => {
    if (isListening && feedback === 'none') {
      if (isPass(originalVerse, text)) {
        stopListening(); // 성공하면 자동으로 듣기 중지
        setFeedback('success');
        setTimeout(onSuccess, 2000);
      }
    }
  }, [text, isListening, feedback, originalVerse, onSuccess, stopListening]);

  // 2. 수동 종료 시 실패 처리
  useEffect(() => {
    // !isListening이고 feedback이 none인 경우는 사용자가 수동으로 중지했을 때
    if (hasAttempted && !isListening && feedback === 'none') {
      if (isPass(originalVerse, text)) {
        setFeedback('success');
        setTimeout(onSuccess, 2000);
      } else {
        setFeedback('fail');
      }
    }
  }, [isListening, text, feedback, originalVerse, onSuccess, hasAttempted]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setFeedback('none');
      setHasAttempted(true);
      startListening();
    }
  };

  if (!isSupported) {
    return <div className="text-center text-neutral-400">브라우저가 음성 인식을 지원하지 않습니다.</div>;
  }

  const renderTextContent = () => {
    if (isListening || feedback === 'none') {
      return (
        <p className={`leading-relaxed text-neutral-200 font-serif tracking-wide min-h-[3rem] break-keep ${
          originalVerse.length < 40 ? 'text-2xl' : 
          originalVerse.length < 70 ? 'text-xl' : 'text-lg'
        }`}>
          {text || (isListening ? '말씀을 소리 내어 읽어주세요...' : '')}
        </p>
      );
    }

    if (feedback === 'success') {
      return (
        <p className={`leading-relaxed text-orange-200 font-serif tracking-wide min-h-[3rem] break-keep ${
          originalVerse.length < 40 ? 'text-2xl' : 
          originalVerse.length < 70 ? 'text-xl' : 'text-lg'
        }`}>
          {originalVerse}
        </p>
      );
    }

    if (feedback === 'fail') {
      // 띄어쓰기 차이로 인한 과도한 오답 처리를 줄이기 위해 공백 정규화
      const diff = diffChars(originalVerse.replace(/\s+/g, ' '), text.replace(/\s+/g, ' '));
      return (
        <div className="space-y-2">
          <p className="text-xs text-neutral-500">인식된 결과 (틀린 부분은 빨갛게 표시됩니다)</p>
          <p className={`leading-relaxed font-serif tracking-wide min-h-[3rem] break-keep ${
            originalVerse.length < 40 ? 'text-2xl' : 
            originalVerse.length < 70 ? 'text-xl' : 'text-lg'
          }`}>
            {diff.map((part, index) => {
              // 사용자가 말했지만 원문에 없는 내용(오발화)은 제외하고,
              // 원문 기준으로 누락되거나 틀린 부분만 붉은색으로 렌더링
              if (part.added) return null;
              return (
                <span
                  key={index}
                  className={part.removed && part.value.trim() !== '' ? "text-red-400 font-bold font-medium" : "text-neutral-200"}
                >
                  {part.value}
                </span>
              );
            })}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 p-6 space-y-8">
      {/* 성공 시 빛 번짐 효과 및 정답(O) 마크 */}
      <AnimatePresence>
        {feedback === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-orange-500/10 blur-3xl" />
            <motion.svg 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="w-64 h-64 text-orange-500/30 drop-shadow-2xl" 
              viewBox="0 0 100 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeLinecap="round"
            >
              <motion.circle
                cx="50" cy="50" r="40"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 발화 텍스트 및 결과 실시간 렌더링 영역 */}
      <div className="min-h-[120px] w-full max-w-md text-center flex flex-col justify-center">
        {renderTextContent()}
      </div>

      {/* 마이크 애니메이션 */}
      <div className="relative flex items-center justify-center">
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 bg-orange-400/30 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="absolute w-20 h-20 bg-orange-400/40 rounded-full"
            />
          </>
        )}
        
        <button
          onClick={handleToggle}
          className="relative z-10 p-5 rounded-full bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-colors shadow-lg"
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
      </div>
      
      {/* 마이크 사용 안내 문구 */}
      <div className="text-center">
        <p className="text-sm text-neutral-400">
          마이크를 누르면 시작됩니다.
          <br />
          다시 누르면 녹음이 종료됩니다.
        </p>
      </div>

      {/* 피드백 메시지 */}
      <div className="min-h-[2rem] relative z-50">
        <AnimatePresence>
          {feedback === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-orange-300 font-medium text-center text-lg drop-shadow-md"
            >
              정답입니다! 완벽하게 마음에 새겼어요! ✨
            </motion.p>
          )}
          {feedback === 'fail' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-neutral-400 font-medium text-center"
            >
              붉은색 부분을 다시 확인하고 다시 시도해보세요!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
