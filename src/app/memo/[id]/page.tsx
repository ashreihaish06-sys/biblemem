import { getVerses } from '@/lib/verses';
import { MemoTestClient } from './MemoTestClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MemoPage({ params }: PageProps) {
  const { id } = await params;
  const verseId = parseInt(id, 10);
  const verses = getVerses();
  
  const verse = verses.find(v => v.id === verseId);
  
  if (!verse) {
    notFound();
  }

  return <MemoTestClient verse={verse} totalCount={verses.length} />;
}
