'use client';

import { useState, useEffect } from 'react';
import { SteppingStone } from '@/components/memorize/SteppingStone';
import { STTTestScreen } from '@/components/memorize/STTTestScreen';
import { motion } from 'framer-motion';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const dummyVerses = [
  { reference: "요한복음 3:16", text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라" },
  { reference: "빌립보서 4:13", text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라" },
  { reference: "시편 23:1", text: "여호와는 나의 목자시니 내게 부족함이 없으리로다" },
  { reference: "잠언 3:5-6", text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라" },
  { reference: "로마서 8:28", text: "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라" },
  { reference: "이사야 41:10", text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라" },
  { reference: "갈라디아서 2:20", text: "내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라" },
  { reference: "여호수아 1:9", text: "내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라" },
  { reference: "베드로전서 5:7", text: "너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라" },
  { reference: "마태복음 11:28", text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라" },
];

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState<number | null>(null);
  const [completedDates, setCompletedDates] = useState<Record<number, string>>({});
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isInstallable, installPWA } = usePWAInstall();

  // 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    setIsMounted(true);
    const savedHasStarted = localStorage.getItem('bible-memo-hasStarted');
    if (savedHasStarted === 'true') {
      setHasStarted(true);
    }

    const savedCompletedDates = localStorage.getItem('bible-memo-completedDates');
    if (savedCompletedDates) {
      try {
        setCompletedDates(JSON.parse(savedCompletedDates));
      } catch (e) {
        console.error('기록을 불러오는데 실패했습니다.', e);
      }
    }
  }, []);

  // 상태가 변경될 때마다 로컬 스토리지에 저장하기
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('bible-memo-hasStarted', String(hasStarted));
    }
  }, [hasStarted, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('bible-memo-completedDates', JSON.stringify(completedDates));
    }
  }, [completedDates, isMounted]);

  // === 암송 화면 (상세 화면) ===
  if (selectedVerseIndex !== null) {
    const currentVerse = dummyVerses[selectedVerseIndex];

    return (
      <div className="flex flex-col h-full max-w-md mx-auto relative p-6 bg-black overflow-hidden">
        <button 
          onClick={() => setSelectedVerseIndex(null)}
          className="absolute top-6 left-6 text-neutral-500 hover:text-neutral-300 transition-colors z-50 flex items-center"
        >
          ← 목록으로
        </button>
        
        <div className="shrink-0 w-full p-6 mt-16 mb-2 rounded-2xl bg-neutral-900 border border-neutral-800 text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-1 bg-orange-500/50 h-full" />
          <p className="text-orange-400/80 text-xs font-semibold tracking-widest mb-3">
            STEP {selectedVerseIndex + 1}
          </p>
          <motion.p 
            animate={{ opacity: isMicActive ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className={`text-neutral-200 font-serif leading-relaxed mb-4 break-keep ${
              currentVerse.text.length < 40 ? 'text-2xl' : 
              currentVerse.text.length < 70 ? 'text-xl' : 'text-lg'
            }`}
          >
            "{currentVerse.text}"
          </motion.p>
          <p className="text-neutral-500 text-sm">
            - {currentVerse.reference} -
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <STTTestScreen 
            originalVerse={currentVerse.text} 
            onListeningChange={setIsMicActive}
            onSuccess={() => {
              // 날짜 포맷 (예: 26.05.31)
              const date = new Date();
              const formattedDate = `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
              setCompletedDates(prev => ({ ...prev, [selectedVerseIndex]: formattedDate }));
              setSelectedVerseIndex(null);
            }} 
          />
        </div>
      </div>
    );
  }

  // === 진짜 홈 화면 (랜딩 화면) ===
  if (!hasStarted) {
    const completedCount = Object.keys(completedDates).length;
    const totalCount = dummyVerses.length;

    return (
      <main 
        className="flex min-h-full flex-col items-center justify-center p-6 max-w-md mx-auto relative text-center space-y-12 py-12 bg-black"
      >
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

        {/* 진도율 표시 영역 (작동하지 않는 읽기 전용 버튼) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex flex-col items-center space-y-4"
        >
          <div className="flex justify-between w-full px-2 items-end">
            <span className="text-neutral-500 text-sm font-medium">나의 암송 진도</span>
            <span className="text-neutral-300 text-xs font-semibold">{completedCount} / {totalCount} 완료</span>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl w-fit mx-auto">
            <div className="grid grid-cols-[repeat(5,50px)] gap-[8px] p-[16px] w-fit">
              {dummyVerses.map((_, i) => {
                const isCompleted = !!completedDates[i];
                const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
                return (
                  <div 
                    key={i} 
                    className={`flex justify-center items-center w-[50px] h-[50px] border-[2px] rounded-[14px] text-[20px] font-sans box-border transition-all duration-300 font-bold
                      ${isCompleted ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-black text-black'}
                    `}
                  >
                    {romanNumerals[i]}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 w-full pt-4"
        >
          <button
            onClick={() => setHasStarted(true)}
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

  // === 1~10번 목록 화면 ===
  return (
    <main className="flex min-h-full flex-col items-center justify-start p-6 max-w-md mx-auto relative pt-6 pb-6 bg-black">
      <div className="w-full flex justify-center items-center mb-6">
        <button 
          onClick={() => setHasStarted(false)}
          className="bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all px-8 py-2.5 rounded-lg text-sm font-medium border border-neutral-800 shadow-sm"
        >
          암송관리
        </button>
      </div>

      <div className="w-full mb-4 text-center">
        <h1 className="text-xl font-medium tracking-tight text-neutral-100">
          나의 암송 노트
        </h1>
        <p className="text-neutral-500 mt-1 text-xs">
          순서대로 버튼을 눌러 말씀을 암송해 보세요.
        </p>
      </div>
      
      <div className="w-full flex-1 relative flex flex-col items-center">
        {/* 1~10번 버튼 그리드 */}
        <div className="w-full grid grid-cols-3 gap-y-5 gap-x-2 py-2">
          {dummyVerses.map((verse, i) => {
            const isCompleted = !!completedDates[i];
            
            // 이전 단계가 완료되었거나 1번째(인덱스 0)일 경우에만 in_progress(언락) 상태 부여
            let status: 'locked' | 'in_progress' | 'completed' = 'locked';
            if (isCompleted) {
              status = 'completed';
            } else if (i === 0 || !!completedDates[i - 1]) {
              status = 'in_progress';
            }

            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center"
              >
                <SteppingStone
                  index={i}
                  status={status}
                  onClick={() => {
                    if (status !== 'locked') {
                      setSelectedVerseIndex(i);
                    }
                  }}
                />
                <div className="mt-2 text-center min-h-[2.5rem] flex flex-col items-center">
                  <span className={`text-[13px] font-medium tracking-wide mb-1 break-keep ${status === 'locked' ? 'text-neutral-500' : 'text-neutral-200'}`}>
                    {verse.reference}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] text-orange-400 font-medium px-2 py-0.5 rounded-full bg-orange-400/10">
                      {completedDates[i]} 통과
                    </span>
                  )}
                  {status === 'locked' && (
                    <span className="text-[10px] text-neutral-600 font-medium">
                      잠김
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
