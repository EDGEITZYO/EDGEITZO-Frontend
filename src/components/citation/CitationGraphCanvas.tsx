import { useEffect, useMemo, useCallback } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import dagre from "@dagrejs/dagre";
import { Box } from "@mui/material";
import "reactflow/dist/style.css";
import CitationNode, { type CitationNodeData } from "./CitationNode";
import type {
  PaperCitationNode,
  PaperCitationEdge,
  CitationPaperCard,
  CitationDirection,
  CitationTab,
} from "../../types/citation";
import CitationEdge from "./CitationEdge";

const NODE_WIDTH = 360;
const NODE_HEIGHT = 76;
const CENTER_SIZE = 160;
const RANKSEP = 80;
const NODESEP = 20;

const nodeTypes = { citationNode: CitationNode };
const edgeTypes = { citationEdge: CitationEdge };

// ─── 노드 data 생성 헬퍼 ─────────────────────────────────

const makeNodeData = (
  node: PaperCitationNode,
  direction: CitationDirection,
  isCenter: boolean,
  isSelected: boolean,
  isLeft: boolean,
  papers: CitationPaperCard[],
): CitationNodeData => ({
  title: node.title,
  title_en: node.title_en,
  pubyear: node.pubyear,
  authors: papers.find((p) => p.key === node.key)?.authors ?? null,
  in_service: node.in_service,
  has_more: node.has_more,
  direction,
  isCenter,
  isSelected,
  isExpanding: false,
  isLeft,
  paper: papers.find((p) => p.key === node.key) ?? null,
});

// ─── 참고문헌 레이아웃 ────────────────────────────────────

const getReferenceLayout = (
  nodes: PaperCitationNode[],
  centerKey: string,
  selectedNodeKey: string | null,
  papers: CitationPaperCard[],
): { nodes: Node<CitationNodeData>[]; edges: Edge[] } => {
  const childNodes = nodes.filter((n) => n.key !== centerKey);
  const leftNodes = childNodes.filter((_, i) => i % 2 !== 0);
  const rightNodes = childNodes.filter((_, i) => i % 2 === 0);

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", ranksep: RANKSEP, nodesep: NODESEP });

  g.setNode(centerKey, { width: CENTER_SIZE, height: CENTER_SIZE });
  leftNodes.forEach((n) => {
    g.setNode(n.key, { width: NODE_WIDTH, height: NODE_HEIGHT });
    g.setEdge(n.key, centerKey);
  });
  rightNodes.forEach((n) => {
    g.setNode(n.key, { width: NODE_WIDTH, height: NODE_HEIGHT });
    g.setEdge(centerKey, n.key);
  });

  dagre.layout(g);

  const layoutedNodes: Node<CitationNodeData>[] = nodes.map((node) => {
    const { x, y } = g.node(node.key);
    const isCenter = node.key === centerKey;
    const w = isCenter ? CENTER_SIZE : NODE_WIDTH;
    const h = isCenter ? CENTER_SIZE : NODE_HEIGHT;
    const isLeft = leftNodes.some((n) => n.key === node.key);

    return {
      id: node.key,
      type: "citationNode",
      position: { x: x - w / 2, y: y - h / 2 },
      data: makeNodeData(
        node,
        "reference",
        isCenter,
        node.key === selectedNodeKey,
        isLeft,
        papers,
      ),
    };
  });

  const leftEdges: Edge[] = leftNodes.map((node) => ({
    id: `${centerKey}-${node.key}`,
    source: centerKey,
    target: node.key,
    type: "citationEdge",
    sourceHandle: "left",
    targetHandle: "target-right",
    style: { stroke: "#3BA502", strokeWidth: 1 },
    markerEnd: { type: MarkerType.Arrow, color: "#3BA502" },
  }));

  const rightEdges: Edge[] = rightNodes.map((node) => ({
    id: `${centerKey}-${node.key}`,
    source: centerKey,
    target: node.key,
    type: "citationEdge",
    sourceHandle: "right",
    targetHandle: "target-left",
    style: { stroke: "#3BA502", strokeWidth: 1 },
    markerEnd: { type: MarkerType.Arrow, color: "#3BA502" },
  }));

  return { nodes: layoutedNodes, edges: [...leftEdges, ...rightEdges] };
};

// ─── 인용관계 레이아웃 ────────────────────────────────────

