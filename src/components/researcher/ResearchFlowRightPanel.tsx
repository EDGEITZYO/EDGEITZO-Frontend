import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { type ResearchFlowResponse } from "../../types/researcher";

type ResearchFlowRightPanelProps = Pick<
  ResearchFlowResponse,
  "summary" | "clusters"
> & {
  researcherName: string;
  selectedClusterId: number | null;
  onClusterSelect: (clusterId: number) => void;
};

const containerSx: SxProps<Theme> = {
  display: "flex",
  height: { xs: "auto", lg: "100%" },
  minHeight: 0,
  maxHeight: { xs: "none", sm: "640px", lg: "none" },
  padding: { xs: "16px 0", sm: "24px" },
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
  borderRadius: "8px",
  borderWidth: { xs: 0, sm: "1px" },
  borderStyle: { xs: "none", sm: "solid" },
  borderColor: "line.normal",
  backgroundColor: "#FFF",
  overflow: { xs: "visible", sm: "hidden" },
};

const badgeTitleWrapSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  alignSelf: "stretch",
};

const badgeSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px",
  alignItems: "flex-start",
  gap: "4px",
  borderRadius: "4px",
  backgroundColor: "#292B33",
};

const infoBoxSx: SxProps<Theme> = {
  display: "flex",
  padding: "12px",
  alignItems: "flex-start",
  gap: "8px",
  alignSelf: "stretch",
  borderRadius: "6px",
  backgroundColor: "#F7F8FA",
};

const summarySectionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "6px",
  alignSelf: "stretch",
};

const flowSectionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  alignSelf: "stretch",
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: "auto",
  minHeight: 0,
  overflow: "hidden",
};

const clusterListSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  alignSelf: "stretch",
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: "auto",
  minHeight: 0,
  overflowY: { xs: "visible", sm: "auto" },
};

const infoValueFrameSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  flex: "1 0 0",
};

const sectionLabelSx: SxProps<Theme> = {
  color: "label.alternative",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

const getClusterItemSx = (isSelected: boolean): SxProps<Theme> => ({
  display: "flex",
  padding: "14px",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
  borderRadius: "8px",
  border: isSelected ? "1.5px solid" : "1px solid",
  borderColor: isSelected ? "label.normal" : "line.neutral",
  backgroundColor: isSelected ? "fill.normal" : "#FFF",
  cursor: "pointer",
  flexShrink: 0,
});

const getNumberBoxSx = (isSelected: boolean): SxProps<Theme> => ({
  display: "flex",
  width: "24px",
  height: "24px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "12px",
  backgroundColor: isSelected ? "#1E2026" : "#F7F8FA",
  flexShrink: 0,
});

const formatYearRange = (
  startYear: number | null,
  endYear: number | null,
): string | null => {
  if (startYear === null && endYear === null) return null;
  if (startYear === null) return `~${endYear}`;
  if (endYear === null) return `${startYear}~`;
  return `${startYear}-${endYear}`;
};

const ResearchFlowRightPanel = ({
  researcherName,
  summary,
  clusters,
  selectedClusterId,
  onClusterSelect,
}: ResearchFlowRightPanelProps) => {
  return (
    <Box sx={containerSx}>
      {/* 바이옴 AI 유추 표시 + 제목 */}
      <Box sx={badgeTitleWrapSx}>
        <Box sx={badgeSx}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: "-0.26px",
            }}
          >
            ✦ 바이옴 AI 유추
          </Typography>
        </Box>
        <Typography
          sx={{
            alignSelf: "stretch",
            color: "label.normal",
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "29px",
            letterSpacing: "-0.378px",
          }}
        >
          바이옴 AI가 유추한 {researcherName} 연구자의 연구 흐름
        </Typography>
      </Box>

      {/* 추가 설명 박스 */}
      <Box sx={infoBoxSx}>
        <InfoOutlinedIcon
          sx={{
            color: "label.alternative",
            fontSize: "16px",
            flexShrink: 0,
            mt: "3px",
          }}
        />
        <Typography
          sx={{
            flex: "1 0 0",
            color: "label.alternative",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: "-0.26px",
          }}
        >
          논문 제목·초록·키워드를 바탕으로 AI가 유추한 흐름이에요. 실제 연구
          의도나 논문 간 연결과는 다를 수 있어요.
        </Typography>
      </Box>

      {/* 한 줄 요약 */}
      {summary !== null && (
        <Box sx={summarySectionSx}>
          <Typography sx={sectionLabelSx}>한 줄 요약</Typography>
          <Typography
            sx={{
              alignSelf: "stretch",
              color: "label.normal",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "27px",
              letterSpacing: "-0.336px",
            }}
          >
            {summary}
          </Typography>
        </Box>
      )}

      {/* 연구 흐름 예측 섹션 */}
      <Box sx={flowSectionSx}>
        <Typography sx={sectionLabelSx}>연구 흐름 예측</Typography>
        <Box sx={clusterListSx}>
          {clusters.map((cluster, index) => {
            const isSelected = selectedClusterId === cluster.cluster_id;
            const yearRange = formatYearRange(
              cluster.start_year,
              cluster.end_year,
            );

            return (
              <Box
                key={cluster.cluster_id}
                sx={getClusterItemSx(isSelected)}
                onClick={() => onClusterSelect(cluster.cluster_id)}
              >
                <Box sx={getNumberBoxSx(isSelected)}>
                  <Typography
                    sx={{
                      color: isSelected ? "#FFF" : "label.alternative",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                    }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
                <Box sx={infoValueFrameSx}>
                  {yearRange !== null && (
                    <Typography sx={sectionLabelSx}>{yearRange}</Typography>
                  )}
                  <Typography
                    sx={{
                      alignSelf: "stretch",
                      color: "label.normal",
                      fontSize: "18px",
                      fontWeight: 500,
                      lineHeight: "30px",
                      letterSpacing: "-0.378px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cluster.topic}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#292B33",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                    }}
                  >
                    근거 논문 {cluster.paper_count}편
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ResearchFlowRightPanel;
