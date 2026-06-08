import { type PaperType } from "./paper";
// ─── 북마크 ──────────────────────────────────────────────

export interface BookmarkFolder {
  id: string;
  name: string;
  created_at: string;
  paper_count: number;
  representative_keywords: string[];
  updated_at: string;
}

export interface BookmarkPaper {
  id: string;
  source: string;
  date: string;
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  kciType: string;
  citationCount: number;
  readAt: string;
  isBookmarked: boolean;
  paperType?: PaperType;
}

// ─── 폴더 Dialog ─────────────────────────────────────────

export type FolderDialogMode = "create" | "edit" | "delete";

export interface FolderDialogState {
  open: boolean;
  mode: FolderDialogMode;
  targetFolder: BookmarkFolder | null;
}

// ─── 최근 읽은 논문 ───────────────────────────────────────

export type PeriodMode = "day" | "week";
export type ViewMode = "list" | "chart";

export interface RecentPaper {
  id: string;
  source: string;
  date: string;
  title: string;
  authors: string[];
  keywords: string[];
  kciType: string;
  citationCount: number;
  readAt: string;
  isBookmarked: boolean;
  // 차트뷰용
  publishYear: number; // X축: 출판 시기
  citationForChart: number; // Y축: 인용 수
  paperType?: PaperType;
}

export interface RecentPaperSummary {
  totalCount: number;
  keywordCount: number;
  mostSearchedKeyword: string;
}

export type ChartFilterPublish = "old" | "recent";
export type ChartFilterCitation = "low" | "high";

export interface ChartFilter {
  publish: ChartFilterPublish | null;
  citation: ChartFilterCitation | null;
}
