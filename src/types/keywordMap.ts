import { type PaperType } from "./paper";

// ─── 노드 tier ────────────────────────────────────────────
// 0=앵커, 1=1단계 부모/자녀, 2=2단계 자녀, 3=expand로만 생성

export type NodeTier = 0 | 1 | 2 | 3;

// ─── 노드 side ────────────────────────────────────────────

export type NodeSide = "anchor" | "parent" | "child";

// ─── 엣지 타입 ────────────────────────────────────────────

export type KMEdgeType = "tree" | "cross_link";

// ─── 키워드 노드 데이터 (ReactFlow용) ────────────────────

export interface KeywordNodeData {
  label: string;
  tier: NodeTier;
  side: NodeSide;
  paperCount: number;
  isHub: boolean;
  crossLinkCount: number;
  isExpanded: boolean;
  isSelected: boolean;
}

// ─── 브레드크럼 ───────────────────────────────────────────

export interface BreadcrumbItem {
  nodeKey: string;
  label: string;
}

// ─── API: 그래프 노드 ─────────────────────────────────────

export interface KMGraphNode {
  key: string;
  name_ko: string | null;
  name_en: string | null;
  tier: number;
  side: NodeSide;
  paper_count: number;
  is_hub: boolean;
  cross_link_count: number;
}

// ─── API: 그래프 엣지 ─────────────────────────────────────

export interface KMGraphEdge {
  source: string;
  target: string;
  type: KMEdgeType;
  paper_count: number;
}

// ─── API: 그래프 응답 공통 ────────────────────────────────

export interface KMGraphResponse {
  anchor: KMGraphNode;
  nodes: KMGraphNode[];
  edges: KMGraphEdge[];
  has_more_parents: boolean;
  has_more_children: boolean;
}

// ─── API: GET /keyword-map ────────────────────────────────

export interface KMLoadParams {
  keyword: string;
  user_id?: string;
}

// ─── API: POST /keyword-map/node/{node_key}/recenter ─────

export interface KMRecenterRequest {
  existing_node_keys: string[];
}

// ─── API: POST /keyword-map/node/{node_key}/expand ───────

export interface KMExpandRequest {
  existing_node_keys: string[];
  current_tier: number;
}

// ─── API: expand 응답 ─────────────────────────────────────

export interface KMExpandResponse {
  parent_key: string;
  new_nodes: KMGraphNode[];
  new_edges: KMGraphEdge[];
}

// ─── API: GET /keyword-search/map/{user_id} ───────────────

export interface KMLastAnchorResponse {
  last_anchor_key: string;
  last_anchor_name_ko: string | null;
  last_anchor_name_en: string | null;
}

// ─── API: GET /keyword-map/node/{node_key}/detail ────────

export interface KMNodeDefinition {
  keyword_key: string;
  definition: string;
  source_url: string | null;
  source: "trend" | "llm";
}

export interface KMNodeResearcher {
  cn: string;
  name_ko: string | null;
  name_en: string | null;
  institution_ko: string | null;
  article_count: number | null;
}

export interface KMNodeDetailResponse {
  definition: KMNodeDefinition | null;
  researchers: KMNodeResearcher[];
}

// ─── API: GET /keyword-map/node/{node_key}/papers ────────

export interface KMNodePaper {
  paper_id: string;
  title: string;
  authors: string[];
  pub_year: number | null;
  journal_name: string | null;
  paper_type: PaperType | null;
  abstract: string | null;
  keywords: string[];
  doi: string | null;
  kci_registered: boolean;
  sci_indexed: boolean;
  citation_count: number | null;
  relevance_score: number;
  trust_badge: KMTrustBadge | null;
  is_bookmarked: boolean;
}

export interface KMTrustBadge {
  kci: boolean | null;
  sci: boolean | null;
  citation_count: number | null;
  degree_type: string | null;
}

export interface KMNodePapersResponse {
  keyword: string;
  papers: KMNodePaper[];
  total: number;
  search_id: string | null;
}

// ─── 논문 필터 ────────────────────────────────────────────

export type KMPaperSortType = "relevance" | "latest" | "oldest" | "citation";

export type KMPaperType = "학술 저널" | "박사학위 논문" | "석사학위 논문";

export interface KMPaperFilter {
  sort: KMPaperSortType;
  year?: number;
  paper_type?: KMPaperType;
  kci?: boolean;
  sci?: boolean;
}
