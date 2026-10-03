import { type PaperTrustBadge } from "./paper";

// 연구자 탐색 검색 타입
export type ResearcherSearchType = "name" | "field";

// 연구자 탐색 정렬 타입
export type ResearcherSortType = "relevance" | "paper_count";

// 연구자 검색 결과 항목
export interface ResearcherItem {
  researcher_id: string;
  source: string;
  scienceon_cn: string;
  author_name_kor: string;
  author_name_eng: string;
  institution_current: string;
  institution_dept: string;
  keywords: string[];
  total_papers: number;
  total_citations: number;
  citation_source: string;
  corpus_paper_count: number;
  first_pubyear: number;
  last_pubyear: number;
  field_paper_count: number;
  matched_keywords: string[];
  relevance_score: number;
}

// GET /api/v1/researchers/search 응답
export interface ResearcherSearchResponse {
  query: string;
  search_type: ResearcherSearchType;
  total: number;
  page: number;
  size: number;
  items: ResearcherItem[];
}

// GET /api/v1/researchers/recent-searches 응답 항목
export interface ResearcherRecentSearchItem {
  query: string;
  search_type: ResearcherSearchType;
  searched_at: string;
}

// POST /api/v1/researchers/recent-searches 요청
export interface SaveRecentResearcherSearchRequest {
  query: string;
  search_type: ResearcherSearchType;
}

// ─── 연구자 상세 ───────────────────────────────────────────

// 논문 정렬 타입 (상세 페이지 전용 — 탐색의 ResearcherSortType과 다름)
export type ResearcherPaperSortType = "recent" | "citations";

// 연구 흐름 레벨
export type ResearchFlowLevel = "none" | "single" | "flow";

// 요약 출처
export type SummarySource = "llm" | "rule" | "none";

// GET /api/v1/researchers/{researcher_id} 응답 데이터
export interface ResearcherProfile {
  researcher_id: string;
  name_kor: string | null;
  name_eng: string | null;
  institution: string | null;
  department: string | null;
  keywords: string[];
  email: string | null;
  total_papers: number | null;
  total_citations: number | null;
  citation_source: string | null;
  corpus_paper_count: number;
  first_pubyear: number | null;
  last_pubyear: number | null;
}

// 연구자 논문 항목
export interface ResearcherPaperItem {
  paper_id: string | null;
  external_id: string | null;
  title: string | null;
  journal_name: string | null;
  pub_year: number | null;
  pub_month: string | null;
  published_at: string | null;
  authors: string[];
  abstract: string | null;
  keywords: string[];
  citation_count: number | null;
  paper_type: string | null;
  kci_registered: boolean;
  sci_indexed: boolean | null;
  doi: string | null;
  trust_badge: Pick<
    PaperTrustBadge,
    "kci" | "sci" | "citation_count" | "degree_type"
  > | null;
  external_url: string | null;
  is_internal: boolean;
  detail_id: string | null;
  can_open_detail: boolean;
  can_bookmark: boolean;
  is_bookmarked: boolean;
  read_at: string | null;
  role: string | null;
  author_order: number | null;
}

// GET /api/v1/researchers/{researcher_id}/papers 응답 데이터
export interface ResearcherPaperListResponse {
  researcher_id: string;
  total: number;
  page: number;
  size: number;
  sort: ResearcherPaperSortType;
  citation_sort_available: boolean;
  items: ResearcherPaperItem[];
}

// 공저자 항목
export interface CoauthorItem {
  researcher_id: string;
  name: string | null;
  institution: string | null;
  department: string | null;
  department_display: string | null;
  department_source: string | null;
  keywords: string[];
  co_paper_count: number;
}

// GET /api/v1/researchers/{researcher_id}/coauthors 응답 데이터
export interface CoauthorListResponse {
  researcher_id: string;
  total: number;
  items: CoauthorItem[];
}

// 연구 흐름 클러스터 내 논문
export interface ResearchFlowPaper {
  node_id: string;
  paper_id: string | null;
  external_id: string | null;
  title: string | null;
  journal_name: string | null;
  citation_count: number | null;
  pub_year: number | null;
  published_at: string | null;
  is_internal: boolean;
  detail_id: string | null;
  external_url: string | null;
}

// 연구 흐름 클러스터
export interface ResearchFlowCluster {
  cluster_id: number;
  topic: string;
  description: string | null;
  topic_keywords: string[];
  paper_count: number;
  start_year: number | null;
  end_year: number | null;
  papers: ResearchFlowPaper[];
}

// GET /api/v1/researchers/{researcher_id}/research-flow 응답 데이터
export interface ResearchFlowResponse {
  researcher_id: string;
  total_papers: number;
  flow_level: ResearchFlowLevel;
  summary: string | null;
  summary_source: SummarySource;
  clusters: ResearchFlowCluster[];
}
