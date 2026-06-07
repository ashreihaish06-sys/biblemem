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
      className="w-full flex flex-col items-center space-y-4 mb-12"
    >
      <div className="flex flex-col items-center space-y-2 w-full">
        <h2 className="text-xl font-bold text-neutral-100">{stage}단계</h2>
        <button
          onClick={handleStart}
          className="w-full py-3 rounded-2xl bg-neutral-100 text-neutral-900 font-semibold text-lg hover:bg-neutral-300 transition-colors shadow-lg"
        >
          {stage}단계 시작
        </button>
      </div>
      
      <div className="bg-neutral-900 rounded-3xl shadow-xl w-full p-4 border border-neutral-800">
        <div className="grid grid-cols-[repeat(5,minmax(0,1fr))] gap-2 w-full">
          {verses.map((verse) => {
            const isCompleted = !!completedDates[verse.id - 1];
            
            return (
              <div 
                key={verse.id} 
                className={`flex flex-col justify-center items-center aspect-square border-[2px] rounded-[14px] transition-all duration-300
                  ${isCompleted ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-black text-black'}
                `}
              >
                <span className="text-xl font-sans font-bold">{verse.id}</span>
                {isCompleted && <span className="text-[8px] mt-1 opacity-80">{completedDates[verse.id - 1]}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
