import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  type NodeTypes,
  type EdgeTypes,
  type NodeMouseHandler,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box, Typography, CircularProgress } from "@mui/material";
import { type Node, type Edge } from "reactflow";
import KeywordNode from "./KeywordNode";
import KeywordEdge from "./KeywordEdge";
import {
  useKeywordMapActions,
  useKeywordMapGenerating,
  useSelectedNodeId,
  useBreadcrumbs,
} from "../../stores/keywordMapStore";
import {
  type KeywordNodeData,
  type NodeDirection,
  type EdgeAxisLabel,
} from "../../types/keywordMap";
import NodeTooltip from "./NodeTooltip";

// ─── 노드/엣지 타입 등록 ──────────────────────────────────

const nodeTypes: NodeTypes = {
  keywordNode: KeywordNode,
};

const edgeTypes: EdgeTypes = {
  keywordEdge: KeywordEdge,
};

// ─── 레이아웃 상수 ────────────────────────────────────────

const DEPTH_GAP = 250; // 단계 간 거리

// 방향별 자식 노드 위치 계산
const getChildPosition = (
  parentX: number,
  parentY: number,
  direction: NodeDirection,
  index: number,
  total: number,
): { x: number; y: number } => {
  const SIBLING_GAP = 100;
  const offset = (index - (total - 1) / 2) * SIBLING_GAP;

  switch (direction) {
    case "top":
      return { x: parentX + offset, y: parentY - DEPTH_GAP };
    case "bottom":
      return { x: parentX + offset, y: parentY + DEPTH_GAP };
    case "left":
      return { x: parentX - DEPTH_GAP, y: parentY + offset };
    case "right":
      return { x: parentX + DEPTH_GAP, y: parentY + offset };
  }
};

// ─── 목 데이터 ────────────────────────────────────────────
// TODO: API 연동 시 백엔드 응답으로 교체

const MOCK_ROOT_KEYWORD = "LLM 설계";

const MOCK_CHILDREN: {
  label: string;
  axisLabel: EdgeAxisLabel;
  direction: NodeDirection;
}[] = [
  { label: "딥러닝", axisLabel: "상위분야", direction: "top" },
  { label: "트랜스포머", axisLabel: "핵심기술", direction: "right" },
  { label: "언어 모델", axisLabel: "연구대상", direction: "left" },
  { label: "자연어처리", axisLabel: "응용분야", direction: "bottom" },
];

// ─── 초기 노드/엣지 생성 ─────────────────────────────────

const createInitialGraph = (): {
  nodes: Node<KeywordNodeData>[];
  edges: Edge[];
} => {
  const rootId = "node-1";
  const rootX = 0;
  const rootY = 0;

  const rootNode: Node<KeywordNodeData> = {
    id: rootId,
    type: "keywordNode",
    position: { x: rootX, y: rootY },
    data: {
      label: MOCK_ROOT_KEYWORD,
      depth: 1,
      direction: "right",
      isExpanded: true, // 루트는 항상 확장됨
      isSelected: false,
      isFocused: false,
    },
  };

  const childNodes: Node<KeywordNodeData>[] = MOCK_CHILDREN.map(
    (child, index) => {
      const pos = getChildPosition(rootX, rootY, child.direction, index, 1);
      return {
        id: `node-2-${index}`,
        type: "keywordNode",
        position: pos,
        data: {
          label: child.label,
          depth: 2,
          direction: child.direction,
          isExpanded: false,
          isSelected: false,
          isFocused: false,
        },
      };
    },
  );

  const edges: Edge[] = MOCK_CHILDREN.map((child, index) => ({
    id: `edge-1-${index}`,
    source: rootId,
    target: `node-2-${index}`,
    sourceHandle: child.direction,
    targetHandle: `${getOppositeDirection(child.direction)}-target`,
    type: "keywordEdge",
    data: { axisLabel: child.axisLabel },
  }));

  return {
    nodes: [rootNode, ...childNodes],
    edges,
  };
};

