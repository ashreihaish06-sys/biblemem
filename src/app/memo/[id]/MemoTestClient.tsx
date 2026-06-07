'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STTTestScreen } from '@/components/memorize/STTTestScreen';
import { Verse } from '@/lib/verses';
import { motion } from 'framer-motion';

interface MemoTestClientProps {
  verse: Verse;
  totalCount: number;
}

export function MemoTestClient({ verse, totalCount }: MemoTestClientProps) {
  const router = useRouter();
  const [isMicActive, setIsMicActive] = useState(false);

  const handleSuccess = () => {
    // 저장 (기존 하위 호환성을 위해 verse.id - 1 을 키로 사용)
    const date = new Date();
    const formattedDate = `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    
    const saved = localStorage.getItem('bible-memo-completedDates');
    const completedDates = saved ? JSON.parse(saved) : {};
    completedDates[verse.id - 1] = formattedDate;
    localStorage.setItem('bible-memo-completedDates', JSON.stringify(completedDates));

    // 라우팅 (다음 구절로 이동. 만약 단계 마지막이면 홈으로)
    if (verse.id % 10 === 0 || verse.id >= totalCount) {
      router.push('/manage');
    } else {
      router.push(`/memo/${verse.id + 1}`);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative p-6 bg-black overflow-hidden min-h-[100dvh]">
      <button 
        onClick={() => router.push('/manage')}
        className="absolute top-6 left-6 text-neutral-500 hover:text-neutral-300 transition-colors z-50 flex items-center"
      >
        ← 목록으로
      </button>
      
      <div className="shrink-0 w-full p-6 mt-16 mb-2 rounded-2xl bg-neutral-900 border border-neutral-800 text-center relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-1 bg-orange-500/50 h-full" />
        <p className="text-orange-400/80 text-xs font-semibold tracking-widest mb-3">
          STEP {verse.id}
        </p>
        <motion.p 
          animate={{ opacity: isMicActive ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className={`text-neutral-200 font-serif leading-relaxed mb-4 break-keep ${
            verse.text.length < 40 ? 'text-2xl' : 
            verse.text.length < 70 ? 'text-xl' : 'text-lg'
          }`}
        >
          "{verse.text}"
        </motion.p>
        <p className="text-neutral-500 text-sm">
          - {verse.reference} -
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <STTTestScreen 
          originalVerse={verse.text} 
          onListeningChange={setIsMicActive}
          onSuccess={handleSuccess} 
        />
      </div>
    </div>
  );
}
