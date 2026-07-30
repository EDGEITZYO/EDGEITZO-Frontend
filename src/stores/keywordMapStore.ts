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
  nodes: KeywordNode[];
  edges: Edge[];
  anchorKey: string;
  anchorLabel: string;
  hasMoreParents: boolean;
  hasMoreChildren: boolean;
  breadcrumbs: BreadcrumbItem[];
  selectedNodeKey: string | null;
  hoveredNodeKey: string | null;
  isPaperPanelOpen: boolean;
  panelNodeKey: string | null;
  panelKeyword: string | null;
  currentPage: number;
  paperFilter: KMPaperFilter;
  isLoading: boolean;
  loadError: string | null;
}

interface KeywordMapActions {
  setGraph: (params: {
    nodes: KeywordNode[];
    edges: Edge[];
    anchorKey: string;
    anchorLabel: string;
    hasMoreParents: boolean;
    hasMoreChildren: boolean;
  }) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  popBreadcrumbTo: (nodeKey: string) => void;
  setBreadcrumbAtTier: (tier: number, item: BreadcrumbItem) => void;
  selectNode: (nodeKey: string | null) => void;
  hoverNode: (nodeKey: string | null) => void;
  openPaperPanel: (nodeKey: string, keyword: string) => void;
  closePaperPanel: () => void;
  setCurrentPage: (page: number) => void;
  setPaperFilter: (filter: Partial<KMPaperFilter>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadError: (error: string | null) => void;
  reset: () => void;
}

// ─── 초기값 ───────────────────────────────────────────────

const initialState: KeywordMapState = {
  nodes: [],
  edges: [],
  anchorKey: "",
  anchorLabel: "",
  hasMoreParents: false,
  hasMoreChildren: false,
  breadcrumbs: [],
  selectedNodeKey: null,
  hoveredNodeKey: null,
  isPaperPanelOpen: false,
  panelNodeKey: null,
  panelKeyword: null,
  currentPage: 1,
  paperFilter: {
    sort: "relevance",
  },
  isLoading: false,
  loadError: null,
};

// ─── 스토어 ───────────────────────────────────────────────

const useKeywordMapStore = create<KeywordMapState & KeywordMapActions>()(
  (set) => ({
    ...initialState,

    setGraph: ({
      nodes,
      edges,
      anchorKey,
      anchorLabel,
      hasMoreParents,
      hasMoreChildren,
    }) =>
      set({
        nodes,
        edges,
        anchorKey,
        anchorLabel,
        hasMoreParents,
        hasMoreChildren,
      }),

    setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

    popBreadcrumbTo: (nodeKey) =>
      set((state) => {
        const index = state.breadcrumbs.findIndex((b) => b.nodeKey === nodeKey);
        if (index === -1) return state;
        return { breadcrumbs: state.breadcrumbs.slice(0, index + 1) };
      }),

    setBreadcrumbAtTier: (tier, item) =>
      set((state) => {
        const filtered = state.breadcrumbs.filter((b) => b.tier < tier);
        return { breadcrumbs: [...filtered, item] };
      }),

    selectNode: (nodeKey) => set({ selectedNodeKey: nodeKey }),

    hoverNode: (nodeKey) => set({ hoveredNodeKey: nodeKey }),

    openPaperPanel: (nodeKey, keyword) =>
      set({
        isPaperPanelOpen: true,
        panelNodeKey: nodeKey,
        panelKeyword: keyword,
        currentPage: 1,
        paperFilter: { sort: "relevance" },
      }),

    closePaperPanel: () =>
      set({
        isPaperPanelOpen: false,
        panelNodeKey: null,
        panelKeyword: null,
        currentPage: 1,
        paperFilter: { sort: "relevance" },
      }),

    setCurrentPage: (page) => set({ currentPage: page }),

    setPaperFilter: (filter) =>
      set((state) => ({
        paperFilter: { ...state.paperFilter, ...filter },
      })),

    setIsLoading: (isLoading) => set({ isLoading }),
    setLoadError: (error) => set({ loadError: error }),
    reset: () => set(initialState),
  }),
);

// ─── 셀렉터 훅 ────────────────────────────────────────────

export const useKeywordMapGraph = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      anchorKey: state.anchorKey,
      anchorLabel: state.anchorLabel,
      hasMoreParents: state.hasMoreParents,
      hasMoreChildren: state.hasMoreChildren,
    })),
  );

export const useBreadcrumbs = () =>
  useKeywordMapStore((state) => state.breadcrumbs);

export const useSelectedNodeKey = () =>
  useKeywordMapStore((state) => state.selectedNodeKey);

export const useHoveredNodeKey = () =>
  useKeywordMapStore((state) => state.hoveredNodeKey);

export const usePaperPanel = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      isPaperPanelOpen: state.isPaperPanelOpen,
      panelNodeKey: state.panelNodeKey,
      panelKeyword: state.panelKeyword,
      currentPage: state.currentPage,
      paperFilter: state.paperFilter,
    })),
  );

export const useKeywordMapLoading = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      loadError: state.loadError,
    })),
  );

export const useKeywordMapActions = () =>
  useKeywordMapStore(
    useShallow((state) => ({
      setGraph: state.setGraph,
      setBreadcrumbs: state.setBreadcrumbs,
      popBreadcrumbTo: state.popBreadcrumbTo,
      setBreadcrumbAtTier: state.setBreadcrumbAtTier,
      selectNode: state.selectNode,
      hoverNode: state.hoverNode,
      openPaperPanel: state.openPaperPanel,
      closePaperPanel: state.closePaperPanel,
      setCurrentPage: state.setCurrentPage,
      setPaperFilter: state.setPaperFilter,
      setIsLoading: state.setIsLoading,
      setLoadError: state.setLoadError,
      reset: state.reset,
    })),
  );

export default useKeywordMapStore;
