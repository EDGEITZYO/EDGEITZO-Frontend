import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  BookmarkFolder,
  BookmarkListResponse,
  SavedBookmarkListResponse,
} from "../types/saved";

export type BookmarkSortType =
  | "bookmark_latest"
  | "bookmark_oldest"
  | "pubyear_latest"
  | "pubyear_oldest";

export type BookmarkPaperTypeFilter =
  | "학술 저널"
  | "박사학위 논문"
  | "석사학위 논문";

export type BookmarkYearFilter = number;

export interface GetBookmarksParams {
  folder_id?: string;
  sort?: BookmarkSortType;
  paper_type_filter?: BookmarkPaperTypeFilter;
  search_query?: string;
  page?: number;
  size?: number;
}

export interface GetSavedBookmarksParams {
  folder_id?: string;
  year?: BookmarkYearFilter;
  type?: string;
  kci?: boolean;
  sci?: boolean;
  page?: number;
  size?: number;
}

export const bookmarkApi = {
  // ─── 폴더 ────────────────────────────────────────────

  getFolders: () =>
    apiClient.get<ApiResponse<BookmarkFolder[]>>("/bookmark-folders"),

  getFolder: (folderId: string) =>
    apiClient.get<ApiResponse<BookmarkFolder>>(`/bookmark-folders/${folderId}`),

  createFolder: (name: string) =>
    apiClient.post<ApiResponse<BookmarkFolder>>("/bookmark-folders", { name }),

  updateFolder: (folderId: string, name: string) =>
    apiClient.patch<ApiResponse<BookmarkFolder>>(
      `/bookmark-folders/${folderId}`,
      { name },
    ),

  deleteFolder: (folderId: string) =>
    apiClient.delete<ApiResponse<null>>(`/bookmark-folders/${folderId}`),

  getSavedFolders: () =>
    apiClient.get<ApiResponse<BookmarkFolder[]>>("/saved/bookmarks/folders"),

  // ─── 북마크 ──────────────────────────────────────────

  getBookmarks: (params?: GetBookmarksParams) =>
    apiClient.get<ApiResponse<BookmarkListResponse>>("/bookmarks", { params }),

  addBookmark: (paperId: string, folderId?: string) =>
    apiClient.post<
      ApiResponse<{
        bookmark_id: string;
        paper_id: string;
        folder_id: string;
        bookmarked_at: string;
      }>
    >("/bookmarks", {
      paper_id: paperId,
      ...(folderId && { folder_id: folderId }),
    }),

  removeBookmark: (paperId: string) =>
    apiClient.delete<ApiResponse<null>>(`/bookmarks/${paperId}`),

  checkBookmark: (paperId: string) =>
    apiClient.get<ApiResponse<{ paper_id: string; bookmarked: boolean }>>(
      `/bookmarks/check/${paperId}`,
    ),

  getSavedBookmarks: (params?: GetSavedBookmarksParams) =>
    apiClient.get<ApiResponse<SavedBookmarkListResponse>>("/saved/bookmarks", {
      params,
    }),
};
