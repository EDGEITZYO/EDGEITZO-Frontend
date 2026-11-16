import { type PaperType } from "./paper";

// ─── 공통 ─────────────────────────────────────────────────

export type SearchType = "keyword" | "ai";

// ─── 최근 탐색 이력 ────────────────────────────────────────

export interface RecentSearch {
  id: string;
  type: SearchType;
  title: string;
  last_viewed_paper_title: string | null;
  keyword_path: string[];
  recommended_keywords: string[];
  created_at: string;
}

// ─── 최근 열람 논문 ────────────────────────────────────────

export interface RecentPaperBadges {
  kci: "O" | "X" | null;
  citation_count: number | null;
}

export interface RecentPaper {
  paper_id: string;
  paper_type: PaperType | null;
  journal_name: string | null;
  published_at: string | null;
  title: string;
  keywords: string[];
  badges: RecentPaperBadges;
  viewed_at: string;
}

// ─── 유저 ─────────────────────────────────────────────────

export interface HomeUser {
  id: string;
  name: string;
  personalized_message: string;
}

// ─── API 응답 ──────────────────────────────────────────────

export interface HomeData {
  user: HomeUser;
  recent_searches: RecentSearch[];
  recent_papers: RecentPaper[];
}

// ─── 추천 검색어 ───────────────────────────────────────────

export type SearchSuggestionsBasis = "onboarding" | "history" | "none";

export interface SuggestedKeyword {
  name: string;
  key: string;
}

export interface SearchSuggestionsData {
  basis: SearchSuggestionsBasis;
  ai_query: string | null;
  keyword: SuggestedKeyword | null;
  history_start: string | null;
  history_end: string | null;
}
