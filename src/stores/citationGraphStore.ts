import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type {
  CitationTab,
  PaperCitationNode,
  PaperCitationEdge,
  CitationPaperCard,
  CitationGraphResponse,
  CitationExpandResponse,
} from "../types/citation";

// ─── 타입 ─────────────────────────────────────────────────

interface CitationGraphState {
  tab: CitationTab;
  centerKey: string;
  referenceNodes: PaperCitationNode[];
  referenceEdges: PaperCitationEdge[];
  citingNodes: PaperCitationNode[];
  citingEdges: PaperCitationEdge[];
  papers: CitationPaperCard[];
  nodeCount: number;
  selectedNodeKey: string | null;
}

interface CitationGraphActions {
  setTab: (tab: CitationTab) => void;
  initReference: (data: CitationGraphResponse) => void;
  initCiting: (data: CitationGraphResponse) => void;
  expandNode: (response: CitationExpandResponse) => void;
  selectNode: (key: string | null) => void;
  reset: () => void;
}

// ─── 초기값 ───────────────────────────────────────────────

const initialState: CitationGraphState = {
  tab: "reference",
  centerKey: "",
  referenceNodes: [],
  referenceEdges: [],
  citingNodes: [],
  citingEdges: [],
  papers: [],
  nodeCount: 0,
  selectedNodeKey: null,
};

// ─── 스토어 ───────────────────────────────────────────────

const useCitationGraphStore = create<
  CitationGraphState & CitationGraphActions
>()((set) => ({
  ...initialState,

  setTab: (tab) => set({ tab, selectedNodeKey: null }),

  initReference: (data) =>
    set((state) => ({
      centerKey: data.center.key,
      referenceNodes: data.nodes,
      referenceEdges: data.edges,
      papers: [
        ...data.papers,
        ...state.papers.filter(
          (p) => !data.papers.some((np) => np.key === p.key),
        ),
      ],
      nodeCount:
        data.nodes.filter((n) => n.key !== data.center.key).length +
        state.citingNodes.filter((n) => n.key !== data.center.key).length,
    })),

  initCiting: (data) =>
    set((state) => ({
      citingNodes: data.nodes.filter((n) => n.key !== state.centerKey),
      citingEdges: data.edges,
      papers: [
        ...state.papers,
        ...data.papers.filter(
          (p) => !state.papers.some((existing) => existing.key === p.key),
        ),
      ],
      nodeCount:
        state.referenceNodes.filter((n) => n.key !== state.centerKey).length +
        data.nodes.filter((n) => n.key !== state.centerKey).length,
    })),

  expandNode: (response) =>
    set((state) => {
      const isReference = response.direction === "reference";
      const existingKeys = new Set([
        ...state.referenceNodes.map((n) => n.key),
        ...state.citingNodes.map((n) => n.key),
      ]);

      const newNodes = response.new_nodes.filter(
        (n) => !existingKeys.has(n.key),
      );
      const newPapers = response.papers.filter(
        (p) => !state.papers.some((existing) => existing.key === p.key),
      );

      const updatedReferenceNodes = isReference
        ? [...state.referenceNodes, ...newNodes]
        : state.referenceNodes;
      const updatedCitingNodes = !isReference
        ? [...state.citingNodes, ...newNodes]
        : state.citingNodes;

      return {
        referenceNodes: updatedReferenceNodes,
        referenceEdges: isReference
          ? [...state.referenceEdges, ...response.new_edges]
          : state.referenceEdges,
        citingNodes: updatedCitingNodes,
        citingEdges: !isReference
          ? [...state.citingEdges, ...response.new_edges]
          : state.citingEdges,
        papers: [...state.papers, ...newPapers],
        nodeCount:
          updatedReferenceNodes.filter((n) => n.key !== state.centerKey)
            .length +
          updatedCitingNodes.filter((n) => n.key !== state.centerKey).length,
      };
    }),

  selectNode: (key) => set({ selectedNodeKey: key }),

  reset: () => set(initialState),
}));

// ─── 셀렉터 훅 ────────────────────────────────────────────

export const useCitationTab = () => useCitationGraphStore((state) => state.tab);

export const useCitationGraphData = () =>
  useCitationGraphStore(
    useShallow((state) => ({
      centerKey: state.centerKey,
      referenceNodes: state.referenceNodes,
      referenceEdges: state.referenceEdges,
      citingNodes: state.citingNodes,
      citingEdges: state.citingEdges,
    })),
  );

export const useCitationPapers = () =>
  useCitationGraphStore((state) => state.papers);

export const useCitationNodeCount = () =>
  useCitationGraphStore((state) => state.nodeCount);

export const useCitationSelectedNode = () =>
  useCitationGraphStore((state) => state.selectedNodeKey);

export const useCitationGraphActions = () =>
  useCitationGraphStore(
    useShallow((state) => ({
      setTab: state.setTab,
      initReference: state.initReference,
      initCiting: state.initCiting,
      expandNode: state.expandNode,
      selectNode: state.selectNode,
      reset: state.reset,
    })),
  );

export default useCitationGraphStore;
