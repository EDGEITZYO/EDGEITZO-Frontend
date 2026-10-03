import { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type SxProps, type Theme } from "@mui/material/styles";
import {
  type ResearchFlowResponse,
  type ResearcherPaperItem,
} from "../../types/researcher";
import ResearchFlowLeftPanel from "./ResearchFlowLeftPanel";
import ResearchFlowRightPanel from "./ResearchFlowRightPanel";
import ResearcherPapersTab from "./ResearcherPapersTab";
import { type PaperFilter } from "./ResearcherPapersTab";

// ─── 타입 ─────────────────────────────────────────────────

type TabType = "summary" | "papers";

export interface ResearchFlowTabProps {
  researcherName: string;
  researchFlow: ResearchFlowResponse | undefined;
  isResearchFlowPending: boolean;
  isResearchFlowError: boolean;
  papers: ResearcherPaperItem[];
  total: number;
  page: number;
  citationSortAvailable: boolean;
  onFilterChange: (filter: PaperFilter) => void;
  onPageChange: (page: number) => void;
  onPaperClick: (paper: ResearcherPaperItem) => void;
  onBookmarkToggle: (paper: ResearcherPaperItem) => void;
}

// ─── 스타일 ───────────────────────────────────────────────

const sectionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
  alignSelf: "stretch",
};

const titleBoxSx: SxProps<Theme> = {
  display: "flex",
  padding: "10px 12px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "2px",
  alignSelf: "stretch",
  borderRadius: "6px",
  backgroundColor: "background.paper",
};

const toggleContainerSx: SxProps<Theme> = {
  position: "relative",
  display: "flex",
  padding: "4px",
  alignItems: "center",
  borderRadius: "216px",
  backgroundColor: "fill.normal",
};

const summaryLayoutSx = (isMobileOrTablet: boolean): SxProps<Theme> => ({
  display: "flex",
  flexDirection: isMobileOrTablet ? "column" : "row",
  alignItems: isMobileOrTablet ? "flex-start" : "stretch",
  gap: "16px",
  alignSelf: "stretch",
  maxHeight: { lg: "1000px" },
});

// ─── 컴포넌트 ─────────────────────────────────────────────
interface ToggleProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabToggle = ({ activeTab, onTabChange }: ToggleProps) => (
  <Box sx={toggleContainerSx}>
    <Box
      sx={{
        position: "absolute",
        top: "4px",
        left: "4px",
        width: "calc(50% - 4px)",
        height: "calc(100% - 8px)",
        borderRadius: "216px",
        backgroundColor: "label.normal",
        transform:
          activeTab === "summary" ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.2s ease",
      }}
    />
    {(["summary", "papers"] as TabType[]).map((t) => {
      const isActive = activeTab === t;
      return (
        <Box
          key={t}
          onClick={() => onTabChange(t)}
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            padding: "6px 16px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "216px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Typography
            sx={{
              color: isActive ? "#FAFAFC" : "label.alternative",
              fontSize: "16px",
              fontWeight: isActive ? 600 : 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              transition: "color 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {t === "summary" ? "요약" : "논문"}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

const ResearchFlowTab = ({
  researcherName,
  researchFlow,
  isResearchFlowPending,
  isResearchFlowError,
  papers,
  total,
  page,
  citationSortAvailable,
  onFilterChange,
  onPageChange,
  onPaperClick,
  onBookmarkToggle,
}: ResearchFlowTabProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobileOrTablet = !isDesktop;

  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(
    null,
  );

  const handleClusterSelect = (clusterId: number) => {
    setSelectedClusterId((prev) => (prev === clusterId ? null : clusterId));
  };

  return (
    <Box sx={sectionSx}>
      {/* 제목 박스 */}
      <Box sx={titleBoxSx}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <Typography variant="h5" sx={{ color: "label.normal" }}>
            진행한 연구
          </Typography>
          {/* 모바일에서만 토글 */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />
          </Box>
        </Box>
      </Box>

      {/* 데스크탑/태블릿: 요약 탭일 때 토글만 있는 행 */}
      {activeTab === "summary" && (
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "flex-end",
            alignSelf: "stretch",
          }}
        >
          <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />
        </Box>
      )}

      {/* 콘텐츠 */}
      {activeTab === "summary" ? (
        isResearchFlowPending ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "80px 0",
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : isResearchFlowError || researchFlow === undefined ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "80px 0",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                color: "label.alternative",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.336px",
              }}
            >
              연구 흐름을 불러오지 못했어요. 다시 시도해주세요.
            </Typography>
          </Box>
        ) : (
          <Box sx={summaryLayoutSx(isMobileOrTablet)}>
            {isMobileOrTablet ? (
              <>
                <ResearchFlowRightPanel
                  researcherName={researcherName}
                  summary={researchFlow.summary}
                  clusters={researchFlow.clusters}
                  selectedClusterId={selectedClusterId}
                  onClusterSelect={handleClusterSelect}
                />
                <ResearchFlowLeftPanel
                  clusters={researchFlow.clusters}
                  flow_level={researchFlow.flow_level}
                  selectedClusterId={selectedClusterId}
                />
              </>
            ) : (
              <>
                <Box sx={{ flex: "1 1 0", minWidth: 0, display: "flex" }}>
                  <ResearchFlowLeftPanel
                    clusters={researchFlow.clusters}
                    flow_level={researchFlow.flow_level}
                    selectedClusterId={selectedClusterId}
                  />
                </Box>
                <Box sx={{ width: "455px", flexShrink: 0, display: "flex" }}>
                  <ResearchFlowRightPanel
                    researcherName={researcherName}
                    summary={researchFlow.summary}
                    clusters={researchFlow.clusters}
                    selectedClusterId={selectedClusterId}
                    onClusterSelect={handleClusterSelect}
                  />
                </Box>
              </>
            )}
          </Box>
        )
      ) : (
        <ResearcherPapersTab
          papers={papers}
          total={total}
          page={page}
          citationSortAvailable={citationSortAvailable}
          onFilterChange={onFilterChange}
          onPageChange={onPageChange}
          onPaperClick={onPaperClick}
          onBookmarkToggle={onBookmarkToggle}
          toggleEl={
            <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />
          }
        />
      )}
    </Box>
  );
};

export default ResearchFlowTab;
