import { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
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
import dagre from "@dagrejs/dagre";
import KeywordNode from "./KeywordNode";
import KeywordEdge from "./KeywordEdge";
import {
  useKeywordMapActions,
  useKeywordMapLoading,
  useSelectedNodeKey,
} from "../../stores/keywordMapStore";
import {
  type KeywordNodeData,
  type KMGraphNode,
  type KMGraphEdge,
} from "../../types/keywordMap";
import { keywordMapApi } from "../../api/keywordMap";
import { useMypageQuery } from "../../queries/useMypageQuery";

// ─── 노드/엣지 타입 등록 ──────────────────────────────────

const nodeTypes: NodeTypes = { keywordNode: KeywordNode };
const edgeTypes: EdgeTypes = { keywordEdge: KeywordEdge };

// ─── 레이아웃 상수 ────────────────────────────────────────

const NODE_WIDTH = 392; // 360px + padding 16px*2
const NODE_HEIGHT = 92; // 76px + padding 8px*2

// ─── dagre 레이아웃 ───────────────────────────────────────

const getLayoutedElements = (
  nodes: Node<KeywordNodeData>[],
  edges: Edge[],
): { nodes: Node<KeywordNodeData>[]; edges: Edge[] } => {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR",
    nodesep: 60,
    ranksep: 100,
  });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const pos = g.node(node.id);
      return {
        ...node,
        position: {
          x: pos.x - NODE_WIDTH / 2,
          y: pos.y - NODE_HEIGHT / 2,
        },
      };
    }),
    edges,
  };
};

// ─── API 응답 → ReactFlow 변환 ────────────────────────────

