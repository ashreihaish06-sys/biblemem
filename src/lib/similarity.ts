/**
 * 텍스트에서 특수문자와 공백을 제거하고 정규화합니다.
 */
const normalizeText = (text: string) => {
  return text.replace(/[^\w\s가-힣]/g, '').replace(/\s+/g, '').toLowerCase();
};

/**
 * 두 문자열 간의 레벤슈타인 거리를 기반으로 유사도 퍼센트를 계산합니다.
 */
export function calculateSimilarity(source: string, target: string): number {
  const s = normalizeText(source);
  const t = normalizeText(target);
  
  if (s === t) return 100;
  if (s.length === 0 || t.length === 0) return 0;
  
  const matrix = Array.from({ length: s.length + 1 }, () => new Array(t.length + 1).fill(0));
  
  for (let i = 0; i <= s.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= t.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // 삭제
        matrix[i][j - 1] + 1,      // 삽입
        matrix[i - 1][j - 1] + cost // 대체
      );
    }
  }
  
  const distance = matrix[s.length][t.length];
  const maxLength = Math.max(s.length, t.length);
  return ((maxLength - distance) / maxLength) * 100;
}

/**
 * 90% 이상 일치하는지 확인합니다.
 */
export function isPass(source: string, target: string): boolean {
  return calculateSimilarity(source, target) >= 90;
}
