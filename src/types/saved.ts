// ─── 북마크 ──────────────────────────────────────────────

export interface BookmarkFolder {
  id: string;
  name: string;
  keywords: string[];
  paperCount: number;
  updatedAt: string; // 예: "2달 전"
  isDefault: boolean; // 전체 파일 여부
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
}

// ─── 폴더 Dialog ─────────────────────────────────────────

export type FolderDialogMode = 'create' | 'edit' | 'delete';

export interface FolderDialogState {
  open: boolean;
  mode: FolderDialogMode;
  targetFolder: BookmarkFolder | null;
}