import { type PaperType } from './paper';
// ─── 노드 단계 ───────────────────────────────────────────

export type NodeDepth = 1 | 2 | 3 | 4;

// ─── 엣지 레이블 (4가지 축) ──────────────────────────────

export type EdgeAxisLabel = '핵심기술' | '연구대상' | '상위분야' | '응용분야';

// ─── 방향 ─────────────────────────────────────────────────

export type NodeDirection = 'top' | 'right' | 'bottom' | 'left';

// ─── 키워드 노드 데이터 ───────────────────────────────────

export interface KeywordNodeData {
  label: string;               // 노드 표시 텍스트 (예: "LLM 설계")
  depth: NodeDepth;
  direction: NodeDirection;    // 부모로부터 뻗어나온 방향
  description?: string;        // 노드 설명 (툴팁용, API 연동 시 채워짐)
  isExpanded: boolean;         // 하위 키워드 생성 여부
  isSelected: boolean;         // 현재 선택된 노드 여부
  isFocused: boolean;          // 브레드크럼 기준 현재 포커스 노드 여부
}

// ─── 브레드크럼 아이템 ────────────────────────────────────

export interface BreadcrumbItem {
  nodeId: string;
  label: string;
  depth: NodeDepth;
}

// ─── 논문 카드 (키워드맵용) ──────────────────────────────

export interface KeywordPaper {
  id: string;
  source: string;             // 출처 (예: "2024한국정보과학회 논문지")
  date: string;
  title: string;
  authors: string[];
  keywords: string[];
  kciType: string;            // "KCI O" 등
  citationCount: number;
  isBookmarked: boolean;
  paperType?: PaperType;
}

// ─── 논문 상세 ────────────────────────────────────────────

export interface KeywordPaperDetail extends KeywordPaper {
  abstract: string;
  relatedPapers: KeywordPaper[];
}

// ─── 논문 목록 응답 ──────────────────────────────────────

export interface KeywordPaperListResult {
  keyword: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  papers: KeywordPaper[];
}

// ─── 필터 ─────────────────────────────────────────────────

export type KMPaperSortType = 'relevance' | 'newest' | 'oldest';

export interface KMPaperFilter {
  sort: KMPaperSortType;
  publishYear?: string;
  paperType?: string;
  sciOnly?: boolean;
  kciOnly?: boolean;
}

// ─── 키워드맵 생성 요청/응답 ─────────────────────────────

export interface KeywordMapGenerateRequest {
  researchField: string;      // 연구 분야 (예: "LLM 설계")
}

export interface KeywordChildNode {
  label: string;
  axisLabel: EdgeAxisLabel;
}

export interface KeywordMapGenerateResponse {
  rootKeyword: string;
  children: KeywordChildNode[]; // 최소 2개, 최대 7개
}

// ─── 하위 키워드 확장 요청/응답 ──────────────────────────

export interface KeywordExpandRequest {
  keyword: string;
  depth: NodeDepth;
  parentPath: string[];       // 브레드크럼 경로 (중복 제거용)
}

export interface KeywordExpandResponse {
  children: KeywordChildNode[];
}