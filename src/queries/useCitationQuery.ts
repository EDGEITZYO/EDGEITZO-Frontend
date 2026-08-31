import { useQuery } from "@tanstack/react-query";
import { citationApi } from "../api/citation";
import { citationKeys } from "./keys";
import type { CitationDirection } from "../types/citation";

export const useCitationGraphQuery = (
  paperId: string,
  direction: CitationDirection,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: citationKeys.graph(paperId, direction),
    queryFn: () => citationApi.getCitationGraph(paperId, direction),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
