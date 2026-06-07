'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Verse } from '@/lib/verses';
import { motion } from 'framer-motion';

interface StageSectionProps {
  stage: number;
  verses: Verse[];
}

export function StageSection({ stage, verses }: StageSectionProps) {
  const router = useRouter();
  const [completedDates, setCompletedDates] = useState<Record<number, string>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCompletedDates = localStorage.getItem('bible-memo-completedDates');
    if (savedCompletedDates) {
      try {
        setCompletedDates(JSON.parse(savedCompletedDates));
      } catch (e) {
        console.error('Failed to load completed dates', e);
      }
    }
  }, []);

  const handleStart = () => {
    // Find the first uncompleted verse in this stage
    const uncompletedVerse = verses.find(verse => !completedDates[verse.id - 1]);
    
    if (uncompletedVerse) {
      router.push(`/memo/${uncompletedVerse.id}`);
    } else {
      // If all are completed, just go to the first one in this stage
      router.push(`/memo/${verses[0].id}`);
    }
  };

  if (!isMounted) {
    return <div className="animate-pulse w-full h-40 bg-neutral-900 rounded-3xl mt-8"></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-3xl shadow-xl p-3 sm:p-4 border border-white flex flex-col items-center space-y-3 overflow-hidden relative"
      style={{
        backgroundImage: `url('/bg-stage${stage}.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <button
        onClick={handleStart}
        className="w-full py-2 rounded-xl bg-white/20 text-white font-semibold text-base hover:bg-white/30 transition-colors shadow-md border border-white/30 backdrop-blur-sm"
      >
        {stage}단계 시작
      </button>
      
      <div className="w-full">
        <div className="grid grid-cols-[repeat(5,minmax(0,1fr))] gap-1.5 w-full">
          {verses.map((verse) => {
            const isCompleted = !!completedDates[verse.id - 1];
            
            return (
              <div 
                key={verse.id} 
                className={`flex flex-col justify-center items-center aspect-[5/4] border-[1px] rounded-[12px] transition-all duration-300 backdrop-blur-sm
                  ${isCompleted ? 'bg-red-500/50 border-red-400/50 text-white' : 'bg-white/10 border-white/30 text-white'}
                `}
              >
                <span className="text-lg font-sans font-bold leading-none">{verse.id}</span>
                {isCompleted && <span className="text-[8px] mt-1 opacity-80">{completedDates[verse.id - 1]}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
