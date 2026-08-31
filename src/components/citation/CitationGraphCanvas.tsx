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
  tab: CitationTab,
  isMini: boolean,
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
  tier: node.tier,
  tab,
  paper: papers.find((p) => p.key === node.key) ?? null,
  isMini,
});

// ─── 참고문헌 레이아웃 ────────────────────────────────────

const getReferenceLayout = (
  nodes: PaperCitationNode[],
  edges: PaperCitationEdge[],
  centerKey: string,
  selectedNodeKey: string | null,
  papers: CitationPaperCard[],
  isMini: boolean,
): { nodes: Node<CitationNodeData>[]; edges: Edge[] } => {
  const childNodes = nodes.filter((n) => n.key !== centerKey && n.tier === 1);
  const leftNodes = childNodes.filter((_, i) => i % 2 !== 0);
  const rightNodes = childNodes.filter((_, i) => i % 2 === 0);
  const leftKeys = new Set(leftNodes.map((n) => n.key));

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", ranksep: RANKSEP, nodesep: NODESEP });

  g.setNode(centerKey, { width: CENTER_SIZE, height: CENTER_SIZE });

  // tier 1 노드
  leftNodes.forEach((n) => {
    g.setNode(n.key, { width: NODE_WIDTH, height: NODE_HEIGHT });
    g.setEdge(n.key, centerKey);
  });
  rightNodes.forEach((n) => {
    g.setNode(n.key, { width: NODE_WIDTH, height: NODE_HEIGHT });
    g.setEdge(centerKey, n.key);
  });

  // tier 2 이상 노드
  nodes
    .filter((n) => n.key !== centerKey && n.tier > 1)
    .forEach((n) => {
      g.setNode(n.key, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

  // tier 2 이상 엣지 — 부모가 좌측이면 뒤집기, 우측이면 그대로
  edges.forEach((edge) => {
    if (!g.hasNode(edge.source) || !g.hasNode(edge.target)) return;
    const sourceNode = nodes.find((n) => n.key === edge.source);
    const targetNode = nodes.find((n) => n.key === edge.target);
    if (!sourceNode || !targetNode) return;
    if (sourceNode.tier === 0 || targetNode.tier === 0) return; // center 관련 엣지 제외 (이미 처리됨)

    // 부모 노드가 좌측인지 판단
    const parentKey =
      sourceNode.tier < targetNode.tier ? edge.source : edge.target;
    const isParentLeft =
      leftKeys.has(parentKey) ||
      (nodes.find((n) => n.key === parentKey)?.tier === 1 &&
        leftKeys.has(parentKey));

    if (isParentLeft) {
      g.setEdge(edge.target, edge.source); // 뒤집기 → 더 왼쪽
    } else {
      g.setEdge(edge.source, edge.target); // 그대로 → 더 오른쪽
    }
  });

  try {
    dagre.layout(g);
  } catch {
    return { nodes: [], edges: [] };
  }

  const centerDagNode = g.node(centerKey);
  if (!centerDagNode) return { nodes: [], edges: [] };

  const layoutedNodes: Node<CitationNodeData>[] = nodes
    .map((node) => {
      const dagNode = g.node(node.key);
      if (!dagNode) return null;
      const { x, y } = dagNode;
      const isCenter = node.key === centerKey;
      const w = isCenter ? CENTER_SIZE : NODE_WIDTH;
      const h = isCenter ? CENTER_SIZE : NODE_HEIGHT;
      const isLeft =
        leftKeys.has(node.key) ||
        (!isCenter && x < centerDagNode.x && node.tier > 1);

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
          "reference",
          isMini,
        ),
      };
    })
    .filter((n) => n !== null) as Node<CitationNodeData>[];

  // 렌더링 엣지
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

  // tier 2 이상 렌더링 엣지
  const deeperEdges: Edge[] = edges
    .filter((edge) => {
      const sourceNode = nodes.find((n) => n.key === edge.source);
      const targetNode = nodes.find((n) => n.key === edge.target);
      if (!sourceNode || !targetNode) return false;
      // center 관련 엣지 제외
      if (edge.source === centerKey || edge.target === centerKey) return false;
      return sourceNode.tier > 0 && targetNode.tier > 0;
    })
    .map((edge) => {
      const sourceNode = nodes.find((n) => n.key === edge.source)!;
      const targetNode = nodes.find((n) => n.key === edge.target)!;
      const parentKey =
        sourceNode.tier < targetNode.tier ? edge.source : edge.target;
      const childKey =
        sourceNode.tier < targetNode.tier ? edge.target : edge.source;
      const isParentLeft =
        leftKeys.has(parentKey) ||
        (!leftKeys.has(parentKey) &&
          nodes.find((n) => n.key === parentKey) &&
          g.node(parentKey)?.x < centerDagNode.x);

      return {
        id: `${edge.source}-${edge.target}`,
        source: parentKey,
        target: childKey,
        type: "citationEdge",
        sourceHandle: isParentLeft ? "source-left" : "source-right",
        targetHandle: isParentLeft ? "target-right" : "target-left",
        style: { stroke: "#3BA502", strokeWidth: 1 },
        markerEnd: { type: MarkerType.Arrow, color: "#3BA502" },
      };
    });

  return {
    nodes: layoutedNodes,
    edges: [...leftEdges, ...rightEdges, ...deeperEdges],
  };
};

// ─── 인용관계 레이아웃 ────────────────────────────────────

const getRelationLayout = (
  nodes: PaperCitationNode[],
  edges: PaperCitationEdge[],
  centerKey: string,
  selectedNodeKey: string | null,
  papers: CitationPaperCard[],
  isMini: boolean,
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
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.target, edge.source);
    }
  });

  try {
    dagre.layout(g);
  } catch {
    return { nodes: [], edges: [] };
  }

  const centerNode = g.node(centerKey);
  if (!centerNode) return { nodes: [], edges: [] };

  const centerX = centerNode.x;

  const layoutedNodes: Node<CitationNodeData>[] = nodes
    .map((node) => {
      const dagNode = g.node(node.key);
      if (!dagNode) return null;
      const { x, y } = dagNode;
      const isCenter = node.key === centerKey;
      const w = isCenter ? CENTER_SIZE : NODE_WIDTH;
      const h = isCenter ? CENTER_SIZE : NODE_HEIGHT;
      const direction: CitationDirection = x < centerX ? "reference" : "citing";
      const isLeft = x < centerX;

      return {
        id: node.key,
        type: "citationNode",
        position: { x: x - w / 2, y: y - h / 2 },
        data: makeNodeData(
          node,
          direction,
          isCenter,
          node.key === selectedNodeKey,
          isLeft,
          papers,
          "relation",
          isMini,
        ),
      };
    })
    .filter((n) => n !== null) as Node<CitationNodeData>[];

  const layoutedEdges: Edge[] = edges
    .map((edge) => {
      const sourceNode = g.node(edge.source);
      const targetNode = g.node(edge.target);
      if (!sourceNode || !targetNode) return null;

      const isFromCenter = edge.source === centerKey;
      const isToCenter = edge.target === centerKey;
      const centerX = g.node(centerKey).x;

      // 엣지 색상 결정
      const getEdgeColor = () => {
        if (isFromCenter || isToCenter) return "#35CE89";
        const srcNode = nodes.find((n) => n.key === edge.source);
        const tgtNode = nodes.find((n) => n.key === edge.target);
        const minTier = Math.min(srcNode?.tier ?? 1, tgtNode?.tier ?? 1);
        if (minTier === 1) return "#029B56";
        return "#03C26C";
      };
      const edgeColor = getEdgeColor();

      if (isFromCenter) {
        return {
          id: `${edge.source}-${edge.target}`,
          source: edge.target,
          target: centerKey,
          type: "citationEdge",
          sourceHandle: "source-right",
          targetHandle: "target-left",
          style: { stroke: edgeColor, strokeWidth: 1 },
          markerEnd: { type: MarkerType.Arrow, color: edgeColor },
        };
      } else if (isToCenter) {
        return {
          id: `${edge.source}-${edge.target}`,
          source: centerKey,
          target: edge.source,
          type: "citationEdge",
          sourceHandle: "right",
          targetHandle: "target-left",
          style: { stroke: edgeColor, strokeWidth: 1 },
          markerEnd: { type: MarkerType.Arrow, color: edgeColor },
        };
      } else {
        const isSourceLeft = sourceNode.x < centerX;

        if (isSourceLeft) {
          return {
            id: `${edge.source}-${edge.target}`,
            source: edge.target,
            target: edge.source,
            type: "citationEdge",
            sourceHandle: "source-right",
            targetHandle: "target-left",
            style: { stroke: edgeColor, strokeWidth: 1 },
            markerEnd: { type: MarkerType.Arrow, color: edgeColor },
          };
        } else {
          return {
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            type: "citationEdge",
            sourceHandle: "source-left",
            targetHandle: "target-right",
            style: { stroke: edgeColor, strokeWidth: 1 },
            markerStart: { type: MarkerType.Arrow, color: edgeColor },
          };
        }
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
  onPaneClick?: () => void;
  isMini?: boolean;
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
  onPaneClick,
  isMini,
}: CitationGraphCanvasProps) => {
  const { setCenter, getNode } = useReactFlow();

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    if (tab === "reference") {
      return getReferenceLayout(
        rawNodes,
        rawEdges,
        centerKey,
        selectedNodeKey,
        papers,
        isMini ?? false,
      );
    }
    return getRelationLayout(
      rawNodes,
      rawEdges,
      centerKey,
      selectedNodeKey,
      papers,
      isMini ?? false,
    );
  }, [rawNodes, rawEdges, centerKey, tab, selectedNodeKey, papers, isMini]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(
      layoutedNodes.map((n) => ({
        ...n,
        zIndex: n.id === selectedNodeKey ? 1000 : 1,
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

    const timer = setTimeout(() => {
      const nodeX = node.position.x + NODE_WIDTH / 2;
      const nodeY = node.position.y + NODE_HEIGHT / 2;
      setCenter(nodeX, nodeY, { duration: 300, zoom: 1 });
    }, 100); // 패널 열린 후 레이아웃 반영될 때까지 대기

    return () => clearTimeout(timer);
  }, [selectedNodeKey, getNode, setCenter]);

  useEffect(() => {
    if (!isMini || !centerKey) return;
    const node = getNode(centerKey);
    if (!node) return;
    const nodeX = node.position.x + CENTER_SIZE / 2;
    const nodeY = node.position.y + CENTER_SIZE / 2;
    setCenter(nodeX, nodeY, { duration: 0, zoom: 0.8 });
  }, [centerKey, isMini, getNode, setCenter]);

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
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView={!isMini}
      defaultViewport={isMini ? { x: 0, y: 0, zoom: 0.8 } : undefined}
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
