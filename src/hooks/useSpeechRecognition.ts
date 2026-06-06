'use client';
import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false; // 모바일 브라우저 안정성을 위해 단일 샷 인식 모드 사용
        recog.interimResults = true;
        recog.lang = 'ko-KR';

        recog.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (i > 0) {
              const prevRaw = event.results[i-1][0].transcript;
              const prev = prevRaw.trim();
              const curr = transcript.trim();
              
              // 스마트폰(특히 안드로이드 Chrome)에서 이전 인식 결과가 누적되어 중복 출력되는 버그 방지
              if (prev && curr.startsWith(prev)) {
                const cleanCurrent = currentText.replace(/\s+/g, '');
                const cleanPrev = prev.replace(/\s+/g, '');
                if (cleanPrev && cleanCurrent.endsWith(cleanPrev)) {
                  let sliceLength = 0;
                  let normalizedSuffix = '';
                  for (let j = currentText.length - 1; j >= 0; j--) {
                    const char = currentText[j];
                    if (/\s/.test(char)) {
                      sliceLength++;
                      continue;
                    }
                    normalizedSuffix = char + normalizedSuffix;
                    sliceLength++;
                    if (normalizedSuffix === cleanPrev) {
                      break;
                    }
                  }
                  currentText = currentText.slice(0, -sliceLength) + transcript;
                  continue;
                }
              }
            }
            
            currentText += transcript;
          }
          setText(currentText);
        };

        recog.onerror = (err: any) => {
          console.error('Speech recognition error event:', err);
          setIsListening(false);
        };

        recog.onend = () => setIsListening(false);
        setRecognition(recog);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    setText('');
    setIsListening(true);
    try {
      recognition?.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    try {
      recognition?.stop();
    } catch (err) {
      console.error('Failed to stop speech recognition:', err);
    }
  }, [recognition]);

  return { text, isListening, startListening, stopListening, isSupported: !!recognition };
};
