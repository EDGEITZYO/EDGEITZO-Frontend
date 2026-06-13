import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { type Node, type Edge } from "reactflow";
import {
  type KeywordNodeData,
  type BreadcrumbItem,
  type KMPaperFilter,
} from "../types/keywordMap";

// ─── 타입 ─────────────────────────────────────────────────

type KeywordNode = Node<KeywordNodeData>;

interface KeywordMapState {
  researchField: string;
  nodes: KeywordNode[];
  edges: Edge[];
  breadcrumbs: BreadcrumbItem[];
  selectedNodeId: string | null;
  isPaperPanelOpen: boolean;
  panelNodeId: string | null;
  panelKeyword: string | null;
  totalCount: number;
  currentPage: number;
  paperFilter: KMPaperFilter;
  selectedPaperId: string | null;
  isGenerating: boolean;
  generateError: string | null;
  searchId: string | null;
}

interface KeywordMapActions {
  setResearchField: (field: string) => void;
  setNodes: (nodes: KeywordNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  pushBreadcrumb: (item: BreadcrumbItem) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  popBreadcrumbTo: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  openPaperPanel: (nodeId: string, keyword: string) => void;
  closePaperPanel: () => void;
  setCurrentPage: (page: number) => void;
  setPaperFilter: (filter: Partial<KMPaperFilter>) => void;
  selectPaper: (paperId: string | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerateError: (error: string | null) => void;
  reset: () => void;
  setSearchId: (searchId: string | null) => void;
}

// ─── 초기값 ───────────────────────────────────────────────

const initialState: KeywordMapState = {
  researchField: "",
  nodes: [],
  edges: [],
  breadcrumbs: [],
  selectedNodeId: null,
  isPaperPanelOpen: false,
  panelNodeId: null,
  panelKeyword: null,
  totalCount: 0,
  currentPage: 1,
  paperFilter: {
    sort: "date",
  },
  selectedPaperId: null,
  isGenerating: false,
  generateError: null,
  searchId: null,
};

// ─── 스토어 ───────────────────────────────────────────────

const useKeywordMapStore = create<KeywordMapState & KeywordMapActions>()(
  (set) => ({
    ...initialState,

    setResearchField: (field) => set({ researchField: field }),
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    pushBreadcrumb: (item) =>
      set((state) => ({ breadcrumbs: [...state.breadcrumbs, item] })),

    setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

    popBreadcrumbTo: (nodeId) =>
      set((state) => {
        const index = state.breadcrumbs.findIndex((b) => b.nodeId === nodeId);
        if (index === -1) return state;
        return { breadcrumbs: state.breadcrumbs.slice(0, index + 1) };
      }),

    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

    openPaperPanel: (nodeId, keyword) =>
      set({
        isPaperPanelOpen: true,
        panelNodeId: nodeId,
        panelKeyword: keyword,
        totalCount: 0,
        currentPage: 1,
        selectedPaperId: null,
      }),

    closePaperPanel: () =>
      set({
        isPaperPanelOpen: false,
        panelNodeId: null,
        panelKeyword: null,
        totalCount: 0,
        currentPage: 1,
        selectedPaperId: null,
      }),

    setCurrentPage: (page) => set({ currentPage: page }),

    setPaperFilter: (filter) =>
      set((state) => ({
        paperFilter: { ...state.paperFilter, ...filter },
      })),

    selectPaper: (paperId) => set({ selectedPaperId: paperId }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setGenerateError: (error) => set({ generateError: error }),
    reset: () => set(initialState),
    setSearchId: (searchId) => set({ searchId }),
  }),
);

// ─── 셀렉터 훅 ────────────────────────────────────────────

export const useResearchField = () =>
  useKeywordMapStore((state) => state.researchField);

export const useKeywordMapGraph = () =>
  useKeywordMapStore(
    useShallow((state) => ({ nodes: state.nodes, edges: state.edges })),
  );

export const useBreadcrumbs = () =>
  useKeywordMapStore((state) => state.breadcrumbs);

export const useSelectedNodeId = () =>
  useKeywordMapStore((state) => state.selectedNodeId);

export const usePaperPanel = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      isPaperPanelOpen: state.isPaperPanelOpen,
      panelNodeId: state.panelNodeId,
      panelKeyword: state.panelKeyword,
      totalCount: state.totalCount,
      currentPage: state.currentPage,
      paperFilter: state.paperFilter,
    })),
  );

export const useSelectedPaperId = () =>
  useKeywordMapStore((state) => state.selectedPaperId);

export const useKeywordMapGenerating = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      isGenerating: state.isGenerating,
      generateError: state.generateError,
    })),
  );

export const useKeywordMapActions = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      setResearchField: state.setResearchField,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      pushBreadcrumb: state.pushBreadcrumb,
      setBreadcrumbs: state.setBreadcrumbs,
      popBreadcrumbTo: state.popBreadcrumbTo,
      selectNode: state.selectNode,
      openPaperPanel: state.openPaperPanel,
      closePaperPanel: state.closePaperPanel,
      setCurrentPage: state.setCurrentPage,
      setPaperFilter: state.setPaperFilter,
      selectPaper: state.selectPaper,
      setIsGenerating: state.setIsGenerating,
      setGenerateError: state.setGenerateError,
      reset: state.reset,
      setSearchId: state.setSearchId,
    })),
  );

export default useKeywordMapStore;
