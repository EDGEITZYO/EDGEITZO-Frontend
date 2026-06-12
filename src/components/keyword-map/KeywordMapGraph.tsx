import { useCallback, useEffect, useRef, useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  type KMTreeNode,
  type KMExpandedChild,
} from "../../types/keywordMap";
import NodeTooltip from "./NodeTooltip";
import { keywordMapApi } from "../../api/keywordMap";
import { useAuthStore } from "../../stores/authStore";

// ─── 노드/엣지 타입 등록 ──────────────────────────────────

const nodeTypes: NodeTypes = { keywordNode: KeywordNode };
const edgeTypes: EdgeTypes = { keywordEdge: KeywordEdge };

// ─── 레이아웃 상수 ────────────────────────────────────────

const DEPTH_GAP = 350;
const SIBLING_GAP = 150;

const getChildPosition = (
  parentX: number,
  parentY: number,
  direction: NodeDirection,
  index: number,
  total: number,
): { x: number; y: number } => {
  const dynamicGap = total > 3 ? SIBLING_GAP * (1 + (total - 3) * 0.1) : SIBLING_GAP;
  const offset = (index - (total - 1) / 2) * dynamicGap;
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

// ─── edge_type → NodeDirection 매핑 ──────────────────────

const AXIS_TO_DIRECTION: Record<EdgeAxisLabel, NodeDirection> = {
  상위분야: "top",
  응용분야: "bottom",
  연구대상: "left",
  핵심기술: "right",
};

// ─── 트리 → ReactFlow 변환 ────────────────────────────────

const buildGraphFromTree = (
  root: KMTreeNode,
): { nodes: Node<KeywordNodeData>[]; edges: Edge[] } => {
  const nodes: Node<KeywordNodeData>[] = [];
  const edges: Edge[] = [];

  const traverse = (
    node: KMTreeNode,
    parentId: string | null,
    direction: NodeDirection,
    x: number,
    y: number,
  ) => {
    const rfNode: Node<KeywordNodeData> = {
      id: node.id,
      type: "keywordNode",
      position: { x, y },
      data: {
        label: node.ko,
        depth: Math.min(node.depth + 1, 4) as 1 | 2 | 3 | 4,
        direction,
        definition: node.definition ?? undefined,
        isExpanded: false,
        isSelected: false,
        isFocused: false,
      },
    };
    nodes.push(rfNode);

    if (parentId !== null) {
      edges.push({
        id: `edge-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        sourceHandle: direction,
        targetHandle: `${getOppositeDirection(direction)}-target`,
        type: "keywordEdge",
        data: { axisLabel: node.edge_type },
      });
    }

    // depth 1까지만 렌더링 (depth 0=루트, depth 1=2단계)
    if (node.depth >= 1) return;

    // 🌟 수정된 부분: 자식 노드를 방향(Top, Bottom, Left, Right)별로 그룹화
    const childrenByDir: Record<NodeDirection, KMTreeNode[]> = {
      top: [],
      bottom: [],
      left: [],
      right: [],
    };

    node.children.forEach((child) => {
      const childDirection =
        child.edge_type !== null
          ? AXIS_TO_DIRECTION[child.edge_type]
          : direction;
      childrenByDir[childDirection].push(child);
    });

    // 🌟 그룹화된 방향별로 각각 독립적인 index와 total을 가지고 오프셋 계산
    (Object.keys(childrenByDir) as NodeDirection[]).forEach((dir) => {
      const dirChildren = childrenByDir[dir];
      const total = dirChildren.length;

      dirChildren.forEach((child, index) => {
        const pos = getChildPosition(x, y, dir, index, total);
        traverse(child, node.id, dir, pos.x, pos.y);
      });
    });
  };

  traverse(root, null, "right", 0, 0);
  return { nodes, edges };
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const KeywordMapGraph = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
  const { isGenerating } = useKeywordMapGenerating();
  const selectedNodeId = useSelectedNodeId();
  const breadcrumbs = useBreadcrumbs();
  const {
    selectNode,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    pushBreadcrumb,
    openPaperPanel,
    setBreadcrumbs,
    setIsGenerating,
    setGenerateError,
    setResearchField,
  } = useKeywordMapActions();

  const [nodes, setNodes, onNodesChange] = useNodesState<KeywordNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setCenter, flowToScreenPosition, fitView } = useReactFlow();
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const hasLoaded = useRef(false);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);

  // ─── applyTree (useEffect보다 먼저 선언) ────────────────

  const applyTree = useCallback(
    (tree: KMTreeNode, researchField: string) => {
      const { nodes: newNodes, edges: newEdges } = buildGraphFromTree(tree);
      setNodes(newNodes);
      setEdges(newEdges);
      setStoreNodes(newNodes);
      setStoreEdges(newEdges);
      setBreadcrumbs([{ nodeId: tree.id, label: researchField, depth: 1 }]);
    },
    [setNodes, setEdges, setStoreNodes, setStoreEdges, setBreadcrumbs],
  );

  // ─── 초기 로딩 ──────────────────────────────────────────

  useEffect(() => {
    if (!userId) return;
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadGraph = async () => {
      setIsLoadingGraph(true);
      try {
        const res = await keywordMapApi.getMap(userId);
        const { tree, research_field } = res.data.data;
        setResearchField(research_field);
        applyTree(tree, research_field);
      } catch (err: unknown) {
        const isNotFound =
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 404;

        if (isNotFound) {
          const mypageData = queryClient.getQueryData<{
            profile: { research_field: string };
          }>(["mypage"]);
          const researchField = mypageData?.profile.research_field;

          if (!researchField) {
            navigate("/keyword-map/edit");
            return;
          }

          setIsGenerating(true);
          setGenerateError(null);
          try {
            const genRes = await keywordMapApi.generate(researchField, userId);
            const { tree, research_field } = genRes.data.data;
            setResearchField(research_field);
            applyTree(tree, research_field);
          } catch {
            setGenerateError("키워드맵 생성에 실패했어요. 다시 시도해주세요.");
            navigate("/keyword-map/edit");
          } finally {
            setIsGenerating(false);
          }
        } else {
          navigate("/keyword-map/edit");
        }
      } finally {
        setIsLoadingGraph(false);
      }
    };

    loadGraph();
  }, [
    userId,
    applyTree,
    navigate,
    queryClient,
    setGenerateError,
    setIsGenerating,
    setResearchField,
  ]);

  const handleInit = useCallback(() => {
    setTimeout(() => fitView({ padding: 0.1 }), 0);
  }, [fitView]);

  // ─── 노드 클릭 ──────────────────────────────────────────

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

  // ─── 하위 키워드 확장 ────────────────────────────────────

  const handleExpandNode = useCallback(
    async (nodeId: string) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const nodeData = targetNode.data;
      if (nodeData.depth >= 4) return;

      const parentEdge = edges.find((e) => e.target === nodeId);
      const axis: EdgeAxisLabel =
        (parentEdge?.data?.axisLabel as EdgeAxisLabel) ?? "핵심기술";
      const rootBreadcrumb = breadcrumbs[0];
      const researchField = rootBreadcrumb?.label ?? "";

      try {
        const res = await keywordMapApi.expandNode(nodeId, {
          parent_label: nodeData.label,
          parent_label_en: "",
          axis,
          research_field: researchField,
          depth: nodeData.depth,
        });

        const { new_children } = res.data.data;
        const newDepth = Math.min(nodeData.depth + 1, 4) as 2 | 3 | 4;

        const childrenByDir: Record<NodeDirection, KMExpandedChild[]> = {
          top: [],
          bottom: [],
          left: [],
          right: [],
        };

        new_children.forEach((child: KMExpandedChild) => {
          const childDirection =
            AXIS_TO_DIRECTION[child.edge_type] ?? nodeData.direction;
          childrenByDir[childDirection].push(child);
        });

        const newNodes: Node<KeywordNodeData>[] = [];
        const newEdges: Edge[] = [];

        (Object.keys(childrenByDir) as NodeDirection[]).forEach((dir) => {
          const dirChildren = childrenByDir[dir];
          const total = dirChildren.length;

          dirChildren.forEach((child, index) => {
            const pos = getChildPosition(
              targetNode.position.x,
              targetNode.position.y,
              dir,
              index,
              total,
            );

            newNodes.push({
              id: child.id,
              type: "keywordNode",
              position: pos,
              data: {
                label: child.ko,
                depth: newDepth,
                direction: dir,
                definition: child.definition ?? undefined,
                isExpanded: false,
                isSelected: false,
                isFocused: false,
              },
            });

            newEdges.push({
              id: `edge-${nodeId}-${child.id}`,
              source: nodeId,
              target: child.id,
              sourceHandle: dir,
              targetHandle: `${getOppositeDirection(dir)}-target`,
              type: "keywordEdge",
              data: { axisLabel: child.edge_type },
            });
          });
        });

        setNodes((nds) => [
          ...nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, isExpanded: true } }
              : n,
          ),
          ...newNodes,
        ]);
        setEdges((eds) => [...eds, ...newEdges]);

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
      } catch {
        // TODO: 에러 토스트 추가
      }
    },
    [
      nodes,
      edges,
      breadcrumbs,
      setNodes,
      setEdges,
      pushBreadcrumb,
      setBreadcrumbs,
    ],
  );

  // ─── 키워드로 검색 ───────────────────────────────────────

  const handleSearchKeyword = useCallback(
    (nodeId: string, keyword: string) => {
      openPaperPanel(nodeId, keyword);
      selectNode(null);
      setTooltipPosition(null);
    },
    [openPaperPanel, selectNode],
  );

  // ─── 로딩 상태 ──────────────────────────────────────────

  if (isLoadingGraph || isGenerating) {
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
          sx={{ fontSize: "17px", fontWeight: 600, color: "label.normal" }}
        >
          {isGenerating
            ? "키워드맵을 생성중이에요."
            : "키워드맵을 불러오는 중이에요."}
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
                onSearchKeyword={(keyword) =>
                  handleSearchKeyword(selectedNodeId, keyword)
                }
                onExpandNode={handleExpandNode}
              />
            </Box>
          );
        })()}
    </Box>
  );
};

export default KeywordMapGraph;
