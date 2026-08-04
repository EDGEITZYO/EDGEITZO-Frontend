import { useQuery } from "@tanstack/react-query";
import { savedApi } from "../api/saved";
import { savedKeys } from "./keys";
import type { RecentPaperListResponse, RecentPaperStats } from "../types/saved";

export function useRecentPapersQuery(periodMode: string, dateParam: string) {
  return useQuery<RecentPaperListResponse>({
    queryKey: savedKeys.recentPapers(periodMode, dateParam),
    queryFn: async () => {
      const res = await savedApi.getRecentPapers({
        period: periodMode as "day" | "week",
        date: dateParam,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecentPaperStatsQuery(
  periodMode: string,
  dateParam: string,
) {
  return useQuery<RecentPaperStats>({
    queryKey: savedKeys.recentPaperStats(periodMode, dateParam),
    queryFn: async () => {
      const res = await savedApi.getRecentPaperStats({
        period: periodMode as "day" | "week",
        date: dateParam,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
