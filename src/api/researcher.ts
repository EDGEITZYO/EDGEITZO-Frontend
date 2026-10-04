import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  ResearcherSearchResponse,
  ResearcherRecentSearchItem,
  SaveRecentResearcherSearchRequest,
  ResearcherSortType,
  ResearcherPaperSortType,
  ResearcherProfile,
  ResearcherPaperListResponse,
  CoauthorListResponse,
  ResearchFlowResponse,
} from "../types/researcher";

export interface GetResearcherSearchParams {
  query: string;
  page?: number;
  size?: number;
  sort?: ResearcherSortType;
}

export interface GetResearcherPapersParams {
  sort?: ResearcherPaperSortType;
  page?: number;
  size?: number;
  coauthor_id?: string;
  year?: number;
  paper_type?: string;
  kci?: boolean;
  sci?: boolean;
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

  getProfile: (researcherId: string) =>
    apiClient.get<ApiResponse<ResearcherProfile>>(
      `/researchers/${researcherId}`,
    ),

  getPapers: (researcherId: string, params?: GetResearcherPapersParams) =>
    apiClient.get<ApiResponse<ResearcherPaperListResponse>>(
      `/researchers/${researcherId}/papers`,
      { params },
    ),

  getCoauthors: (researcherId: string, limit?: number) =>
    apiClient.get<ApiResponse<CoauthorListResponse>>(
      `/researchers/${researcherId}/coauthors`,
      { params: limit !== undefined ? { limit } : undefined },
    ),

  getResearchFlow: (researcherId: string) =>
    apiClient.get<ApiResponse<ResearchFlowResponse>>(
      `/researchers/${researcherId}/research-flow`,
    ),
};
