import { getVerses } from '@/lib/verses';
import { HomeClient } from './HomeClient';

export default async function Home() {
  const verses = getVerses();
  return <HomeClient verses={verses} />;
}