const getOppositeDirection = (direction: NodeDirection): string => {
  switch (direction) {
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
  }
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const KeywordMapGraph = () => {
  const { isGenerating } = useKeywordMapGenerating();
  const selectedNodeId = useSelectedNodeId();
  const {
    selectNode,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    pushBreadcrumb,
    openPaperPanel,
    setBreadcrumbs,
  } = useKeywordMapActions();
  const breadcrumbs = useBreadcrumbs();

  const [nodes, setNodes, onNodesChange] = useNodesState<KeywordNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setCenter, flowToScreenPosition, fitView } = useReactFlow();
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // 초기 그래프 생성
  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = createInitialGraph();
    setNodes(initialNodes);
    setEdges(initialEdges);
    setStoreNodes(initialNodes);
    setStoreEdges(initialEdges);

    // 루트 노드 브레드크럼 추가
    setBreadcrumbs([
      {
        nodeId: "node-1",
        label: MOCK_ROOT_KEYWORD,
        depth: 1,
      },
    ]);
  }, []);

  const handleInit = useCallback(() => {
    setTimeout(() => {
      fitView({ padding: 0.1 });
    }, 0);
  }, [fitView]);

  // 노드 클릭 핸들러
  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const isAlreadySelected = node.id === selectedNodeId;

      selectNode(isAlreadySelected ? null : node.id);

      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isSelected: n.id === node.id && !isAlreadySelected,
          },
        })),
      );

      if (!isAlreadySelected) {
        const screenPos = flowToScreenPosition({
          x: node.position.x,
          y: node.position.y,
        });
        setTooltipPosition({ x: screenPos.x, y: screenPos.y });
        setCenter(node.position.x, node.position.y, { duration: 500, zoom: 1 });
      } else {
        setTooltipPosition(null);
      }
    },
    [selectedNodeId, selectNode, setNodes, setCenter, flowToScreenPosition],
  );

  // 하위 키워드 생성 핸들러
  const handleExpandNode = useCallback(
    (nodeId: string) => {
      const currentNodes = nodes;
      const targetNode = currentNodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const nodeData = targetNode.data;
      if (nodeData.depth >= 4) return;

      // TODO: API 연동 시 백엔드에서 하위 키워드 받아오기
      const mockChildLabels = [
        "서브워드 분리",
        "형태소 분석",
        "텍스트 전처리",
        "다국어 처리",
      ];

      const newDepth = (nodeData.depth + 1) as 2 | 3 | 4;
      const newNodes: Node<KeywordNodeData>[] = mockChildLabels.map(
        (label, index) => {
          const pos = getChildPosition(
            targetNode.position.x,
            targetNode.position.y,
            nodeData.direction,
            index,
            mockChildLabels.length,
          );
          return {
            id: `node-${nodeId}-child-${index}`,
            type: "keywordNode",
            position: pos,
            data: {
              label,
              depth: newDepth,
              direction: nodeData.direction,
              isExpanded: false,
              isSelected: false,
              isFocused: false,
            },
          };
        },
      );

      const newEdges: Edge[] = mockChildLabels.map((_, index) => ({
        id: `edge-${nodeId}-child-${index}`,
        source: nodeId,
        target: `node-${nodeId}-child-${index}`,
        sourceHandle: nodeData.direction,
        targetHandle: `${getOppositeDirection(nodeData.direction)}-target`,
        type: "keywordEdge",
        data: { axisLabel: "핵심기술" as EdgeAxisLabel },
      }));

      // 부모 노드 isExpanded 업데이트
      setNodes((nds) => [
        ...nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, isExpanded: true } } : n,
        ),
        ...newNodes,
      ]);

      setEdges((eds) => [...eds, ...newEdges]);

      // 브레드크럼 추가
      const sameOrHigherDepthIndex = breadcrumbs.findIndex(
        (b) => b.depth >= nodeData.depth,
      );
      if (sameOrHigherDepthIndex !== -1) {
        setBreadcrumbs([
          ...breadcrumbs.slice(0, sameOrHigherDepthIndex),
          { nodeId, label: nodeData.label, depth: nodeData.depth },
        ]);
      } else {
        pushBreadcrumb({
          nodeId,
          label: nodeData.label,
          depth: nodeData.depth,
        });
      }
    },
    [nodes, setNodes, setEdges, pushBreadcrumb, setBreadcrumbs, breadcrumbs],
  );

  const handleSearchKeyword = useCallback(
    (keyword: string) => {
      openPaperPanel(keyword);
      selectNode(null);
      setTooltipPosition(null);
    },
    [openPaperPanel, selectNode],
  );

  // 로딩 상태
  if (isGenerating) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <CircularProgress color="primary" />
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: 600,
            color: "label.normal",
          }}
        >
          키워드맵을 생성중이에요.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={handleInit}
        connectOnClick={false}
        nodesConnectable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
      {tooltipPosition &&
        selectedNodeId &&
        (() => {
          const selectedNode = nodes.find((n) => n.id === selectedNodeId);
          if (!selectedNode) return null;
          return (
            <Box
              sx={{
                position: "absolute",
                left: tooltipPosition.x + 80,
                top: tooltipPosition.y - 20,
                zIndex: 10,
              }}
            >
              <NodeTooltip
                nodeId={selectedNodeId}
                data={selectedNode.data}
                onSearchKeyword={handleSearchKeyword}
                onExpandNode={handleExpandNode}
              />
            </Box>
          );
        })()}
    </Box>
  );
};

export default KeywordMapGraph;
