import { getVerses } from '@/lib/verses';
import { StageSection } from '@/components/memorize/StageSection';

export default async function ManagePage() {
  const verses = getVerses();

  return (
    <main className="flex h-[100dvh] overflow-hidden flex-col items-center justify-start p-4 max-w-md mx-auto relative pt-4 pb-6 bg-black">
      <div className="w-full mb-4 text-center mt-2 shrink-0">
        <h1 className="text-xl font-medium tracking-tight text-neutral-100">
          암송 관리
        </h1>
      </div>
      
      <div className="w-full flex-1 relative flex flex-col items-center justify-evenly gap-2 overflow-hidden">
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
