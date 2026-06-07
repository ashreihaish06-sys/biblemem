'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Verse } from '@/lib/verses';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useRouter } from 'next/navigation';

export function HomeClient({ verses }: { verses: Verse[] }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { isInstallable, installPWA } = usePWAInstall();
  const router = useRouter();

  // 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    setIsMounted(true);

    const savedCompletedDates = localStorage.getItem('bible-memo-completedDates');
    if (savedCompletedDates) {
      try {
        const parsed = JSON.parse(savedCompletedDates);
        setCompletedCount(Object.keys(parsed).length);
      } catch (e) {
        console.error('기록을 불러오는데 실패했습니다.', e);
      }
    }
  }, []);

  const totalCount = verses.length;

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-6 max-w-md mx-auto relative text-center space-y-12 py-12 bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-medium tracking-tight text-neutral-100">
          Bible Memo
        </h1>
        <p className="text-neutral-400 font-serif text-lg">
          말씀을 내 삶에 체화하는 시간
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full flex flex-col items-center space-y-4"
      >
        <div className="flex justify-between w-full px-4 items-end">
          <span className="text-neutral-500 text-sm font-medium">나의 암송 진도</span>
          <span className="text-neutral-300 text-xs font-semibold">{completedCount} / {totalCount} 완료</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6 w-full pt-4"
      >
        <button
          onClick={() => router.push('/manage')}
          className="w-full py-4 rounded-full bg-neutral-100 text-neutral-900 font-semibold text-lg hover:bg-neutral-300 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          시작하겠습니다
        </button>
        {isInstallable && (
          <button
            onClick={installPWA}
            className="w-full py-3 rounded-full bg-orange-500/10 text-orange-400 font-semibold text-sm hover:bg-orange-500/20 transition-colors border border-orange-500/20 mt-2"
          >
            앱서랍에 앱 설치하기
          </button>
        )}
      </motion.div>
    </main>
  );
}
