import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import RecentPaperHeader from './RecentPaperHeader';
import RecentPaperListView from './RecentPaperListView';
import RecentPaperChartView from './RecentPaperChartView';
import { type PeriodMode, type ViewMode, type ChartFilter } from '../../types/saved';
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

  // 중복 호출 제거 — 변수로 먼저 받기
  const modeParam = searchParams.get('mode');
  const viewParam = searchParams.get('view');

  const periodMode: PeriodMode = isPeriodMode(modeParam) ? modeParam : 'day';
  const viewMode: ViewMode = isViewMode(viewParam) ? viewParam : 'list';
  const currentDate: Date = parseDateParam(searchParams.get('date'));

  // 기존 query를 보존하면서 필요한 값만 업데이트
  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'recent');
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next, { replace: true });
  };

  const handlePeriodModeChange = (mode: PeriodMode) => {
    updateParams({ view: viewMode, mode, date: formatDateParam(new Date()) });
  };

  const handleDatePrev = () => {
    const next = new Date(currentDate);
    if (periodMode === 'day') next.setDate(next.getDate() - 1);
    else next.setDate(next.getDate() - 7);
    updateParams({ view: viewMode, mode: periodMode, date: formatDateParam(next) });
  };

  const handleDateNext = () => {
    const next = new Date(currentDate);
    if (periodMode === 'day') next.setDate(next.getDate() + 1);
    else next.setDate(next.getDate() + 7);
    updateParams({ view: viewMode, mode: periodMode, date: formatDateParam(next) });
  };

  const handleDateSelect = (date: Date) => {
    updateParams({ view: viewMode, mode: periodMode, date: formatDateParam(date) });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    updateParams({ view: mode, mode: periodMode, date: formatDateParam(currentDate) });
  };

  const handleFilterChange = (filter: ChartFilter) => {
    updateParams({
      view: viewMode,
      mode: periodMode,
      date: formatDateParam(currentDate),
      publish: filter.publish ?? null,
      citation: filter.citation ?? null,
    });
  };

  const handlePaperClick = (paperId: string) => {
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
            onFilterChange={handleFilterChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default RecentPaperContent;