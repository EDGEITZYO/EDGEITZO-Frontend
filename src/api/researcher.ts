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
  CoauthorPairSummaryResponse,
  CoauthoredPaperListResponse,
  CoauthoredPaperSortType,
  CoauthoredPaperRoleFilter,
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
  year_start?: number;
  year_end?: number;
  paper_type?: string;
  kci?: boolean;
  sci?: boolean;
}

export interface GetCoauthorPairSummaryParams {
  keyword_limit?: number;
}

export interface GetCoauthoredPapersParams {
  sort?: CoauthoredPaperSortType;
  researcher_role?: CoauthoredPaperRoleFilter | null;
  coauthor_role?: CoauthoredPaperRoleFilter | null;
  paper_type?: string | null;
  year_start?: number | null;
  year_end?: number | null;
  kci?: boolean | null;
  sci?: boolean | null;
  page?: number;
  size?: number;
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

  getCoauthorPairSummary: (
    researcherId: string,
    coauthorId: string,
    params?: GetCoauthorPairSummaryParams,
  ) =>
    apiClient.get<ApiResponse<CoauthorPairSummaryResponse>>(
      `/researchers/${researcherId}/coauthors/${coauthorId}`,
      { params },
    ),

  getCoauthoredPapers: (
    researcherId: string,
    coauthorId: string,
    params?: GetCoauthoredPapersParams,
  ) =>
    apiClient.get<ApiResponse<CoauthoredPaperListResponse>>(
      `/researchers/${researcherId}/coauthors/${coauthorId}/papers`,
      { params },
    ),
};
