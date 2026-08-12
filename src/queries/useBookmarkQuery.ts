import { useQuery } from "@tanstack/react-query";
import { bookmarkApi } from "../api/bookmark";
import { bookmarkKeys } from "./keys";
import type { BookmarkFolder, SavedBookmarkListResponse } from "../types/saved";
import type { GetSavedBookmarksParams } from "../api/bookmark";

export function useBookmarkCheckQuery(paperId: string) {
  return useQuery<{ paper_id: string; bookmarked: boolean }>({
    queryKey: bookmarkKeys.check(paperId),
    queryFn: async () => {
      const res = await bookmarkApi.checkBookmark(paperId);
      return res.data.data;
    },
    staleTime: 0,
  });
}

export function useBookmarkFoldersQuery(enabled?: boolean) {
  return useQuery<BookmarkFolder[]>({
    queryKey: bookmarkKeys.folders(),
    queryFn: async () => {
      const res = await bookmarkApi.getFolders();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useBookmarkSavedFoldersQuery() {
  return useQuery<BookmarkFolder[]>({
    queryKey: bookmarkKeys.savedFolders(),
    queryFn: async () => {
      const res = await bookmarkApi.getSavedFolders();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBookmarkFolderQuery(folderId: string) {
  return useQuery<BookmarkFolder>({
    queryKey: bookmarkKeys.folder(folderId),
    queryFn: async () => {
      const res = await bookmarkApi.getFolder(folderId);
      return res.data.data;
    },
    enabled: !!folderId && folderId !== "all",
    staleTime: 1000 * 60 * 5,
  });
}

export function useBookmarkSavedListQuery(
  params: GetSavedBookmarksParams & { folderId?: string; page?: number },
) {
  return useQuery<SavedBookmarkListResponse>({
    queryKey: bookmarkKeys.savedList(params.folderId, params, params.page),
    queryFn: async () => {
      const res = await bookmarkApi.getSavedBookmarks(params);
      return res.data.data;
    },
    enabled: !!params.folderId || params.folderId === "all",
    staleTime: 1000 * 60 * 5,
  });
}

export function useBookmarkSavedTotalQuery() {
  return useQuery<number>({
    queryKey: bookmarkKeys.savedTotal(),
    queryFn: async () => {
      const res = await bookmarkApi.getSavedBookmarks({ page: 1, size: 1 });
      return res.data.data.total;
    },
    staleTime: 1000 * 60 * 5,
  });
}
