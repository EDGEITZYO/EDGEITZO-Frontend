import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import { Minus } from "lucide-react";
import {
  type ResearchFlowPaper,
  type ResearchFlowResponse,
} from "../../types/researcher";

type ResearchFlowLeftPanelProps = Pick<
  ResearchFlowResponse,
  "clusters" | "flow_level"
> & {
  selectedClusterId: number | null;
};

const DEFAULT_VISIBLE_COUNT = 3;

// ─── Styles ───────────────────────────────────────

const containerSx: SxProps<Theme> = {
  display: "flex",
  height: { xs: "auto", lg: "100%" },
  maxHeight: { xs: "714px", sm: "800px", lg: "none" },
  padding: "24px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "#FFF",
  overflowY: "auto",
  width: "100%",
};

const headerRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  alignSelf: "stretch",
};

const headerTextFrameSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "2px",
  flex: "1 0 0",
};

const clusterListSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "10px",
  alignSelf: "stretch",
};

const getClusterItemSx = (isSelected: boolean): SxProps<Theme> => ({
  display: "flex",
  padding: "16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  alignSelf: "stretch",
  borderRadius: "8px",
  border: isSelected ? "1px solid #000" : "none",
  backgroundColor: isSelected ? "fill.normal" : "#F7F8FA",
  flexShrink: 0,
});

const clusterContentSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
};

const topicAndAiSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  alignSelf: "stretch",
};

const aiSummaryRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  alignSelf: "stretch",
};

const aiBadgeSx: SxProps<Theme> = {
  display: "flex",
  padding: "2px 7px 2px 4px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "8px",
  borderRadius: "6px",
  backgroundColor: "#4ACE03",
  flexShrink: 0,
};

const aiBadgeInnerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
};

const paperListSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "6px",
  alignSelf: "stretch",
};

const numberBoxSx: SxProps<Theme> = {
  display: "flex",
  padding: "2px 6px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "8px",
  borderRadius: "6px",
  backgroundColor: "fill.normal",
  flexShrink: 0,
};

const paperInnerFrameSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
  flex: "1 0 0",
};

const paperInfoFrameSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "2px",
  flex: "1 0 0",
};

const moreButtonFrameSx: SxProps<Theme> = {
  display: "flex",
  paddingLeft: "2px",
  alignItems: "center",
  cursor: "pointer",
};

const moreIconButtonSx: SxProps<Theme> = {
  display: "flex",
  width: "20px",
  height: "20px",
  padding: "5px",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  borderRadius: "12px",
};

// ─── Helpers ───────────────────────────────────────

const formatPaperDate = (
  publishedAt: string | null,
  pubYear: number | null,
): string | null => {
  if (publishedAt !== null) {
    const date = new Date(publishedAt);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  }
  if (pubYear !== null) return String(pubYear);
  return null;
};

const formatPaperInfo = (paper: ResearchFlowPaper): string => {
  const parts: string[] = [];
  if (paper.journal_name !== null) parts.push(paper.journal_name);
  if (paper.citation_count !== null)
    parts.push(`피인용 ${paper.citation_count}`);
  const date = formatPaperDate(paper.published_at, paper.pub_year);
  if (date !== null) parts.push(date);
  return parts.join(" · ");
};

// ─── PaperRow ───────────────────────────────────────

interface PaperRowProps {
  paper: ResearchFlowPaper;
  index?: number; // undefined이면 번호 박스 없음 (하나짜리)
  onNavigate: (paper: ResearchFlowPaper) => void;
}

