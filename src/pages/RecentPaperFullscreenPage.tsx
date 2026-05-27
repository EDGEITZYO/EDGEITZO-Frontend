import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { type SxProps, type Theme } from '@mui/material/styles';
import BubbleChart from '../components/saved/BubbleChart';
import ChartRightPanel from '../components/saved/ChartRightPanel';
import { type ChartFilter, type PeriodMode } from '../types/saved';
import { MOCK_RECENT_PAPERS } from '../components/saved/RecentPaperListView';

const pageWrapperSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: 'background.default',
  overflow: 'hidden',
};

const headerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '8px 16px',
  flexShrink: 0,
};

const contentSx: SxProps<Theme> = {
  display: 'flex',
  flex: 1,
  gap: '15px',
  padding: '0 16px 16px 16px',
  overflow: 'hidden',
};

const chartWrapperSx: SxProps<Theme> = {
  flex: 1,
  borderRadius: '16px',
  backgroundColor: 'background.paper',
  overflow: 'hidden',
};

const RecentPaperFullscreenPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<ChartFilter>({
    publish: (searchParams.get('publish') as ChartFilter['publish']) || null,
    citation: (searchParams.get('citation') as ChartFilter['citation']) || null,
  });
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[] | null>(null);

  // TODO: API 연동 시 searchParams로 데이터 fetch
  const papers = MOCK_RECENT_PAPERS;
  const periodMode = (searchParams.get('mode') as PeriodMode) ?? 'day';

  const handleBack = () => {
    navigate(-1);
  };

  const handlePaperClick = (paperId: string) => {
    navigate(`/papers/${paperId}`);
  };

  return (
    <Box sx={pageWrapperSx}>
      <Box sx={headerSx}>
        <IconButton onClick={handleBack}>
          <CloseFullscreenIcon sx={{ fontSize: 24, color: 'label.alternative' }} />
        </IconButton>
      </Box>
      <Box sx={contentSx}>
        <Box sx={chartWrapperSx}>
          <BubbleChart
            variant="fullscreen"
            papers={papers}
            selectedPaperIds={selectedPaperIds}
            onDotClick={setSelectedPaperIds}
            onBackgroundClick={() => setSelectedPaperIds(null)}
          />
        </Box>
        <ChartRightPanel
          papers={papers}
          filter={filter}
          selectedPaperIds={selectedPaperIds}
          onFilterChange={setFilter}
          onBack={() => setSelectedPaperIds(null)}
          onPaperClick={handlePaperClick}
        />
      </Box>
    </Box>
  );
};

export default RecentPaperFullscreenPage;