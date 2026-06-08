import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type { BookmarkFolder } from "../types/saved";

export const bookmarkApi = {
  getFolders: () =>
    apiClient.get<ApiResponse<BookmarkFolder[]>>("/bookmark-folders"),

  addBookmark: (paperId: string, folderId?: string) =>
    apiClient.post<
      ApiResponse<{
        id: string;
        paper_id: string;
        folder_id: string;
        created_at: string;
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
};
