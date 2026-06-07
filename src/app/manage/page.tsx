import { getVerses } from '@/lib/verses';
import { StageSection } from '@/components/memorize/StageSection';

export default async function ManagePage() {
  const verses = getVerses();

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-start p-6 max-w-md mx-auto relative pt-6 pb-12 bg-black">
      <div className="w-full mb-8 text-center mt-6">
        <h1 className="text-2xl font-medium tracking-tight text-neutral-100">
          암송 관리
        </h1>
        <p className="text-neutral-500 mt-2 text-sm break-keep">
          각 단계별 시작 버튼을 눌러 암송을 진행해 보세요.
        </p>
      </div>
      
      <div className="w-full flex-1 relative flex flex-col items-center">
        {/* 1단계 */}
        {verses.length >= 10 && (
          <StageSection stage={1} verses={verses.slice(0, 10)} />
        )}
        {/* 2단계 */}
        {verses.length >= 20 && (
          <StageSection stage={2} verses={verses.slice(10, 20)} />
        )}
        {/* 3단계 */}
        {verses.length > 20 && (
          <StageSection stage={3} verses={verses.slice(20, 30)} />
        )}
      </div>
    </main>
  );
}
