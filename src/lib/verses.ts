import fs from 'fs';
import path from 'path';

export interface Verse {
  id: number;
  reference: string;
  text: string;
}

export function getVerses(): Verse[] {
  try {
    const filePath = path.join(process.cwd(), '30verse.txt');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    const lines = fileContents.split('\n');
    const verses: Verse[] = [];
    
    // Pattern matches: "1. **요한3서 1:2** "사랑하는 자여...""
    const regex = /^(\d+)\.\s+\*\*([^*]+)\*\*\s+"([^"]+)"/;
    
    for (const line of lines) {
      const match = line.trim().match(regex);
      if (match) {
        verses.push({
          id: parseInt(match[1], 10),
          reference: match[2].trim(),
          text: match[3].trim(),
        });
      }
    }
    
    if (verses.length > 0) {
      return verses;
    }
  } catch (error) {
    console.error('Failed to read or parse 30verse.txt:', error);
  }
  
  // Fallback data if file is missing, empty, or parsing fails
  return Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    reference: `샘플 말씀 ${i + 1}`,
    text: "이곳에 말씀이 표시됩니다. 30verse.txt 파일을 확인해주세요."
  }));
}
