'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SteppingStoneProps {
  index: number;
  status: 'locked' | 'in_progress' | 'completed';
  onClick?: () => void;
}

export function SteppingStone({ index, status, onClick }: SteppingStoneProps) {
  const isCompleted = status === 'completed';
  const isActive = status === 'in_progress';

  return (
    <motion.button
      onClick={status !== 'locked' ? onClick : undefined}
      className={cn(
        "relative flex items-center justify-center w-16 h-16 rounded-full mx-auto transition-colors z-10",
        status === 'locked' && "bg-neutral-800/50 cursor-not-allowed",
        isActive && "bg-neutral-700 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
        isCompleted && "bg-neutral-900"
      )}
      whileHover={status !== 'locked' ? { scale: 1.05 } : {}}
      whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
    >
      {/* 불이 켜지거나 잎사귀가 돋아나는 애니메이션 효과 */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-orange-400/20 blur-md"
        />
      )}
      <span className={cn(
        "text-lg font-medium z-10",
        isCompleted ? "text-orange-300" : (isActive ? "text-neutral-200" : "text-neutral-600")
      )}>
        {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][index]}
      </span>
    </motion.button>
  );
}
