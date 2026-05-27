import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { type SxProps, type Theme } from '@mui/material/styles';
import BubbleChart from './BubbleChart';
import ChartRightPanel from './ChartRightPanel';
import { type RecentPaper, type ChartFilter, type PeriodMode } from '../../types/saved';
import { MOCK_RECENT_PAPERS } from './RecentPaperListView';

// ─── 목 데이터 ────────────────────────────────────────────
// TODO: API 연동 시 교체
const MOCK_SUMMARY = {
  totalCount: 16,
  keywordCount: 12,
  mostSearchedKeyword: 'IBS',
};

// ─── 스타일 ───────────────────────────────────────────────

const containerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '15px',
};

const summarySx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  padding: '16px 51px',
  borderRadius: '16px',
  border: '1px solid',
  borderColor: 'line.normal',
  gap: '0',
};

const summaryItemSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
};

const summaryDividerSx: SxProps<Theme> = {
  width: '1px',
  height: '44px',
  backgroundColor: 'line.normal',
  mx: '24px',
  flexShrink: 0,
};

const summaryLabelSx: SxProps<Theme> = {
  fontSize: '14px',
  fontWeight: 400,
  color: 'label.alternative',
};

const summaryValueSx: SxProps<Theme> = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'static.black',
};

const chartAreaSx: SxProps<Theme> = {
  display: 'flex',
  gap: '15px',
  flex: 1,
};

const chartWrapperSx: SxProps<Theme> = {
  flex: 1,
  borderRadius: '16px',
  backgroundColor: 'background.paper',
  position: 'relative',
  minHeight: '400px',
};

const fullscreenButtonSx: SxProps<Theme> = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  zIndex: 10,
  backgroundColor: 'background.default',
  borderRadius: '8px',
  '&:hover': { backgroundColor: 'fill.normal' },
};

// ─── 컴포넌트 ─────────────────────────────────────────────

interface RecentPaperChartViewProps {
  periodMode: PeriodMode;
  currentDate: Date;
}

const RecentPaperChartView = ({ periodMode, currentDate }: RecentPaperChartViewProps) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ChartFilter>({ publish: null, citation: null });
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[] | null>(null);

  // TODO: API 연동 시 periodMode, currentDate로 데이터 fetch
  const papers: RecentPaper[] = MOCK_RECENT_PAPERS;

  const handleDotClick = (paperIds: string[]) => {
    setSelectedPaperIds(paperIds);
  };

  const handleBackgroundClick = () => {
    setSelectedPaperIds(null);
  };

  const handleBack = () => {
    setSelectedPaperIds(null);
  };

  const handlePaperClick = (paperId: string) => {
    navigate(`/papers/${paperId}`);
  };

  const handleFullscreen = () => {
    const params = new URLSearchParams({
      date: currentDate.toISOString(),
      mode: periodMode,
      publish: filter.publish ?? '',
      citation: filter.citation ?? '',
    });
    navigate(`/saved/recent/fullscreen?${params.toString()}`);
  };

  return (
    <Box sx={containerSx}>
      {/* 요약 카드 */}
      <Box sx={summarySx}>
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>총 탐색 논문</Typography>
          <Typography sx={summaryValueSx}>{MOCK_SUMMARY.totalCount}건</Typography>
        </Box>
        <Box sx={summaryDividerSx} />
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>키워드 수</Typography>
          <Typography sx={summaryValueSx}>{MOCK_SUMMARY.keywordCount}개</Typography>
        </Box>
        <Box sx={summaryDividerSx} />
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>가장 많이 탐색한 키워드</Typography>
          <Typography sx={summaryValueSx}>{MOCK_SUMMARY.mostSearchedKeyword}</Typography>
        </Box>
      </Box>

      {/* 차트 영역 */}
      <Box sx={chartAreaSx}>
        <Box sx={chartWrapperSx}>
          <IconButton sx={fullscreenButtonSx} onClick={handleFullscreen}>
            <FullscreenIcon sx={{ fontSize: 24, color: 'label.alternative' }} />
          </IconButton>
          <BubbleChart
            variant="normal"
            papers={papers}
            selectedPaperIds={selectedPaperIds}
            onDotClick={handleDotClick}
            onBackgroundClick={handleBackgroundClick}
          />
        </Box>
        <ChartRightPanel
          papers={papers}
          filter={filter}
          selectedPaperIds={selectedPaperIds}
          onFilterChange={setFilter}
          onBack={handleBack}
          onPaperClick={handlePaperClick}
        />
      </Box>
    </Box>
  );
};

export default RecentPaperChartView;