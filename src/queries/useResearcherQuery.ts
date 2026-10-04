import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  researcherApi,
  type GetResearcherPapersParams,
} from "../api/researcher";
import { researcherKeys } from "./keys";
import type {
  ResearcherSearchResponse,
  ResearcherRecentSearchItem,
  SaveRecentResearcherSearchRequest,
  ResearcherSortType,
  ResearcherProfile,
  ResearcherPaperListResponse,
  CoauthorListResponse,
  ResearchFlowResponse,
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

export function useResearcherProfileQuery(researcherId: string) {
  return useQuery<ResearcherProfile>({
    queryKey: researcherKeys.profile(researcherId),
    queryFn: async () => {
      const res = await researcherApi.getProfile(researcherId);
      return res.data.data;
    },
    enabled: researcherId.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useResearcherPapersQuery(
  researcherId: string,
  params: GetResearcherPapersParams,
) {
  return useQuery<ResearcherPaperListResponse>({
    queryKey: researcherKeys.papers(researcherId, params),
    queryFn: async () => {
      const res = await researcherApi.getPapers(researcherId, params);
      return res.data.data;
    },
    enabled: researcherId.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCoauthorsQuery(researcherId: string) {
  return useQuery<CoauthorListResponse>({
    queryKey: researcherKeys.coauthors(researcherId),
    queryFn: async () => {
      const res = await researcherApi.getCoauthors(researcherId);
      return res.data.data;
    },
    enabled: researcherId.length > 0,
    staleTime: 1000 * 60 * 10,
  });
}

export function useResearchFlowQuery(researcherId: string) {
  return useQuery<ResearchFlowResponse>({
    queryKey: researcherKeys.researchFlow(researcherId),
    queryFn: async () => {
      const res = await researcherApi.getResearchFlow(researcherId);
      return res.data.data;
    },
    enabled: researcherId.length > 0,
    staleTime: 1000 * 60 * 10,
  });
}
