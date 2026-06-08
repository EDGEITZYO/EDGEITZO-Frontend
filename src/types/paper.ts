// ─── 공통 ─────────────────────────────────────────────────

export type PaperType = "저널" | "학위논문" | "학회";

// ─── 논문 단건 조회 ────────────────────────────────────────

export interface PaperCredibility {
  badge: "high" | "medium" | "low" | "unknown";
  citation_count: number;
  citation_badge: string;
  impact_factor: number;
  impact_factor_badge: string;
  kci_registered: boolean;
  kci_badge: string;
  sci_indexed: boolean;
  sci_badge: string;
  sjr_quartile: string;
  sjr_score: number;
  h_index: number;
  summary: string;
}

export interface PaperTrustBadge {
  kci: boolean;
  sci: boolean;
  citation_count: number;
  if_value: number;
  degree_type: string;
  institution: string;
  full_text_available: boolean | null;
}

export interface PaperDetail {
  paper_id: string;
  title: string;
  title_en: string | null;
  authors: string[];
  abstract: string | null;
  abstract_en: string | null;
  keywords_ko: string[];
  keywords_en: string[];
  published_at: string | null;
  paper_type: PaperType | null;
  journal_name: string | null;
  doi: string | null;
  citation_count: number;
  degree: string | null;
  affiliation: string | null;
  fulltext_flag: boolean;
  credibility: PaperCredibility;
  trust_badge: PaperTrustBadge;
}

// ─── 유사 논문 ────────────────────────────────────────────

export interface SimilarPaper {
  title: string;
  author: string;
  pubyear: number;
  material_type: string;
  in_service: boolean;
  paper_id: string | null;
}