const getRelationLayout = (
  nodes: PaperCitationNode[],
  edges: PaperCitationEdge[],
  centerKey: string,
  selectedNodeKey: string | null,
  papers: CitationPaperCard[],
): { nodes: Node<CitationNodeData>[]; edges: Edge[] } => {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", ranksep: RANKSEP, nodesep: NODESEP });

  nodes.forEach((node) => {
    const isCenter = node.key === centerKey;
    g.setNode(node.key, {
      width: isCenter ? CENTER_SIZE : NODE_WIDTH,
      height: isCenter ? CENTER_SIZE : NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.target, edge.source);
  });
  dagre.layout(g);

  const centerX = g.node(centerKey).x;

  const layoutedNodes: Node<CitationNodeData>[] = nodes.map((node) => {
    const { x, y } = g.node(node.key);
    const isCenter = node.key === centerKey;
    const w = isCenter ? CENTER_SIZE : NODE_WIDTH;
    const h = isCenter ? CENTER_SIZE : NODE_HEIGHT;
    const direction: CitationDirection = x < centerX ? "reference" : "citing";

    return {
      id: node.key,
      type: "citationNode",
      position: { x: x - w / 2, y: y - h / 2 },
      data: makeNodeData(
        node,
        direction,
        isCenter,
        node.key === selectedNodeKey,
        false,
        papers,
      ),
    };
  });

  const layoutedEdges: Edge[] = edges
    .map((edge) => {
      const isReference = edge.source === centerKey;

      // dagre에 없는 노드 참조 방지
      const sourceNode = g.node(edge.source);
      const targetNode = g.node(edge.target);
      if (!sourceNode || !targetNode) return null;

      if (isReference) {
        return {
          id: `${edge.source}-${edge.target}`,
          source: edge.target,
          target: centerKey,
          type: "citationEdge",
          sourceHandle: "source-right",
          targetHandle: "target-left",
          style: { stroke: "#35CE89", strokeWidth: 1 },
          markerEnd: { type: MarkerType.Arrow, color: "#35CE89" },
        };
      } else {
        return {
          id: `${edge.source}-${edge.target}`,
          source: centerKey,
          target: edge.source,
          type: "citationEdge",
          sourceHandle: "right",
          targetHandle: "target-left",
          style: { stroke: "#35CE89", strokeWidth: 1 },
          markerEnd: { type: MarkerType.Arrow, color: "#35CE89" },
        };
      }
    })
    .filter((e) => e !== null) as Edge[];

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

// ─── Props ────────────────────────────────────────────────

interface CitationGraphCanvasProps {
  rawNodes: PaperCitationNode[];
  rawEdges: PaperCitationEdge[];
  centerKey: string;
  tab: CitationTab;
  selectedNodeKey: string | null;
  papers: CitationPaperCard[];
  expandingNodeKey: string | null;
  onNodeClick: (nodeKey: string) => void;
}

// ─── Inner (useReactFlow 접근용) ──────────────────────────

const CitationGraphInner = ({
  rawNodes,
  rawEdges,
  centerKey,
  tab,
  selectedNodeKey,
  papers,
  expandingNodeKey,
  onNodeClick,
}: CitationGraphCanvasProps) => {
  const { setCenter, getNode } = useReactFlow();

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    if (tab === "reference") {
      return getReferenceLayout(rawNodes, centerKey, selectedNodeKey, papers);
    }
    return getRelationLayout(
      rawNodes,
      rawEdges,
      centerKey,
      selectedNodeKey,
      papers,
    );
  }, [rawNodes, rawEdges, centerKey, tab, selectedNodeKey, papers]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(
      layoutedNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: n.id === selectedNodeKey,
          isExpanding: n.id === expandingNodeKey,
        },
      })),
    );
  }, [layoutedNodes, selectedNodeKey, expandingNodeKey, setNodes]);

  useEffect(() => {
    setEdges(layoutedEdges);
  }, [layoutedEdges, setEdges]);

  // 노드 클릭 시 해당 노드가 우측 패널에 가리지 않도록 패닝
  useEffect(() => {
    if (!selectedNodeKey) return;
    const node = getNode(selectedNodeKey);
    if (!node) return;
    const nodeX = node.position.x + NODE_WIDTH / 2;
    const nodeY = node.position.y + NODE_HEIGHT / 2;
    // 우측 패널 너비(400px) 고려해서 좌측으로 오프셋
    setCenter(nodeX - 200, nodeY, { duration: 300, zoom: 1 });
  }, [selectedNodeKey, getNode, setCenter]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<CitationNodeData>) => {
      if (node.data.isCenter) return;
      onNodeClick(node.id);
    },
    [onNodeClick],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.3}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#E9EAF2" gap={16} />
    </ReactFlow>
  );
};

// ─── Component ────────────────────────────────────────────

const CitationGraphCanvas = (props: CitationGraphCanvasProps) => {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ReactFlowProvider>
        <CitationGraphInner {...props} />
      </ReactFlowProvider>
    </Box>
  );
};

export default CitationGraphCanvas;
