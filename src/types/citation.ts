export type CitationDirection = "reference" | "citing";
export type CitationTab = "reference" | "relation"; // 참고문헌 | 인용관계
import type { PaperType } from "./paper";

// ─── 노드 ────────────────────────────────────────────────

export interface PaperCitationNode {
  key: string;
  in_service: boolean;
  paper_id: string | null;
  title: string | null;
  title_en: string | null;
  pubyear: number | null;
  tier: number;
  side: string;
  has_more: boolean;
  cluster_id: number | null;
}

// ─── 엣지 ────────────────────────────────────────────────

export interface PaperCitationEdge {
  source: string;
  target: string;
}

// ─── 논문 카드 (우측 리스트용) ──────────────────────────

export interface CitationPaperCard {
  key: string;
  in_service: boolean;
  paper_id: string | null;
  title: string | null;
  title_en: string | null;
  authors: string[] | null;
  journal_name: string | null;
  pub_year: number | null;
  doi: string | null;
  abstract: string | null;
  keywords: string[] | null;
  paper_type: PaperType | null;
  kci_registered: boolean | null;
  sci_indexed: boolean | null;
  citation_count: number | null;
  trust_badge: {
    kci: boolean | null;
    sci: boolean | null;
    citation_count: number | null;
  } | null;
  is_bookmarked: boolean | null;
}

// ─── citation-graph GET 응답 ─────────────────────────────

export interface CitationGraphResponse {
  direction: CitationDirection;
  center: PaperCitationNode;
  nodes: PaperCitationNode[];
  edges: PaperCitationEdge[];
  has_more: boolean;
  papers: CitationPaperCard[];
}

// ─── expand POST 응답 ────────────────────────────────────

export interface CitationExpandResponse {
  parent_key: string;
  direction: CitationDirection;
  new_nodes: PaperCitationNode[];
  new_edges: PaperCitationEdge[];
  parent_has_more: boolean;
  capped: boolean;
  papers: CitationPaperCard[];
}
