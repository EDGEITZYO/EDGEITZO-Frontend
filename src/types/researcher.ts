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
