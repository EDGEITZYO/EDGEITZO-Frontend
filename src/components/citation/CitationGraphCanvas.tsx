import { useEffect, useMemo, useCallback } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
} from "reactflow";
import dagre from "@dagrejs/dagre";
import { Box } from "@mui/material";
import "reactflow/dist/style.css";
import CitationNode, { type CitationNodeData } from "./CitationNode";
import type {
  PaperCitationNode,
  PaperCitationEdge,
  CitationDirection,
  CitationTab,
} from "../../types/citation";

const NODE_WIDTH = 360;
const NODE_HEIGHT = 76;
const CENTER_SIZE = 160;
const RANKSEP = 80;
const NODESEP = 20;

const nodeTypes = { citationNode: CitationNode };

// ─── 참고문헌 레이아웃 (좌우 분배) ───────────────────────

const getReferenceLayout = (
  nodes: PaperCitationNode[],
  centerKey: string,
): { nodes: Node<CitationNodeData>[]; edges: Edge[] } => {
  const childNodes = nodes.filter((n) => n.key !== centerKey);
  const leftNodes = childNodes.filter((_, i) => i % 2 !== 0); // 홀수 인덱스 → 좌측
  const rightNodes = childNodes.filter((_, i) => i % 2 === 0); // 짝수 인덱스 → 우측

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", ranksep: RANKSEP, nodesep: NODESEP });

  g.setNode(centerKey, { width: CENTER_SIZE, height: CENTER_SIZE });

  // 좌측: 노드→center 방향으로 dagre에 넘겨서 center 왼쪽에 배치
  leftNodes.forEach((n) => {
    g.setNode(n.key, { width: NODE_WIDTH, height: NODE_HEIGHT });
    g.setEdge(n.key, centerKey);
  });

  // 우측: center→노드 방향 그대로
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

    return {
      id: node.key,
      type: "citationNode",
      position: { x: x - w / 2, y: y - h / 2 },
      data: {
        title: node.title,
        title_en: node.title_en,
        pubyear: node.pubyear,
        in_service: node.in_service,
        has_more: node.has_more,
        direction: "reference" as CitationDirection,
        isCenter,
        isSelected: false,
      },
    };
  });

  // 좌측 엣지: center 왼쪽 → 노드 오른쪽
  const leftEdges: Edge[] = leftNodes.map((node) => ({
    id: `${centerKey}-${node.key}`,
    source: centerKey,
    target: node.key,
    sourceHandle: "left",
    targetHandle: "target-right",
    style: { stroke: "#3BA502", strokeWidth: 1 },
    markerEnd: { type: MarkerType.Arrow, color: "#3BA502" },
  }));

  // 우측 엣지: center 오른쪽 → 노드 왼쪽
  const rightEdges: Edge[] = rightNodes.map((node) => ({
    id: `${centerKey}-${node.key}`,
    source: centerKey,
    target: node.key,
    sourceHandle: "right",
    targetHandle: "target-left",
    style: { stroke: "#3BA502", strokeWidth: 1 },
    markerEnd: { type: MarkerType.Arrow, color: "#3BA502" },
  }));

  return {
    nodes: layoutedNodes,
    edges: [...leftEdges, ...rightEdges],
  };
};

// ─── 인용관계 레이아웃 (dagre LR) ────────────────────────

const getRelationLayout = (
  nodes: PaperCitationNode[],
  edges: PaperCitationEdge[],
  centerKey: string,
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

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

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
      data: {
        title: node.title,
        title_en: node.title_en,
        pubyear: node.pubyear,
        in_service: node.in_service,
        has_more: node.has_more,
        direction,
        isCenter,
        isSelected: false,
      },
    };
  });

  const layoutedEdges: Edge[] = edges.map((edge) => {
    const isFromCenter = edge.source === centerKey;
    const centerX = g.node(centerKey).x;
    const targetX = g.node(edge.target).x;
    const sourceX = g.node(edge.source).x;

    // source가 center면 우측/좌측 판단
    // source가 center가 아니면 (expand된 노드) source가 center보다 좌측이면 source-left, 우측이면 source-right
    const sourceHandle = isFromCenter
      ? targetX > centerX
        ? "right"
        : "left"
      : sourceX < centerX
        ? "source-left"
        : "source-right";

    const targetHandle = isFromCenter
      ? targetX > centerX
        ? "target-left"
        : "target-right"
      : targetX < centerX
        ? "target-right"
        : "target-left";

    return {
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      sourceHandle,
      targetHandle,
      style: { stroke: "#35CE89", strokeWidth: 1 },
      markerEnd: { type: MarkerType.Arrow, color: "#35CE89" },
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

// ─── Props ────────────────────────────────────────────────

interface CitationGraphCanvasProps {
  rawNodes: PaperCitationNode[];
  rawEdges: PaperCitationEdge[];
  centerKey: string;
  tab: CitationTab;
  selectedNodeKey: string | null;
  onNodeClick: (
    nodeKey: string,
    paperId: string | null,
    inService: boolean,
  ) => void;
}

// ─── Component ────────────────────────────────────────────

const CitationGraphCanvas = ({
  rawNodes,
  rawEdges,
  centerKey,
  tab,
  selectedNodeKey,
  onNodeClick,
}: CitationGraphCanvasProps) => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    if (tab === "reference") {
      return getReferenceLayout(rawNodes, centerKey);
    }
    return getRelationLayout(rawNodes, rawEdges, centerKey);
  }, [rawNodes, rawEdges, centerKey, tab]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(
      layoutedNodes.map((n) => ({
        ...n,
        data: { ...n.data, isSelected: n.id === selectedNodeKey },
      })),
    );
  }, [layoutedNodes, selectedNodeKey, setNodes]);

  useEffect(() => {
    setEdges(layoutedEdges);
  }, [layoutedEdges, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<CitationNodeData>) => {
      if (node.data.isCenter) return;
      const raw = rawNodes.find((n) => n.key === node.id);
      onNodeClick(node.id, raw?.paper_id ?? null, node.data.in_service);
    },
    [rawNodes, onNodeClick],
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E9EAF2" gap={16} />
      </ReactFlow>
    </Box>
  );
};

export default CitationGraphCanvas;
