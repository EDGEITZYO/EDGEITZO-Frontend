import { useQuery } from "@tanstack/react-query";
import { paperApi } from "../api/paper";
import { paperKeys } from "./keys";
import type { PaperDetail, SimilarPaper } from "../types/paper";

export function usePaperDetailQuery(paperId: string) {
  return useQuery<PaperDetail>({
    queryKey: paperKeys.detail(paperId),
    queryFn: async () => {
      const res = await paperApi.getPaper(paperId);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePaperSimilarQuery(paperId: string) {
  return useQuery<SimilarPaper[]>({
    queryKey: paperKeys.similar(paperId),
    queryFn: async () => {
      const res = await paperApi.getSimilarPapers(paperId);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
