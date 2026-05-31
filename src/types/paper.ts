export type PaperType = '학위논문' | '학술저널';

// ─── 논문 공통 베이스 ─────────────────────────────────────
export interface PaperBase {
  id: string;
  source: string;
  date: string;
  title: string;
  authors: string[];
  keywords: string[];
  kciType: string;
  citationCount: number;
  isBookmarked: boolean;
  paperType?: PaperType; // 디자인 업데이트 반영 대기 중, API 연동 시 필수 여부 재검토
}

// ─── 논문 상세 ────────────────────────────────────────────
export interface PaperDetail extends PaperBase {
  abstract: string;
  relatedPapers: PaperBase[];
  originalUrl?: string;
}