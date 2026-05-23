import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { type Node, type Edge } from 'reactflow';
import {
  type KeywordNodeData,
  type BreadcrumbItem,
  type KMPaperFilter,
  type KeywordPaper,
} from '../types/keywordMap';

// ─── 타입 ─────────────────────────────────────────────────

type KeywordNode = Node<KeywordNodeData>;

interface KeywordMapState {
  // 연구 분야
  researchField: string;

  // 그래프
  nodes: KeywordNode[];
  edges: Edge[];

  // 브레드크럼
  breadcrumbs: BreadcrumbItem[];

  // 선택된 노드 (툴팁용)
  selectedNodeId: string | null;

  // 논문 목록 패널
  isPaperPanelOpen: boolean;
  panelKeyword: string | null;
  papers: KeywordPaper[];
  totalCount: number;
  currentPage: number;
  paperFilter: KMPaperFilter;

  // 논문 상세 패널
  selectedPaperId: string | null;

  // 키워드맵 생성 상태
  isGenerating: boolean;
  generateError: string | null;
}

interface KeywordMapActions {
  // 연구 분야
  setResearchField: (field: string) => void;

  // 그래프
  setNodes: (nodes: KeywordNode[]) => void;
  setEdges: (edges: Edge[]) => void;

  // 브레드크럼
  pushBreadcrumb: (item: BreadcrumbItem) => void;
  popBreadcrumbTo: (nodeId: string) => void;

  // 노드 선택
  selectNode: (nodeId: string | null) => void;

  // 논문 패널
  openPaperPanel: (keyword: string) => void;
  closePaperPanel: () => void;
  setPapers: (papers: KeywordPaper[], totalCount: number) => void;
  setCurrentPage: (page: number) => void;
  setPaperFilter: (filter: Partial<KMPaperFilter>) => void;

  // 논문 상세
  selectPaper: (paperId: string | null) => void;

  // 생성 상태
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerateError: (error: string | null) => void;

  // 초기화
  reset: () => void;
}

// ─── 초기값 ───────────────────────────────────────────────

const initialState: KeywordMapState = {
  researchField: '',
  nodes: [],
  edges: [],
  breadcrumbs: [],
  selectedNodeId: null,
  isPaperPanelOpen: false,
  panelKeyword: null,
  papers: [],
  totalCount: 0,
  currentPage: 1,
  paperFilter: {
    sort: 'relevance',
  },
  selectedPaperId: null,
  isGenerating: false,
  generateError: null,
};

// ─── 스토어 ───────────────────────────────────────────────

const useKeywordMapStore = create<KeywordMapState & KeywordMapActions>()(
  (set) => ({
    ...initialState,

    setResearchField: (field) => set({ researchField: field }),

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    pushBreadcrumb: (item) =>
      set((state) => ({
        breadcrumbs: [...state.breadcrumbs, item],
      })),

    popBreadcrumbTo: (nodeId) =>
      set((state) => {
        const index = state.breadcrumbs.findIndex((b) => b.nodeId === nodeId);
        if (index === -1) return state;
        return { breadcrumbs: state.breadcrumbs.slice(0, index + 1) };
      }),

    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

    openPaperPanel: (keyword) =>
      set({
        isPaperPanelOpen: true,
        panelKeyword: keyword,
        papers: [],
        totalCount: 0,
        currentPage: 1,
        selectedPaperId: null,
      }),

    closePaperPanel: () =>
      set({
        isPaperPanelOpen: false,
        panelKeyword: null,
        papers: [],
        totalCount: 0,
        currentPage: 1,
        selectedPaperId: null,
      }),

    setPapers: (papers, totalCount) => set({ papers, totalCount }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setPaperFilter: (filter) =>
      set((state) => ({
        paperFilter: { ...state.paperFilter, ...filter },
      })),

    selectPaper: (paperId) => set({ selectedPaperId: paperId }),

    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setGenerateError: (error) => set({ generateError: error }),

    reset: () => set(initialState),
  })
);

// ─── 셀렉터 훅 ────────────────────────────────────────────

export const useResearchField = () =>
  useKeywordMapStore((state) => state.researchField);

export const useKeywordMapGraph = () =>
  useKeywordMapStore(
    useShallow((state) => ({ nodes: state.nodes, edges: state.edges }))
  );

export const useBreadcrumbs = () =>
  useKeywordMapStore((state) => state.breadcrumbs);

export const useSelectedNodeId = () =>
  useKeywordMapStore((state) => state.selectedNodeId);

export const usePaperPanel = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      isPaperPanelOpen: state.isPaperPanelOpen,
      panelKeyword: state.panelKeyword,
      papers: state.papers,
      totalCount: state.totalCount,
      currentPage: state.currentPage,
      paperFilter: state.paperFilter,
    }))
  );

export const useSelectedPaperId = () =>
  useKeywordMapStore((state) => state.selectedPaperId);

export const useKeywordMapGenerating = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      isGenerating: state.isGenerating,
      generateError: state.generateError,
    }))
  );

export const useKeywordMapActions = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      setResearchField: state.setResearchField,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      pushBreadcrumb: state.pushBreadcrumb,
      popBreadcrumbTo: state.popBreadcrumbTo,
      selectNode: state.selectNode,
      openPaperPanel: state.openPaperPanel,
      closePaperPanel: state.closePaperPanel,
      setPapers: state.setPapers,
      setCurrentPage: state.setCurrentPage,
      setPaperFilter: state.setPaperFilter,
      selectPaper: state.selectPaper,
      setIsGenerating: state.setIsGenerating,
      setGenerateError: state.setGenerateError,
      reset: state.reset,
    }))
  );

export default useKeywordMapStore;