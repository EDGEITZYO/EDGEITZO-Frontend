import { type PaperType } from "./paper";

// ─── 공통 ───────────────────────────────────────────────

export type SearchView = "chat" | "list" | "detail";

export type ChatRole = "user" | "ai";

// ─── 대화 메시지 ─────────────────────────────────────────

export interface ChatOption {
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  options?: ChatOption[];
  allowMultiple?: boolean;
  isLoading?: boolean;
}

// ─── SSE 슬롯/이벤트 ─────────────────────────────────────

export type SlotType =
  | "research_purpose"
  | "paper_scope"
  | "pub_year_range"
  | "keywords";

export type SearchStage = "none" | "ready" | "emphasized" | "complete";

export type ResponseType = "options" | "free_input" | "confirm";

// ─── SSE done 이벤트 ─────────────────────────────────────

export interface SearchPreview {
  topic: string;
  purpose: string;
  scope: string;
  pub_year: string;
  keywords: string[];
  completeness_pct: number;
}

export interface FinalSearchParams {
  keywords: string[];
  scope: string;
  pub_year_start: number;
  research_purpose: string;
  trust_level: string;
  advanced_filters: Record<string, string>;
}

export interface SearchChatDoneEvent {
  session_id: string;
  turn: number;
  ai_message: string;
  response_type: ResponseType;
  options: ChatOption[];
  allow_multiple: boolean;
  search_preview: SearchPreview;
  search_ready: boolean;
  completeness_pct: number;
  search_stage: SearchStage;
  interim_papers?: SearchPaper[];
  final_search_params: FinalSearchParams | null;
}

// ─── 논문 ────────────────────────────────────────────────

export interface SearchPaper {
  paper_id: string;
  title: string;
  authors: string[];
  pub_year: number;
  journal: string;
  paper_type: PaperType;
  abstract: string;
  keywords: string[];
  doi: string;
  scope_badge: string;
  citation_count: number;
  relevance_score: number;
  trust_badge: string;
  keyword_map_data: null;
}

// ─── 피드백 ──────────────────────────────────────────────

export type FeedbackType = "like" | "dislike";

// ─── API 요청/응답 ────────────────────────────────────────

export interface SearchChatRequest {
  session_id: string | null;
  message: string;
  selected_options: string[];
  force_start: boolean;
}

export interface SearchExecuteRequest {
  session_id: string;
  search_params: FinalSearchParams;
  filter_paper_type: PaperType | null;
  sort_order: "relevance" | "year_asc" | "year_desc";
  user_id: string | null;
}

export interface SearchExecuteResult {
  papers: SearchPaper[];
  total: number;
  search_id: string;
}

export interface SearchPapersRequest {
  query: string;
  paper_scope: string;
  time_range: string;
  keywords: string[];
  page: number;
  size: number;
}

// ─── 필터/정렬 ───────────────────────────────────────────

export type SortOrder = "relevance" | "year_asc" | "year_desc";
