'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const manualStopRef = useRef(false);
  const sessionTextRef = useRef('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    }
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    manualStopRef.current = false;
    setText('');
    sessionTextRef.current = '';

    const startRecog = () => {
      try {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch(e) {}
        }

        const recog = new SpeechRecognition();
        recog.continuous = true; // 더 긴 문장을 인식하기 위해 true로 설정
        recog.interimResults = true;
        recog.lang = 'ko-KR';

        recog.onstart = () => {
          setIsListening(true);
        };

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
          
          setText((sessionTextRef.current + ' ' + currentText).trim());
        };

        recog.onerror = (err: any) => {
          console.error('Speech recognition error event:', err.error);
          if (err.error === 'not-allowed') {
            alert('마이크 권한이 허용되지 않았습니다. 브라우저 설정이나 사이트 설정에서 마이크 접근을 허용해 주세요.');
            manualStopRef.current = true; // 권한 없으면 자동 재시작 방지
          }
        };

        recog.onend = () => {
          if (!manualStopRef.current) {
            // 사용자가 명시적으로 중지하지 않았는데 종료된 경우 (구절이 길어서 끊기는 현상 방지)
            setText((prev) => {
              sessionTextRef.current = prev;
              return prev;
            });
            setTimeout(() => {
              if (!manualStopRef.current) startRecog();
            }, 100);
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recog;
        recog.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    };

    startRecog();
  }, []);

  const stopListening = useCallback(() => {
    manualStopRef.current = true;
    setIsListening(false);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (err) {
      console.error('Failed to stop speech recognition:', err);
    }
  }, []);

  return { text, isListening, startListening, stopListening, isSupported };
};
