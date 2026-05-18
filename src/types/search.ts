// ─── 공통 ───────────────────────────────────────────────

export type SearchView = 'chat' | 'list';

export type ChatRole = 'user' | 'ai';

export type SearchStep =
  | 'purpose'      // 연구 목적
  | 'scope'        // 논문 범위
  | 'period'       // 발행 시기
  | 'narrowDown'   // 범위 축소
  | 'start';       // 탐색 시작

// ─── 대화 메시지 ─────────────────────────────────────────

export interface ChatChoice {
  id: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  choices?: ChatChoice[];   // AI 메시지일 때 선택지
  isLoading?: boolean;      // AI 응답 로딩 중
}

// ─── 검색 구체화 ──────────────────────────────────────────

export interface SearchProgress {
  specificity: number;        // 구체화 % (0~100)
  currentStep: SearchStep;    // 현재 완료된 단계
}

// ─── 논문 (우측 패널 미니 카드용) ────────────────────────

export type PaperFeedback = 'like' | 'dislike' | null;

export interface MiniPaper {
  id: string;
  source: string;
  date: string;
  title: string;
  tags: string[];             // KCI, SCI 등
  keywords: string[];
  feedback: PaperFeedback;
}

// ─── 논문 (리스트 전체화면용) ────────────────────────────

export interface PaperListItem {
  id: string;
  source: string;
  date: string;
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  kciType: string;
  citationCount: number;
  readAt: string;
  isBookmarked: boolean;
}

// ─── 검색 결과 ────────────────────────────────────────────

export interface SearchResult {
  totalCount: number;
  papers: MiniPaper[];
}

// ─── 필터/정렬 ───────────────────────────────────────────

export type PaperSortType = 'relevance' | 'newest' | 'oldest';

export type PaperFilterType = 'all' | 'journal' | 'thesis' | 'conference';

export interface PaperFilter {
  sort: PaperSortType;
  paperType: PaperFilterType;
  publishYear?: string;
  sciOnly?: boolean;
}