import { useState, useEffect } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import type { CitationTab } from "../../types/citation";
import { useCitationGraphActions } from "../../stores/citationGraphStore";
import { useCitationGraphQuery } from "../../queries/useCitationQuery";
import CitationGraphCanvas from "./CitationGraphCanvas";
import CitationFullPanel from "./CitationFullPanel";

interface CitationMiniGraphProps {
  paperId: string;
  paperTitle: string;
}

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
              color: isSelected ? "label.neutral" : "label.alternative",
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

// ─── 돋보기 버튼 ──────────────────────────────────────────

const MagnifyButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      display: "flex",
      width: "36px",
      height: "36px",
      padding: "6px",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "8px",
      border: "1px solid",
      borderColor: "line.normal",
      backgroundColor: "background.default",
    }}
  >
    <SearchIcon sx={{ width: "24px", height: "24px" }} />
  </IconButton>
);

// ─── 메인 컴포넌트 ────────────────────────────────────────

const CitationMiniGraph = ({ paperId, paperTitle }: CitationMiniGraphProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [tab, setTab] = useState<CitationTab>("reference");
  const [isFullPanelOpen, setIsFullPanelOpen] = useState(false);
  const {
    initReference,
    initCiting,
    setTab: setStoreTab,
    reset,
  } = useCitationGraphActions();

  const { data: referenceData, isPending: isReferencePending } =
    useCitationGraphQuery(paperId, "reference");

  const { data: citingData, isPending: isCitingPending } =
    useCitationGraphQuery(paperId, "citing", tab === "relation");

  useEffect(() => {
    if (referenceData) initReference(referenceData);
  }, [referenceData, initReference]);

  useEffect(() => {
    if (citingData) initCiting(citingData);
  }, [citingData, initCiting]);

  const handleTabChange = (newTab: CitationTab) => {
    setTab(newTab);
    setStoreTab(newTab);
  };

  const handleOpenFullPanel = () => {
    // 패널 열기 전에 스토어 먼저 채우기
    if (referenceData) initReference(referenceData);
    if (citingData) initCiting(citingData);
    setStoreTab(tab);
    setIsFullPanelOpen(true);
  };

  const handleCloseFullPanel = () => {
    setIsFullPanelOpen(false);
    reset();
  };

  const centerKey = referenceData?.center.key ?? "";

  const currentNodes =
    tab === "reference"
      ? (referenceData?.nodes ?? [])
      : [
          ...(referenceData?.nodes ?? []),
          ...(citingData?.nodes.filter((n) => n.key !== centerKey) ?? []),
        ];

  const currentEdges =
    tab === "reference"
      ? (referenceData?.edges ?? [])
      : [...(referenceData?.edges ?? []), ...(citingData?.edges ?? [])];

  const isPending =
    tab === "reference"
      ? isReferencePending
      : isReferencePending || isCitingPending;

  const isEmpty = currentNodes.filter((n) => n.key !== centerKey).length === 0;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
        }}
      >
        {/* 타이틀 영역 */}
        <Box
          sx={{
            display: "flex",
            padding: "10px 12px",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            borderRadius: "6px",
            backgroundColor: "background.paper",
          }}
        >
          <Typography
            sx={{
              color: "label.normal",
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "29px",
              letterSpacing: "-0.378px",
            }}
          >
            논문 관계
          </Typography>
          {!isDesktop && <MagnifyButton onClick={handleOpenFullPanel} />}
        </Box>

        {/* 데스크탑: 그래프 영역 */}
        {isDesktop && (
          <Box
            sx={{
              display: "flex",
              height: "480px",
              padding: "16px",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "12px",
              alignSelf: "stretch",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "line.neutral",
              backgroundColor: "#FFF",
            }}
          >
            {/* 상단: 토글 + 돋보기 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                alignSelf: "stretch",
              }}
            >
              <TabToggle tab={tab} onChange={handleTabChange} />
              <MagnifyButton onClick={handleOpenFullPanel} />
            </Box>

            {/* 그래프 */}
            <Box sx={{ flex: 1, width: "100%", position: "relative" }}>
              {isPending ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{ color: "label.alternative", fontSize: "16px" }}
                  >
                    불러오는 중...
                  </Typography>
                </Box>
              ) : isEmpty ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{ color: "label.alternative", fontSize: "16px" }}
                  >
                    {tab === "reference"
                      ? "표시할 참고문헌 관계가 없어요"
                      : "표시할 인용관계가 없어요"}
                  </Typography>
                </Box>
              ) : (
                <CitationGraphCanvas
                  rawNodes={currentNodes}
                  rawEdges={currentEdges}
                  centerKey={centerKey}
                  tab={tab}
                  selectedNodeKey={null}
                  papers={referenceData?.papers ?? []}
                  expandingNodeKey={null}
                  onNodeClick={() => {}}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      {isFullPanelOpen && (
        <CitationFullPanel
          paperId={paperId}
          paperTitle={paperTitle}
          initialTab={tab}
          onClose={handleCloseFullPanel}
        />
      )}
    </>
  );
};

export default CitationMiniGraph;
