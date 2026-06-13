import { type PaperType } from "./paper";

// ─── 노드 단계 ───────────────────────────────────────────

export type NodeDepth = 1 | 2 | 3 | 4;

// ─── 엣지 축 타입 ─────────────────────────────────────────

export type EdgeAxisLabel = "핵심기술" | "연구대상" | "상위분야" | "응용분야";

// ─── 방향 ─────────────────────────────────────────────────

export type NodeDirection = "top" | "right" | "bottom" | "left";

// ─── 키워드 노드 데이터 (ReactFlow용) ────────────────────

export interface KeywordNodeData {
  label: string;
  depth: NodeDepth;
  direction: NodeDirection;
  definition?: string;
  isExpanded: boolean;
  isSelected: boolean;
  isFocused: boolean;
}

// ─── 브레드크럼 ───────────────────────────────────────────

export interface BreadcrumbItem {
  nodeId: string;
  label: string;
  depth: NodeDepth;
}

// ─── API: 키워드맵 트리 노드 ─────────────────────────────
// GET /keyword-search/map/{user_id}, POST /keyword-map/generate 응답

export interface KMTreeNode {
  id: string;
  ko: string;
  en: string;
  depth: number;
  edge_type: EdgeAxisLabel | null;
  definition: string | null;
  children: KMTreeNode[];
}

// ─── API: 키워드맵 생성 응답 ──────────────────────────────
// POST /keyword-map/generate

export interface KMGenerateResponse {
  research_field: string;
  tree: KMTreeNode;
}

// ─── API: 키워드맵 조회 응답 ──────────────────────────────
// GET /keyword-search/map/{user_id}

export interface KMMapResponse {
  research_field: string;
  tree: KMTreeNode;
}

// ─── API: 노드 확장 요청 body ─────────────────────────────
// POST /keyword-map/node/{node_id}/expand

export interface KMExpandRequest {
  parent_label: string;
  parent_label_en: string;
  axis: EdgeAxisLabel;
  research_field: string;
  depth: number;
}

// ─── API: 노드 확장 응답 ──────────────────────────────────

export interface KMExpandedChild {
  id: string;
  ko: string;
  en: string;
  edge_type: EdgeAxisLabel;
  definition: string | null;
}

export interface KMExpandResponse {
  parent_label: string;
  new_children: KMExpandedChild[];
}

// ─── API: 논문 배지 ───────────────────────────────────────

export interface TrustBadge {
  kci: boolean;
  sci: boolean;
  citation_count: number;
  degree_type: string | null;
}

// ─── API: 노드 연결 논문 ──────────────────────────────────
// GET /keyword-map/node/{node_id}/papers

export interface KMNodePaper {
  paper_id: string;
  title: string;
  authors: string[];
  pub_year: number;
  journal_name: string;
  paper_type: PaperType;
  abstract: string;
  keywords: string[];
  doi: string | null;
  kci_registered: boolean;
  sci_indexed: boolean;
  citation_count: number;
  relevance_score: number;
  trust_badge: TrustBadge;
}

export interface KMNodePapersResponse {
  keyword: string;
  papers: KMNodePaper[];
  total: number;
  page: number;
  size: number;
  search_id: string | null;
}

// ─── 논문 필터 ────────────────────────────────────────────

export type KMPaperSortType = "date" | "citation";

export type KMYearRange = "3y" | "5y" | "10y";

export type KMPaperType =
  | "학술 저널"
  | "박사학위 논문"
  | "석사학위 논문"
  | "학위논문";

export interface KMPaperFilter {
  sort: KMPaperSortType;
  year_range?: KMYearRange;
  paper_type?: KMPaperType;
  kci?: boolean;
  sci?: boolean;
}
