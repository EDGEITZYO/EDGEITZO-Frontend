// ─── 공통 ─────────────────────────────────────────────────

export type PaperType =
  | "학술 저널"
  | "박사학위 논문"
  | "석사학위 논문"
  | "학위논문";

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
  citation_count: number | null;
  if_value: number | null;
  degree_type: string | null;
  institution: string | null;
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
  paper_type: PaperType | null;
  in_service: boolean;
  paper_id: string | null;
  journal_name: string | null;
  keywords: string[] | null;
  doi: string | null;
  trust_badge: PaperTrustBadge | null;
}

// ─── 해외논문 ─────────────────────────────────────────────

export interface OverseasPaperDetail {
  key: string;
  in_service: false;
  title: string | null;
  title_en: string | null;
  authors: string[] | null;
  journal_name: string | null;
  pub_year: number | null;
  doi: string | null;
  abstract: string | null;
  abstract_lang: string | null;
  keywords: string[] | null;
  paper_type: string | null;
  published_at: string | null;
  citation_count: number | null;
  kci_registered: boolean | null;
  issn: string | null;
  publisher: string | null;
  is_open_access: boolean | null;
  external_url: string | null;
  pdf_url: string | null;
  enriched: boolean;
  enrich_source: string | null;
}

export interface RelatedCorpusPaper {
  paper_id: string;
  title: string | null;
  authors: string[] | null;
  journal_name: string | null;
  pub_year: number | null;
  paper_type: string | null;
  citation_count: number | null;
  kci_registered: boolean | null;
  sci_indexed: boolean | null;
  keywords: string[] | null;
  trust_badge: PaperTrustBadge | null;
  distance: number;
}

export interface RelatedCorpusPapersResponse {
  external_id: string;
  items: RelatedCorpusPaper[];
  used_abstract: boolean;
}

export interface PaperAdditionRequestStatus {
  external_id: string;
  requested: boolean;
}
