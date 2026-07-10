import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import BubbleChart from "./BubbleChart";
import ChartRightPanel from "./ChartRightPanel";
import { type ChartFilter, type PeriodMode } from "../../types/saved";
import { savedApi } from "../../api/saved";
import { formatDateParam } from "../../utils/savedUtils";
import ChartAxisOverlay from "./ChartAxisOverlay";

interface RecentPaperChartViewProps {
  periodMode: PeriodMode;
  currentDate: Date;
  onPaperClick: (paperId: string) => void;
  onFilterChange: (filter: ChartFilter) => void;
}

const summarySx: SxProps<Theme> = {
  display: "flex",
  padding: "24px",
  alignItems: "flex-end",
  alignContent: "flex-end",
  gap: "12px 32px",
  alignSelf: "stretch",
  flexWrap: "wrap",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
};

const summaryItemSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-end",
  gap: "12px",
};

const summaryLabelSx: SxProps<Theme> = {
  color: "label.alternative",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const summaryValueSx: SxProps<Theme> = {
  color: "primary.dark",
  fontSize: "28px",
  fontWeight: 600,
  lineHeight: "42px",
  letterSpacing: "-0.784px",
};

const RecentPaperChartView = ({
  periodMode,
  currentDate,
  onPaperClick,
  onFilterChange,
}: RecentPaperChartViewProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [searchParams] = useSearchParams();
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[] | null>(
    null,
  );

  const dateParam = formatDateParam(currentDate);

  const { data, isPending, isError } = useQuery({
    queryKey: ["recent-paper-stats", periodMode, dateParam],
    queryFn: async () => {
      const res = await savedApi.getRecentPaperStats({
        period: periodMode,
        date: dateParam,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const filter: ChartFilter = {
    publish: (searchParams.get("publish") as ChartFilter["publish"]) || null,
    citation: (searchParams.get("citation") as ChartFilter["citation"]) || null,
  };

  const handleFullscreen = () => {
    const params = new URLSearchParams({
      mode: periodMode,
      date: dateParam,
      publish: filter.publish ?? "",
      citation: filter.citation ?? "",
    });
    navigate(`/saved/recent/fullscreen?${params.toString()}`);
  };

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: "80px",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: "80px",
          width: "100%",
        }}
      >
        <Typography sx={{ fontSize: "16px", color: "label.alternative" }}>
          데이터를 불러오지 못했어요. 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  const chartData = data.chart_data;

  // 좌측: 요약 + 차트
  const LeftPanel = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isDesktop ? "flex-start" : "stretch",
        width: isDesktop ? "auto" : "100%",
        gap: "8px",
        flex: isDesktop ? "1 0 0" : "auto",
      }}
    >
      {/* 요약 */}
      <Box sx={summarySx}>
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>총 탐색 논문</Typography>
          <Typography sx={summaryValueSx}>{data.total_papers}건</Typography>
        </Box>
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>키워드 수</Typography>
          <Typography sx={summaryValueSx}>{data.keyword_count}개</Typography>
        </Box>
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>가장 많이 탐색한 키워드</Typography>
          <Typography sx={summaryValueSx}>{data.top_keyword}</Typography>
        </Box>
      </Box>

      {/* 차트 영역 */}
      <Box
        sx={{
          height: "708px",
          alignSelf: "stretch",
          borderRadius: "8px",
          background: "linear-gradient(180deg, #F7F8FA 0%, #E6F9F0 100%)",
          position: "relative",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        {/* 확대 버튼 — 데스크탑에서만 */}
        {isDesktop && (
          <IconButton
            onClick={handleFullscreen}
            sx={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 10,
              display: "flex",
              width: "36px",
              height: "36px",
              padding: "4px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              backgroundColor: "label.normal",
              "&:hover": { backgroundColor: "label.strong" },
            }}
          >
            <FullscreenIcon
              sx={{ width: "28px", height: "28px", color: "static.white" }}
            />
          </IconButton>
        )}

        <ChartAxisOverlay />

        {/* 버블 차트 */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        >
          <BubbleChart
            papers={chartData}
            selectedPaperIds={selectedPaperIds}
            onDotClick={setSelectedPaperIds}
            onBackgroundClick={() => setSelectedPaperIds(null)}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        alignItems: "stretch",
        gap: "8px",
        width: "100%",
      }}
    >
      {LeftPanel}

      {/* 데스크탑일 때 좌측 높이에 맞추기 위한 래퍼(Wrapper) 적용 */}
      {isDesktop ? (
        <Box sx={{ width: "455px", position: "relative", flexShrink: 0 }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <ChartRightPanel
              papers={chartData}
              filter={filter}
              selectedPaperIds={selectedPaperIds}
              onFilterChange={onFilterChange}
              onBack={() => setSelectedPaperIds(null)}
              onPaperClick={onPaperClick}
            />
          </Box>
        </Box>
      ) : (
        <ChartRightPanel
          papers={chartData}
          filter={filter}
          selectedPaperIds={selectedPaperIds}
          onFilterChange={onFilterChange}
          onBack={() => setSelectedPaperIds(null)}
          onPaperClick={onPaperClick}
        />
      )}
    </Box>
  );
};

export default RecentPaperChartView;
