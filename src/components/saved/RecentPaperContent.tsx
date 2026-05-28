import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import RecentPaperHeader from './RecentPaperHeader';
import RecentPaperListView from './RecentPaperListView';
import RecentPaperChartView from './RecentPaperChartView';
import { type PeriodMode, type ViewMode } from '../../types/saved';
import {
  parseDateParam,
  formatDateParam,
  isPeriodMode,
  isViewMode,
} from '../../utils/savedUtils';

const titleSx: SxProps<Theme> = {
  fontSize: '24px',
  fontWeight: 600,
  color: 'static.black',
  mb: '16px',
};

const baseContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '24px 40px',
};

const listContainerSx: SxProps<Theme> = {
  ...baseContainerSx,
  overflow: 'visible',
};

const chartContainerSx: SxProps<Theme> = {
  ...baseContainerSx,
  height: 'calc(100vh - 65px)',
  minHeight: 0,
  overflow: 'hidden',
};

const chartViewWrapperSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const RecentPaperContent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL이 single source of truth — useState 없음
  const periodMode: PeriodMode = isPeriodMode(searchParams.get('mode'))
    ? (searchParams.get('mode') as PeriodMode)
    : 'day';

  const currentDate: Date = parseDateParam(searchParams.get('date'));

  const viewMode: ViewMode = isViewMode(searchParams.get('view'))
    ? (searchParams.get('view') as ViewMode)
    : 'list';

  // ─── 핸들러 ───────────────────────────────────────────────
  // setSearchParams 하나로 URL + 상태 동시 업데이트

  const handlePeriodModeChange = (mode: PeriodMode) => {
    setSearchParams(
      { tab: 'recent', view: viewMode, mode, date: formatDateParam(new Date()) },
      { replace: true },
    );
  };

  const handleDatePrev = () => {
    const next = new Date(currentDate);
    if (periodMode === 'day') next.setDate(next.getDate() - 1);
    else next.setDate(next.getDate() - 7);
    setSearchParams(
      { tab: 'recent', view: viewMode, mode: periodMode, date: formatDateParam(next) },
      { replace: true },
    );
  };

  const handleDateNext = () => {
    const next = new Date(currentDate);
    if (periodMode === 'day') next.setDate(next.getDate() + 1);
    else next.setDate(next.getDate() + 7);
    setSearchParams(
      { tab: 'recent', view: viewMode, mode: periodMode, date: formatDateParam(next) },
      { replace: true },
    );
  };

  const handleDateSelect = (date: Date) => {
    setSearchParams(
      { tab: 'recent', view: viewMode, mode: periodMode, date: formatDateParam(date) },
      { replace: true },
    );
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setSearchParams(
      { tab: 'recent', view: mode, mode: periodMode, date: formatDateParam(currentDate) },
      { replace: true },
    );
  };

  const handlePaperClick = (paperId: string) => {
    // URL이 항상 최신 상태이므로 그대로 returnTo로 사용
    const returnTo = `/saved?${searchParams.toString()}`;
    navigate(`/papers/${paperId}?returnTo=${encodeURIComponent(returnTo)}`);
  };

  return (
    <Box sx={viewMode === 'chart' ? chartContainerSx : listContainerSx}>
      <Typography sx={titleSx}>최근 읽은 논문</Typography>
      <RecentPaperHeader
        periodMode={periodMode}
        currentDate={currentDate}
        viewMode={viewMode}
        onPeriodModeChange={handlePeriodModeChange}
        onDatePrev={handleDatePrev}
        onDateNext={handleDateNext}
        onDateSelect={handleDateSelect}
        onViewModeChange={handleViewModeChange}
      />
      {viewMode === 'list' && (
        <RecentPaperListView
          periodMode={periodMode}
          currentDate={currentDate}
          onPaperClick={handlePaperClick}
        />
      )}
      {viewMode === 'chart' && (
        <Box sx={chartViewWrapperSx}>
          <RecentPaperChartView
            periodMode={periodMode}
            currentDate={currentDate}
            onPaperClick={handlePaperClick}
          />
        </Box>
      )}
    </Box>
  );
};

export default RecentPaperContent;