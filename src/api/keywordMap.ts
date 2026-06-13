import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  KMMapResponse,
  KMGenerateResponse,
  KMExpandRequest,
  KMExpandResponse,
  KMNodePapersResponse,
  KMPaperFilter,
} from "../types/keywordMap";

export const keywordMapApi = {
  // 키워드맵 생성
  // POST /keyword-map/generate
  generate: (researchField: string, userId: string) =>
    apiClient.post<ApiResponse<KMGenerateResponse>>("/keyword-map/generate", {
      research_field: researchField,
      user_id: userId,
    }),

  // 저장된 키워드맵 조회
  // GET /keyword-search/map/{user_id}
  getMap: (userId: string) =>
    apiClient.get<ApiResponse<KMMapResponse>>(`/keyword-search/map/${userId}`),

  // 노드 하위 키워드 확장
  // POST /keyword-map/node/{node_id}/expand
  expandNode: (nodeId: string, body: KMExpandRequest) =>
    apiClient.post<ApiResponse<KMExpandResponse>>(
      `/keyword-map/node/${encodeURIComponent(nodeId)}/expand`,
      body,
    ),

  // 노드 연결 논문 목록
  // GET /keyword-map/node/{node_id}/papers
  getNodePapers: (
    nodeId: string,
    filter: KMPaperFilter & { page: number; size: number; user_id?: string; keyword_path?: string },
  ) =>
    apiClient.get<ApiResponse<KMNodePapersResponse>>(
      `/keyword-map/node/${encodeURIComponent(nodeId)}/papers`,
      { params: filter },
    ),
};
