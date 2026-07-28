import apiClient from "./client";
import type { ApiResponse } from "../types/auth";
import type {
  KMGraphResponse,
  KMLoadParams,
  KMRecenterRequest,
  KMExpandRequest,
  KMExpandResponse,
  KMLastAnchorResponse,
  KMNodeDetailResponse,
  KMNodePapersResponse,
  KMPaperFilter,
} from "../types/keywordMap";

export const keywordMapApi = {
  // 키워드맵 최초 앵커 로드
  // GET /keyword-map?keyword=...&user_id=...
  loadMap: (params: KMLoadParams) =>
    apiClient.get<ApiResponse<KMGraphResponse>>("/keyword-map", { params }),

  // 마지막 조회 앵커 복원 (홈 탐색 이력용)
  // GET /keyword-search/map/{user_id}
  getLastAnchor: (userId: string) =>
    apiClient.get<ApiResponse<KMLastAnchorResponse>>(
      `/keyword-search/map/${userId}`,
    ),

  // 노드 재중심화
  // POST /keyword-map/node/{node_key}/recenter
  recenter: (nodeKey: string, body: KMRecenterRequest, userId?: string) =>
    apiClient.post<ApiResponse<KMGraphResponse>>(
      `/keyword-map/node/${encodeURIComponent(nodeKey)}/recenter`,
      body,
      { params: userId ? { user_id: userId } : undefined },
    ),

  // 노드 제자리 확장
  // POST /keyword-map/node/{node_key}/expand
  expandNode: (nodeKey: string, body: KMExpandRequest) =>
    apiClient.post<ApiResponse<KMExpandResponse>>(
      `/keyword-map/node/${encodeURIComponent(nodeKey)}/expand`,
      body,
    ),

  // 키워드 노드 논문 목록
  // GET /keyword-map/node/{node_key}/papers
  getNodePapers: (
    nodeKey: string,
    filter: KMPaperFilter & {
      user_id?: string;
      keyword_path?: string;
      map_session_id?: string;
      research_field?: string;
    },
  ) =>
    apiClient.get<ApiResponse<KMNodePapersResponse>>(
      `/keyword-map/node/${encodeURIComponent(nodeKey)}/papers`,
      { params: filter },
    ),

  // 키워드 노드 상세 정보 (정의 + 연구자)
  // GET /keyword-map/node/{node_key}/detail
  getNodeDetail: (nodeKey: string) =>
    apiClient.get<ApiResponse<KMNodeDetailResponse>>(
      `/keyword-map/node/${encodeURIComponent(nodeKey)}/detail`,
    ),
};
