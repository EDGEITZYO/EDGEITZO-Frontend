import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  ResearcherSearchResponse,
  ResearcherRecentSearchItem,
  SaveRecentResearcherSearchRequest,
  ResearcherSortType,
} from "../types/researcher";

export interface GetResearcherSearchParams {
  query: string;
  page?: number;
  size?: number;
  sort?: ResearcherSortType;
}

export const researcherApi = {
  search: (params: GetResearcherSearchParams) =>
    apiClient.get<ApiResponse<ResearcherSearchResponse>>(
      "/researchers/search",
      { params },
    ),

  getRecentSearches: () =>
    apiClient.get<ApiResponse<{ items: ResearcherRecentSearchItem[] }>>(
      "/researchers/recent-searches",
    ),

  saveRecentSearch: (body: SaveRecentResearcherSearchRequest) =>
    apiClient.post<ApiResponse<null>>("/researchers/recent-searches", body),
};
