import { type PaperType, type PaperTrustBadge } from "./paper";

// ─── 공통 베이스 ──────────────────────────────────────────

export interface SavedPaper {
  paper_id: string;
  paper_type: PaperType | null;
  journal_name: string | null;
  published_at: string | null;
  title: string;
  authors: string[];
  keywords: string[];
  abstract: string | null;
  doi: string | null;
  trust_badge: PaperTrustBadge;
}

// ─── 북마크 폴더 ──────────────────────────────────────────

export interface BookmarkFolder {
  id: string;
  name: string;
  created_at: string;
  paper_count: number;
  representative_keywords: string[];
  updated_at: string;
}

// ─── 북마크 논문 ──────────────────────────────────────────

export interface BookmarkPaper extends SavedPaper {
  bookmarked_at: string;
}

export interface BookmarkListResponse {
  total: number;
  page: number;
  size: number;
  items: BookmarkPaper[];
}

export interface SavedBookmarkListResponse {
  total: number;
  page: number;
  size: number;
  items: BookmarkPaper[];
}

// ─── 폴더 Dialog ─────────────────────────────────────────

export type FolderDialogMode = "create" | "delete";

export interface FolderDialogState {
  open: boolean;
  mode: FolderDialogMode;
  targetFolder: BookmarkFolder | null;
}

// ─── 최근 읽은 논문 ───────────────────────────────────────

export type PeriodMode = "day" | "week";
export type ViewMode = "list" | "chart";

export interface RecentPaper extends SavedPaper {
  viewed_at: string;
  view_count: number;
  bookmarked_at: string | null;
}

export interface RecentPaperGroup {
  date: string;
  papers: RecentPaper[];
}

export interface RecentPaperListResponse {
  groups: RecentPaperGroup[];
}

export interface RecentPaperChartItem {
  paper_id: string;
  paper_type: PaperType | null;
  journal_name: string | null;
  title: string;
  authors: string[];
  keywords: string[];
  doi: string | null;
  published_year: number;
  published_at: string | null;
  citation_count: number | null;
  view_count: number;
  viewed_at: string;
  trust_badge: PaperTrustBadge;
}

export interface RecentPaperStats {
  total_papers: number;
  keyword_count: number;
  top_keyword: string;
  chart_data: RecentPaperChartItem[];
}

export type ChartFilterPublish = "old" | "recent";
export type ChartFilterCitation = "low" | "high";

export interface ChartFilter {
  publish: ChartFilterPublish | null;
  citation: ChartFilterCitation | null;
}

// ─── 북마크 필터 ──────────────────────────────────────────

export interface BookmarkFilter {
  year: number | null;
  type: string | null;
  kci: boolean | null;
  sci: boolean | null;
}
