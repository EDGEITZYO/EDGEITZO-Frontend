import { Box, Typography, IconButton, Select, MenuItem } from '@mui/material';
import { type SelectChangeEvent } from '@mui/material/Select';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type PeriodMode, type ViewMode } from '../../types/saved';

interface RecentPaperHeaderProps {
  periodMode: PeriodMode;
  currentDate: Date;
  viewMode: ViewMode;
  onPeriodModeChange: (mode: PeriodMode) => void;
  onDatePrev: () => void;
  onDateNext: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const headerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  mb: '16px',
};

const leftSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const periodSelectSx: SxProps<Theme> = {
  height: '40px',
  borderRadius: '12px',
  backgroundColor: 'line.neutral',
  fontSize: '18px',
  fontWeight: 600,
  color: 'static.black',
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiSelect-select': { padding: '8px 14px' },
};

const dateNavSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '8px 7px',
  borderRadius: '12px',
  backgroundColor: 'line.neutral',
};

const dateTextSx: SxProps<Theme> = {
  fontSize: '18px',
  fontWeight: 600,
  color: 'static.black',
  minWidth: '120px',
  textAlign: 'center',
};

const rightSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  padding: '3px 3px 3px 9px',
  borderRadius: '12px',
  backgroundColor: 'line.neutral',
};

const iconButtonSx = (isActive: boolean): SxProps<Theme> => ({
  width: 34,
  height: 34,
  borderRadius: '10px',
  backgroundColor: isActive ? 'background.default' : 'transparent',
  '&:hover': { backgroundColor: isActive ? 'background.default' : 'fill.normal' },
});

const formatDate = (date: Date, mode: PeriodMode): string => {
  if (mode === 'day') {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${date.getMonth() + 1}월 ${weekNumber}주`;
};

const RecentPaperHeader = ({
  periodMode,
  currentDate,
  viewMode,
  onPeriodModeChange,
  onDatePrev,
  onDateNext,
  onViewModeChange,
}: RecentPaperHeaderProps) => {
  const isToday = new Date().toDateString() === currentDate.toDateString();
  const isFutureWeek = periodMode === 'week' && currentDate > new Date();

  const handlePeriodChange = (e: SelectChangeEvent) => {
    onPeriodModeChange(e.target.value as PeriodMode);
  };

  return (
    <Box sx={headerSx}>
      <Box sx={leftSx}>
        {/* 일/주 드롭다운 */}
        <Select
          value={periodMode}
          onChange={handlePeriodChange}
          sx={periodSelectSx}
          IconComponent={KeyboardArrowDownIcon}
        >
          <MenuItem value="day">일</MenuItem>
          <MenuItem value="week">주</MenuItem>
        </Select>

        {/* 날짜 네비게이션 */}
        <Box sx={dateNavSx}>
          <IconButton size="small" sx={{ p: '4px' }} onClick={onDatePrev}>
            <ChevronLeftIcon sx={{ fontSize: 24, color: 'static.black' }} />
          </IconButton>
          <Typography sx={dateTextSx}>{formatDate(currentDate, periodMode)}</Typography>
          <IconButton
            size="small"
            sx={{ p: '4px' }}
            onClick={onDateNext}
            disabled={periodMode === 'day' ? isToday : isFutureWeek}
          >
            <ChevronRightIcon
              sx={{
                fontSize: 24,
                color: (periodMode === 'day' ? isToday : isFutureWeek)
                  ? 'label.disable'
                  : 'static.black',
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* 우측 아이콘 */}
      <Box sx={rightSx}>
        <IconButton size="small" sx={iconButtonSx(false)}>
          <SearchIcon sx={{ fontSize: 24, color: 'label.assistive' }} />
        </IconButton>
        <Box sx={{ display: 'flex', borderRadius: '10px', backgroundColor: 'line.neutral' }}>
          <IconButton
            size="small"
            sx={iconButtonSx(viewMode === 'list')}
            onClick={() => onViewModeChange('list')}
          >
            <ViewListIcon sx={{ fontSize: 24, color: viewMode === 'list' ? 'static.black' : 'label.assistive' }} />
          </IconButton>
          <IconButton
            size="small"
            sx={iconButtonSx(viewMode === 'chart')}
            onClick={() => onViewModeChange('chart')}
          >
            <ShowChartIcon sx={{ fontSize: 24, color: viewMode === 'chart' ? 'static.black' : 'label.assistive' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default RecentPaperHeader;