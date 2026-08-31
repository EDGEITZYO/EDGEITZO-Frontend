import apiClient from "./client";
import type {
  CitationDirection,
  CitationGraphResponse,
  CitationExpandResponse,
} from "../types/citation";

interface ExpandCitationNodeBody {
  direction: CitationDirection;
  existing_node_keys: string[];
  current_tier: number;
}

export const citationApi = {
  getCitationGraph: async (
    paperId: string,
    direction: CitationDirection,
  ): Promise<CitationGraphResponse> => {
    const response = await apiClient.get<{ data: CitationGraphResponse }>(
      `/papers/${paperId}/citation-graph`,
      { params: { direction } },
    );
    return response.data.data;
  },

  expandCitationNode: async (
    paperId: string,
    nodeKey: string,
    body: ExpandCitationNodeBody,
  ): Promise<CitationExpandResponse> => {
    const response = await apiClient.post<{ data: CitationExpandResponse }>(
      `/papers/${paperId}/citation-graph/node/${nodeKey}/expand`,
      body,
    );
    return response.data.data;
  },
};