const buildGraphFromResponse = (
  anchor: KMGraphNode,
  nodes: KMGraphNode[],
  edges: KMGraphEdge[],
) => {
  const uniqueNodes = nodes.filter((n) => n.key !== anchor.key);
  const allNodes: Node<KeywordNodeData>[] = [anchor, ...uniqueNodes].map(
    (n) => ({
      id: n.key,
      type: "keywordNode",
      position: { x: 0, y: 0 },
      data: {
        label: n.name_ko ?? n.key,
        tier: Math.min(n.tier, 3) as 0 | 1 | 2 | 3,
        side: n.side,
        paperCount: n.paper_count,
        isHub: n.is_hub,
        crossLinkCount: n.cross_link_count,
        hasMore: n.has_more,
        isSelected: false,
      },
    }),
  );

  const allEdges: Edge[] = edges.map((e) => ({
    id: `edge-${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    type: "keywordEdge",
    data: { edgeType: e.type },
  }));

  // dagre 레이아웃은 tree 엣지만으로 계산
  const treeEdges = allEdges.filter((e) => e.data?.edgeType === "tree");
  const { nodes: layoutedNodes } = getLayoutedElements(allNodes, treeEdges);

  // 렌더링도 tree 엣지만 사용
  const treeEdgesOnly = allEdges.filter((e) => e.data?.edgeType === "tree");
  return { nodes: layoutedNodes, edges: treeEdgesOnly };
};

// ─── 컴포넌트 ─────────────────────────────────────────────

interface KeywordMapGraphProps {
  keyword: string;
}

const KeywordMapGraph = ({ keyword }: KeywordMapGraphProps) => {
  const { data: mypageData } = useMypageQuery();
  const userId = mypageData?.profile.id;

  const { isLoading, loadError } = useKeywordMapLoading();
  const selectedNodeKey = useSelectedNodeKey();
  const {
    setGraph,
    setBreadcrumbs,
    setBreadcrumbAtTier,
    selectNode,
    setIsLoading,
    setLoadError,
  } = useKeywordMapActions();

  const [nodes, setNodes, onNodesChange] = useNodesState<KeywordNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const hasLoaded = useRef(false);

  // ─── 그래프 적용 ──────────────────────────────────────

  const applyGraph = useCallback(
    (
      anchor: KMGraphNode,
      responseNodes: KMGraphNode[],
      responseEdges: KMGraphEdge[],
      isInitial = false,
    ) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        buildGraphFromResponse(anchor, responseNodes, responseEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setGraph({
        nodes: layoutedNodes,
        edges: layoutedEdges,
        anchorKey: anchor.key,
        anchorLabel: anchor.name_ko ?? anchor.key,
        hasMoreParents: false,
        hasMoreChildren: false,
      });

      if (isInitial) {
        setBreadcrumbs([
          { nodeKey: anchor.key, label: anchor.name_ko ?? anchor.key, tier: 0 },
        ]);
        setTimeout(() => fitView({ padding: 0.1 }), 0);
      }
    },
    [setNodes, setEdges, setGraph, setBreadcrumbs, fitView],
  );

  // ─── 초기 로딩 ──────────────────────────────────────

  useEffect(() => {
    if (!keyword) return;
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadGraph = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await keywordMapApi.loadMap({
          keyword,
          user_id: userId ?? undefined,
        });
        const { anchor, nodes: resNodes, edges: resEdges } = res.data.data;
        applyGraph(anchor, resNodes, resEdges, true);
      } catch {
        setLoadError("키워드맵을 불러오지 못했어요. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    loadGraph();
  }, [keyword, userId, applyGraph, setIsLoading, setLoadError]);

  // ─── expand 이벤트 수신 ───────────────────────────────

  useEffect(() => {
    const handleExpand = async (e: Event) => {
      const { nodeId } = (e as CustomEvent<{ nodeId: string }>).detail;
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const existingNodeKeys = nodes.map((n) => n.id);

      try {
        const res = await keywordMapApi.expandNode(nodeId, {
          existing_node_keys: existingNodeKeys,
          current_tier: targetNode.data.tier,
        });

        const { new_nodes, new_edges } = res.data.data;

        const newRFNodes: Node<KeywordNodeData>[] = new_nodes.map((n) => ({
          id: n.key,
          type: "keywordNode",
          position: { x: 0, y: 0 },
          data: {
            label: n.name_ko ?? n.key,
            tier: Math.min(n.tier, 3) as 0 | 1 | 2 | 3,
            side: n.side,
            paperCount: n.paper_count,
            isHub: n.is_hub,
            crossLinkCount: n.cross_link_count,
            hasMore: n.has_more,
            isSelected: false,
          },
        }));

        const newRFEdges: Edge[] = new_edges.map((e) => ({
          id: `edge-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          type: "keywordEdge",
          data: { edgeType: e.type },
        }));

        const { parent_has_more } = res.data.data;

        const updatedNodes = [
          ...nodes.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, hasMore: parent_has_more } }
              : n,
          ),
          ...newRFNodes,
        ];
        const updatedEdges = [...edges, ...newRFEdges];

        const treeEdgesOnly = updatedEdges.filter(
          (e) => e.data?.edgeType === "tree",
        );
        const { nodes: layoutedNodes } = getLayoutedElements(
          updatedNodes,
          treeEdgesOnly,
        );

        setNodes(layoutedNodes);
        setEdges(treeEdgesOnly);
        setGraph({
          nodes: layoutedNodes,
          edges: treeEdgesOnly,
          anchorKey: "",
          anchorLabel: "",
          hasMoreParents: false,
          hasMoreChildren: false,
        });

        setBreadcrumbAtTier(targetNode.data.tier, {
          nodeKey: nodeId,
          label: targetNode.data.label,
          tier: targetNode.data.tier,
        });
      } catch {
        // TODO: 에러 토스트
      }
    };

    window.addEventListener("expandNode", handleExpand);
    return () => window.removeEventListener("expandNode", handleExpand);
  }, [nodes, edges, setNodes, setEdges, setGraph, setBreadcrumbAtTier]);

  // ─── recenter 이벤트 수신 (보류 — 백엔드 확인 후) ────

  useEffect(() => {
    const handleRecenter = async (e: Event) => {
      const { nodeKey } = (e as CustomEvent<{ nodeKey: string }>).detail;
      const existingNodeKeys = nodes.map((n) => n.id);

      try {
        const res = await keywordMapApi.recenter(
          nodeKey,
          { existing_node_keys: existingNodeKeys },
          userId ?? undefined,
        );
        const { anchor, nodes: resNodes, edges: resEdges } = res.data.data;
        applyGraph(anchor, resNodes, resEdges, false);
      } catch {
        // TODO: 에러 토스트
      }
    };

    window.addEventListener("recenterNode", handleRecenter);
    return () => window.removeEventListener("recenterNode", handleRecenter);
  }, [nodes, userId, applyGraph, setBreadcrumbAtTier]);

  // ─── 노드 클릭 ──────────────────────────────────────

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const isAlreadySelected = node.id === selectedNodeKey;
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
    },
    [selectedNodeKey, selectNode, setNodes],
  );

  // ─── 노드 마우스 이벤트 ───────────────────────────────

  const handleNodeMouseEnter: NodeMouseHandler = useCallback(
    (_, node) => {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          zIndex: n.id === node.id ? 1000 : (n.zIndex ?? 1),
        })),
      );
    },
    [setNodes],
  );

  const handleNodeMouseLeave: NodeMouseHandler = useCallback(
    (_, node) => {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          zIndex: n.id === node.id && !n.data.isSelected ? 1 : (n.zIndex ?? 1),
        })),
      );
    },
    [setNodes],
  );

  // ─── 캔버스 클릭 (노드 선택 해제) ───────────────────

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, isSelected: false } })),
    );
  }, [selectNode, setNodes]);

  // ─── 로딩/에러 상태 ──────────────────────────────────

  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          height: "100%",
        }}
      >
        <CircularProgress color="primary" />
        <Typography
          sx={{ fontSize: "17px", fontWeight: 600, color: "label.normal" }}
        >
          키워드맵을 불러오는 중이에요.
        </Typography>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography sx={{ fontSize: "17px", color: "label.alternative" }}>
          {loadError}
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
        onPaneClick={handlePaneClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={() => setTimeout(() => fitView({ padding: 0.1 }), 0)}
        connectOnClick={false}
        nodesConnectable={false}
      >
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export default KeywordMapGraph;
