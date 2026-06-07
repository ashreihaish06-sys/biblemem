import { useState, useEffect } from 'react';

// 글로벌 Window 객체에 beforeinstallprompt 이벤트 타입 추가
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Chrome 67 이후 버전에서 자동으로 보여주는 미니 인포바를 방지합니다
      e.preventDefault();
      // 이벤트를 저장해두었다가 나중에 설치 버튼을 클릭할 때 사용합니다
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    
    // 설치 프롬프트를 띄웁니다
    deferredPrompt.prompt();
    
    // 사용자가 프롬프트에 응답할 때까지 기다립니다
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('사용자가 앱 설치를 동의했습니다.');
    } else {
      console.log('사용자가 앱 설치를 취소했습니다.');
    }
    
    // 프롬프트는 한 번만 사용할 수 있으므로 초기화합니다
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, installPWA };
}
