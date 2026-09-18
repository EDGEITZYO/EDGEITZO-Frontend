import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { researcherApi } from "../api/researcher";
import { researcherKeys } from "./keys";
import type {
  ResearcherSearchResponse,
  ResearcherRecentSearchItem,
  SaveRecentResearcherSearchRequest,
  ResearcherSortType,
} from "../types/researcher";

export function useResearcherSearchQuery(
  query: string,
  page: number,
  sort: ResearcherSortType,
) {
  return useQuery<ResearcherSearchResponse>({
    queryKey: researcherKeys.search(query, page, sort),
    queryFn: async () => {
      const res = await researcherApi.search({ query, page, size: 6, sort });
      return res.data.data;
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useResearcherRecentSearchesQuery() {
  return useQuery<ResearcherRecentSearchItem[]>({
    queryKey: researcherKeys.recentSearches(),
    queryFn: async () => {
      const res = await researcherApi.getRecentSearches();
      return res.data.data.items;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveRecentResearcherSearchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SaveRecentResearcherSearchRequest) =>
      researcherApi.saveRecentSearch(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: researcherKeys.recentSearches(),
      });
    },
  });
}
