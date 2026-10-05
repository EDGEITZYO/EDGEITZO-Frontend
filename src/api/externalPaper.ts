import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  OverseasPaperDetail,
  RelatedCorpusPapersResponse,
  PaperAdditionRequestStatus,
} from "../types/paper";

export const externalPaperApi = {
  getDetail: (externalId: string) =>
    apiClient.get<ApiResponse<OverseasPaperDetail>>(
      `/papers/citation-graph/external/${externalId}`,
    ),

  getRelated: (externalId: string) =>
    apiClient.get<ApiResponse<RelatedCorpusPapersResponse>>(
      `/papers/citation-graph/external/${externalId}/related`,
    ),

  getAdditionRequestStatus: (externalId: string) =>
    apiClient.get<ApiResponse<PaperAdditionRequestStatus>>(
      `/papers/citation-graph/external/${externalId}/addition-request`,
    ),

  postAdditionRequest: (externalId: string) =>
    apiClient.post<ApiResponse<PaperAdditionRequestStatus>>(
      `/papers/citation-graph/external/${externalId}/addition-request`,
    ),
};
