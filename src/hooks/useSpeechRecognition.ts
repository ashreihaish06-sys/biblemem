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
        recog.continuous = true;
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
                if (currentText.endsWith(prevRaw)) {
                  currentText = currentText.slice(0, -prevRaw.length) + transcript;
                  continue;
                }
              }
            }
            
            currentText += transcript;
          }
          setText(currentText);
        };

        recog.onend = () => setIsListening(false);
        setRecognition(recog);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    setText('');
    setIsListening(true);
    recognition?.start();
  }, [recognition]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    recognition?.stop();
  }, [recognition]);

  return { text, isListening, startListening, stopListening, isSupported: !!recognition };
};
