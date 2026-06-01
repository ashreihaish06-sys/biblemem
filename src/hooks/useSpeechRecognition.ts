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
            currentText += event.results[i][0].transcript;
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
