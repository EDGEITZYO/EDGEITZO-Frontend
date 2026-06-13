import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type { PaperDetail, SimilarPaper } from "../types/paper";

export const paperApi = {
  getPaper: (paperId: string) =>
    apiClient.get<ApiResponse<PaperDetail>>(`/papers/${paperId}`),

  getSimilarPapers: (paperId: string) =>
    apiClient.get<ApiResponse<SimilarPaper[]>>(`/papers/${paperId}/similar`),

  recordRecentRead: (paperId: string, searchId?: string) =>
    apiClient.post<ApiResponse<null>>("/home/recent-reads", {
      paper_id: paperId,
      ...(searchId ? { search_id: searchId } : {}),
    }),
};
