import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MenuIcon from "@mui/icons-material/Menu";
import type { CitationTab } from "../../types/citation";
import {
  useCitationGraphData,
  useCitationPapers,
  useCitationSelectedNode,
  useCitationTab,
  useCitationGraphActions,
} from "../../stores/citationGraphStore";
import { citationApi } from "../../api/citation";
import CitationGraphCanvas from "./CitationGraphCanvas";
import CitationPaperListPanel from "./CitationPaperListPanel";
import { createPortal } from "react-dom";

// ─── 탭 토글 ─────────────────────────────────────────────

interface TabToggleProps {
  tab: CitationTab;
  onChange: (tab: CitationTab) => void;
}

const TabToggle = ({ tab, onChange }: TabToggleProps) => (
  <Box
    sx={{
      display: "flex",
      padding: "4px",
      alignItems: "center",
      gap: "8px",
      borderRadius: "43.478px",
      backgroundColor: "#D8DAE5",
    }}
  >
    {(["reference", "relation"] as CitationTab[]).map((t) => {
      const isSelected = tab === t;
      return (
        <Box
          key={t}
          onClick={() => onChange(t)}
          sx={{
            display: "flex",
            width: "71px",
            padding: "4px 8px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "43.478px",
            backgroundColor: isSelected ? "#FFF" : "transparent",
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              color: isSelected ? "#292B33" : "#73757F",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            {t === "reference" ? "참고문헌" : "인용관계"}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

// ─── 토스트 ───────────────────────────────────────────────

interface ToastProps {
  message: string;
}

const Toast = ({ message }: ToastProps) => (
  <Box
    sx={{
      position: "absolute",
      bottom: "54px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      padding: "12px 36px",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      borderRadius: "100px",
      background: "rgba(30, 32, 38, 0.80)",
      zIndex: 10,
      pointerEvents: "none",
    }}
  >
    <Typography
      sx={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 1,
        overflow: "hidden",
        color: "#F7F8FA",
        textOverflow: "ellipsis",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        letterSpacing: "-0.336px",
      }}
    >
      {message}
    </Typography>
  </Box>
);

// ─── Props ────────────────────────────────────────────────

interface CitationFullPanelProps {
  paperId: string;
  paperTitle: string;
  initialTab: CitationTab;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────

const CitationFullPanel = ({
  paperId,
  paperTitle,
  initialTab,
  onClose,
}: CitationFullPanelProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDetailView, setIsDetailView] = useState(false);
  const tab = useCitationTab();
  const {
    centerKey,
    referenceNodes,
    referenceEdges,
    citingNodes,
    citingEdges,
  } = useCitationGraphData();
  const papers = useCitationPapers();
  const currentNodeCount =
    tab === "reference"
      ? referenceNodes.filter((n) => n.key !== centerKey).length
      : referenceNodes.filter((n) => n.key !== centerKey).length +
        citingNodes.filter((n) => n.key !== centerKey).length;
  const selectedNodeKey = useCitationSelectedNode();
  const { setTab, expandNode, selectNode, reset } = useCitationGraphActions();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [expandingNodeKey, setExpandingNodeKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentNodes = useMemo(
    () =>
      tab === "reference"
        ? referenceNodes
        : [
            ...referenceNodes,
            ...citingNodes.filter((n) => n.key !== centerKey),
          ],
    [tab, referenceNodes, citingNodes, centerKey],
  );

  const currentEdges = useMemo(
    () =>
      tab === "reference"
        ? referenceEdges
        : [...referenceEdges, ...citingEdges],
    [tab, referenceEdges, citingEdges],
  );

  const panelPapers =
    tab === "reference"
      ? papers.filter((p) => referenceNodes.some((n) => n.key === p.key))
      : papers;

  // 초기 탭 설정
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, setTab]);

  // 토스트 표시
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // 탭 전환
  const handleTabChange = (newTab: CitationTab) => {
    setTab(newTab);
    selectNode(null);
  };

  // 노드 클릭
  const handleNodeClick = useCallback(
    (nodeKey: string) => {
      selectNode(nodeKey);
      setIsPanelOpen(true);
    },
    [selectNode],
  );

  // expand
  useEffect(() => {
    const handleExpandNode = async (e: Event) => {
      const { nodeId } = (e as CustomEvent).detail;
      const node = currentNodes.find((n) => n.key === nodeId);
      if (!node || !node.has_more || !node.in_service) return;

      setExpandingNodeKey(nodeId);
      try {
        const allKeys = [
          ...referenceNodes.map((n) => n.key),
          ...citingNodes.map((n) => n.key),
        ];
        const response = await citationApi.expandCitationNode(paperId, nodeId, {
          direction:
            tab === "reference"
              ? "reference"
              : node.key === centerKey
                ? "citing"
                : tab === "relation"
                  ? referenceNodes.some((n) => n.key === nodeId)
                    ? "reference"
                    : "citing"
                  : "reference",
          existing_node_keys: allKeys,
          current_tier: node.tier,
        });
        expandNode(response);

        if (response.capped) {
          showToast("노드는 100개까지만 추가할 수 있어요");
        } else {
          showToast(
            tab === "reference"
              ? "참고문헌이 추가되었어요"
              : "인용관계가 추가되었어요",
          );
        }
      } catch {
        showToast("확장에 실패했어요. 다시 시도해주세요.");
      } finally {
        setExpandingNodeKey(null);
      }
    };

    window.addEventListener("citationExpandNode", handleExpandNode);
    return () =>
      window.removeEventListener("citationExpandNode", handleExpandNode);
  }, [
    paperId,
    tab,
    centerKey,
    referenceNodes,
    citingNodes,
    currentNodes,
    expandNode,
    showToast,
  ]);

  // 논문 보기
  useEffect(() => {
    const handleViewPaper = (e: Event) => {
      const { nodeId } = (e as CustomEvent).detail;
      selectNode(nodeId);
      setIsPanelOpen(true);
    };
    window.addEventListener("citationViewPaper", handleViewPaper);
    return () =>
      window.removeEventListener("citationViewPaper", handleViewPaper);
  }, [selectNode]);

  // 닫기
  const handleClose = () => {
    reset();
    onClose();
  };

  return createPortal(
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        gap: "10px",
        backgroundColor: "#F7F8FA",
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: "flex",
          padding: "16px 12px",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
          borderRadius: "8px",
          backgroundColor: "#FFF",
          flexShrink: 0,
        }}
      >
        {/* 로고 */}
        <Box
          component="img"
          src="/logo_icon.svg"
          alt="Biome 로고"
          sx={{ width: "36px", height: "36px", flexShrink: 0 }}
        />
        {/* 뒤로가기 */}
        <IconButton
          onClick={handleClose}
          sx={{ p: 0, width: "28px", height: "28px", flexShrink: 0 }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16, color: "label.normal" }} />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Typography
            noWrap
            sx={{
              maxWidth: "480px",
              color: "#3BA502",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.42px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {paperTitle}
          </Typography>
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              color: "label.normal",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.42px",
              flexShrink: 0,
            }}
          >
            연관 논문
          </Typography>
        </Box>
      </Box>

      {/* 그래프 + 서브패널 래퍼 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignSelf: "stretch",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        {/* 그래프 영역 */}
        <Box
          sx={{
            display: isDetailView ? "none" : "flex",
            padding: "32px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "32px",
            flex: isDetailView ? "none" : 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 상단 컨트롤 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch",
              flexShrink: 0,
            }}
          >
            {/* 뒤로가기 + 토글 + 노드 카운트 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* 뒤로가기 */}
              <Box
                onClick={handleClose}
                sx={{
                  display: "flex",
                  width: "36px",
                  height: "36px",
                  padding: "6px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  border: "1px solid #D8DAE5",
                  backgroundColor: "#FFF",
                  cursor: "pointer",
                }}
              >
                <ArrowBackIosNewIcon
                  sx={{ width: "24px", height: "24px", color: "label.normal" }}
                />
              </Box>

              <TabToggle tab={tab} onChange={handleTabChange} />

              {/* 노드 카운트 */}
              <Box
                sx={{
                  display: "flex",
                  padding: "4px",
                  alignItems: "center",
                  borderRadius: "43.478px",
                  backgroundColor: "#E9EAF2",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    padding: "4px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "43.478px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#292B33",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "-0.336px",
                    }}
                  >
                    노드 {currentNodeCount}/100
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* 햄버거 */}
            {!isPanelOpen && (
              <Box
                onClick={() => setIsPanelOpen((prev) => !prev)}
                sx={{
                  display: "flex",
                  width: "36px",
                  height: "36px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  border: "1px solid #D8DAE5",
                  backgroundColor: "#FFF",
                  cursor: "pointer",
                }}
              >
                <MenuIcon sx={{ width: "24px", height: "24px" }} />
              </Box>
            )}
          </Box>

          {/* ReactFlow 그래프 */}
          <Box sx={{ flex: 1, width: "100%", position: "relative" }}>
            <CitationGraphCanvas
              rawNodes={currentNodes}
              rawEdges={currentEdges}
              centerKey={centerKey}
              tab={tab}
              selectedNodeKey={selectedNodeKey}
              papers={papers}
              expandingNodeKey={expandingNodeKey}
              onNodeClick={handleNodeClick}
              onPaneClick={() => {
                setIsPanelOpen(false);
                selectNode(null);
              }}
            />
            {/* 토스트 */}
            {toastMessage && <Toast message={toastMessage} />}
          </Box>
        </Box>
        {/* 우측 패널 */}
        {isPanelOpen && (
          <CitationPaperListPanel
            papers={panelPapers}
            selectedNodeKey={selectedNodeKey}
            onDetailViewChange={setIsDetailView}
            onClose={() => {
              setIsPanelOpen(false);
              selectNode(null);
            }}
          />
        )}
      </Box>
    </Box>,
    document.body,
  );
};

export default CitationFullPanel;