const PaperRow = ({ paper, index, onNavigate }: PaperRowProps) => {
  const isClickable = paper.is_internal && paper.detail_id !== null;
  const infoText = formatPaperInfo(paper);

  return (
    <Box
      sx={{
        display: "flex",
        padding: "10px 12px",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius: "6px",
        border: "1px solid",
        borderColor: "line.neutral",
        backgroundColor: "#FFF",
        cursor: isClickable ? "pointer" : "default",
        "&:hover": isClickable ? { backgroundColor: "#F7F8FA" } : {},
      }}
      onClick={() => {
        if (isClickable) onNavigate(paper);
      }}
    >
      <Box sx={paperInnerFrameSx}>
        {index !== undefined && (
          <Box sx={numberBoxSx}>
            <Box
              sx={{
                display: "flex",
                minWidth: "12px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  color: "label.normal",
                  fontSize: "11px",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "-0.22px",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {index + 1}
              </Typography>
            </Box>
          </Box>
        )}
        <Box sx={paperInfoFrameSx}>
          <Typography
            sx={{
              alignSelf: "stretch",
              color: "label.normal",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            {paper.title ?? "-"}
          </Typography>
          {infoText.length > 0 && (
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "label.alternative",
                fontSize: "11px",
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "-0.22px",
              }}
            >
              {infoText}
            </Typography>
          )}
        </Box>
      </Box>
      {isClickable && (
        <ChevronRightIcon
          sx={{ color: "label.alternative", fontSize: "20px", flexShrink: 0 }}
        />
      )}
    </Box>
  );
};

// ─── Main Component ───────────────────────────────────────

const ResearchFlowLeftPanel = ({
  clusters,
  flow_level,
  selectedClusterId,
}: ResearchFlowLeftPanelProps) => {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const clusterRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (selectedClusterId === null) return;
    const el = clusterRefs.current.get(selectedClusterId);
    if (el !== undefined) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedClusterId]);

  const handlePaperNavigate = (paper: ResearchFlowPaper) => {
    if (!paper.is_internal || paper.detail_id === null) return;
    navigate(`/papers/${paper.detail_id}`);
  };

  const toggleExpand = (clusterId: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(clusterId)) next.delete(clusterId);
      else next.add(clusterId);
      return next;
    });
  };

  const isSimpleMode = flow_level === "none";

  return (
    <Box sx={containerSx}>
      {/* 헤더 */}
      <Box sx={headerRowSx}>
        <Box sx={headerTextFrameSx}>
          <Typography
            sx={{
              color: "label.normal",
              fontSize: "24px",
              fontWeight: 600,
              lineHeight: "36px",
              letterSpacing: "-0.528px",
            }}
          >
            연구 흐름 상세보기
          </Typography>
          <Typography
            sx={{
              color: "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            요약 문장만 AI가 작성했어요.
          </Typography>
        </Box>
      </Box>

      {/* 클러스터 목록 */}
      <Box sx={clusterListSx}>
        {clusters.map((cluster) => {
          const isSelected = selectedClusterId === cluster.cluster_id;
          const isExpanded = expandedIds.has(cluster.cluster_id);
          const hasOnePaper = cluster.papers.length === 1;
          const showAISummary =
            !isSimpleMode && !hasOnePaper && cluster.description !== null;
          const showNumbers = !hasOnePaper;

          const visiblePapers =
            isSimpleMode || isExpanded
              ? cluster.papers
              : cluster.papers.slice(0, DEFAULT_VISIBLE_COUNT);
          const hiddenCount = cluster.papers.length - DEFAULT_VISIBLE_COUNT;

          return (
            <Box
              key={cluster.cluster_id}
              ref={(el: HTMLDivElement | null) => {
                if (el !== null)
                  clusterRefs.current.set(cluster.cluster_id, el);
                else clusterRefs.current.delete(cluster.cluster_id);
              }}
              sx={getClusterItemSx(isSelected)}
            >
              {/* 더보기 제외한 프레임 */}
              <Box sx={clusterContentSx}>
                {/* 토픽 + AI 요약 묶음 */}
                <Box sx={topicAndAiSx}>
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      alignSelf: "stretch",
                      color: "label.normal",
                      fontSize: "20px",
                      fontWeight: 600,
                      lineHeight: "30px",
                      letterSpacing: "-0.42px",
                    }}
                  >
                    {cluster.topic}
                  </Typography>
                  {showAISummary && (
                    <Box sx={aiSummaryRowSx}>
                      <Box sx={aiBadgeSx}>
                        <Box sx={aiBadgeInnerSx}>
                          <Box
                            component="img"
                            src="/biome-logo-white.svg"
                            alt="Biome 로고"
                            sx={{ width: "20px", height: "20px" }}
                          />
                          <Typography
                            sx={{
                              color: "#FFF",
                              fontSize: "13px",
                              fontWeight: 600,
                              lineHeight: "22px",
                              letterSpacing: "-0.26px",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            AI 요약
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          flex: "1 0 0",
                          color: "label.alternative",
                          fontSize: "16px",
                          fontWeight: 400,
                          lineHeight: "27px",
                          letterSpacing: "-0.336px",
                        }}
                      >
                        {cluster.description}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* 논문 목록 */}
                {cluster.papers.length > 0 && (
                  <Box sx={paperListSx}>
                    {visiblePapers.map((paper, i) => (
                      <PaperRow
                        key={paper.node_id}
                        paper={paper}
                        index={showNumbers ? i : undefined}
                        onNavigate={handlePaperNavigate}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* 더보기 / 간단히 보기 */}
              {!isSimpleMode &&
                cluster.papers.length > DEFAULT_VISIBLE_COUNT && (
                  <Box
                    sx={moreButtonFrameSx}
                    onClick={() => toggleExpand(cluster.cluster_id)}
                  >
                    {!isExpanded ? (
                      <>
                        <Typography
                          sx={{
                            color: "#1B1C23",
                            fontSize: "13px",
                            fontWeight: 400,
                            lineHeight: "22px",
                            letterSpacing: "-0.26px",
                          }}
                        >
                          {hiddenCount}편 더 보기
                        </Typography>
                        <Box sx={moreIconButtonSx}>
                          <AddIcon
                            sx={{ fontSize: "10px", color: "label.normal" }}
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography
                          sx={{
                            color: "#1B1C23",
                            fontSize: "13px",
                            fontWeight: 400,
                            lineHeight: "22px",
                            letterSpacing: "-0.26px",
                          }}
                        >
                          간단히 보기
                        </Typography>
                        <Box sx={moreIconButtonSx}>
                          <Minus size={10} color="#1E2026" />
                        </Box>
                      </>
                    )}
                  </Box>
                )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ResearchFlowLeftPanel;
