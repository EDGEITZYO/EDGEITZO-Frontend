import { type PaperType } from "./paper";

// ─── 공통 ───────────────────────────────────────────────

export type SearchView = "chat" | "result";
export type ChatRole = "user" | "ai";
export type SortOrder =
  | "relevance"
  | "year_desc"
  | "year_asc"
  | "citation_desc";
export type FeedbackType = "like" | "dislike";

// ─── 대화 메시지 블록 ────────────────────────────────────

export type MessageBlock =
  | { type: "text"; content: string }
  | { type: "status"; status: "searching" | "complete"; paperCount?: number }
  | {
      type: "result_summary";
      total_count: number;
      keywords: string[];
      result_items: SearchPaper[];
      filters: SearchFilters;
    }
  | { type: "narrow_chips"; chips: NarrowChip[] }
  | { type: "expand_chips"; chips: ExpandChip[] };

// ─── 대화 메시지 ─────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  blocks?: MessageBlock[];
  isLoading?: boolean;
  isStopped?: boolean;
}

// ─── API 요청 ─────────────────────────────────────────────

export type NarrowChipType = "year" | "paper_type" | "citation";
export type ExpandChipType = "expand";
export type ChipType = NarrowChipType | ExpandChipType;

export interface SearchChatRequest {
  session_id: string | null;
  message: string;
  chip_id: string | null;
  chip_type: ChipType | null;
  sort_order: SortOrder;
  pub_year_start: number | null;
  paper_type: string | null;
  kci_only: boolean | null;
  sci_only: boolean | null;
}

// ─── 응답 - 저자 ─────────────────────────────────────────

export interface PaperAuthor {
  name: string;
  affiliation: string | null;
}

// ─── 응답 - 신뢰도 ───────────────────────────────────────

export type CredibilityBadge = "high" | "medium" | "low" | "unknown";

export interface PaperCredibility {
  badge: CredibilityBadge;
  citation_count: number | null;
  citation_badge: string | null;
  impact_factor: number | null;
  impact_factor_badge: string | null;
  kci_registered: boolean | null;
  kci_badge: string | null;
  sci_indexed: boolean | null;
  sci_badge: string | null;
  sjr_quartile: string | null;
  sjr_score: number | null;
  h_index: number | null;
  summary: string | null;
}

// ─── 응답 - 논문 ─────────────────────────────────────────

export interface SearchPaper {
  paper_id: string;
  title: string;
  authors: PaperAuthor[];
  year: number | null;
  abstract: string | null;
  keywords: string[];
  journal_name: string | null;
  issn: string | null;
  doi: string | null;
  db_code: string | null;
  paper_type: PaperType | null;
  source: string;
  is_bookmarked: boolean;
  credibility: PaperCredibility;
  score: number;
  similarity_score: number;
  matched_snippet: string | null;
}

// ─── 응답 - 필터 ─────────────────────────────────────────

export interface SearchFilters {
  pub_year_start: number | null;
  paper_type: string | null;
  citation_min: number | null;
  kci_only: boolean;
  sci_only: boolean;
  keywords: string[];
}

// ─── 응답 - 히스토리 ─────────────────────────────────────

export type HistoryStepType = "search" | "narrow" | "expand";

export interface SearchHistoryItem {
  step_id: string;
  step_type: HistoryStepType;
  applied_filter: Record<string, unknown> | null;
  added_keyword: string | null;
  result_count: number;
  result_items: SearchPaper[];
  timestamp: string;
}

// ─── 응답 - 칩 ───────────────────────────────────────────

export interface NarrowChip {
  chip_id: string;
  chip_type: NarrowChipType;
  label: string;
  value: Record<string, unknown>;
}

export interface ExpandChip {
  chip_id: string;
  chip_type: "expand";
  keyword: string;
  label: string;
  co_occurrence_count: number;
}

// ─── 응답 - ChatResponse ─────────────────────────────────

export type FallbackType =
  | "clarify"
  | "no_result"
  | "off_topic"
  | "topic_change";

export interface ChatResponse {
  session_id: string;
  filters: SearchFilters;
  sort_order: SortOrder;
  history: SearchHistoryItem[];
  result_items: SearchPaper[];
  total_count: number;
  narrow_chips: NarrowChip[];
  expand_chips: ExpandChip[];
  ai_summary: string | null;
  summary_failed: boolean;
  fallback: FallbackType | null;
  is_broad_result: boolean;
}

// ─── SSE 이벤트 ──────────────────────────────────────────

export type SearchChatSseEvent =
  | { type: "search_started" }
  | { type: "searching" }
  | { type: "heartbeat" }
  | { type: "papers_found"; count: number }
  | { type: "fetching" }
  | { type: "token"; text: string }
  | ({ type: "done" } & ChatResponse)
  | { type: "error"; message: string };

// ─── directSearch용 (이번 범위 외, 유지) ─────────────────

export interface SearchPapersRequest {
  query: string;
  paper_scope: string;
  time_range: string;
  keywords: string[];
  page: number;
  size: number;
}
