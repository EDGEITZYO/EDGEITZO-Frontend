import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type { RecentPaperListResponse, RecentPaperStats } from "../types/saved";

export type RecentPaperPeriod = "day" | "week";

export interface GetRecentPapersParams {
  period?: RecentPaperPeriod;
  date?: string;
}

export interface GetRecentPaperStatsParams {
  period?: RecentPaperPeriod;
  date?: string;
}

export const savedApi = {
  getRecentPapers: (params?: GetRecentPapersParams) =>
    apiClient.get<ApiResponse<RecentPaperListResponse>>("/saved/recent", {
      params: { ...params, view: "list" },
    }),

  getRecentPaperStats: (params?: GetRecentPaperStatsParams) =>
    apiClient.get<ApiResponse<RecentPaperStats>>("/saved/recent/stats", {
      params,
    }),
};
