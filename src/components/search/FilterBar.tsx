import { Box, Button } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';

interface FilterBarProps {
  onResetCondition: () => void;
}

const containerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexShrink: 0,
  justifyContent: 'flex-end',
};

const filterButtonSx: SxProps<Theme> = {
  padding: '5px 13px',
  borderRadius: '7px',
  border: '1px solid',
  borderColor: 'line.normal',
  backgroundColor: 'background.default',
  color: 'label.normal',
  fontSize: '17px',
  fontWeight: 600,
  lineHeight: '170%',
  letterSpacing: '-0.34px',
  textTransform: 'none',
  '&:hover': { backgroundColor: 'fill.normal' },
};

const resetButtonSx: SxProps<Theme> = {
  padding: '5px 13px 5px 16px',
  borderRadius: '7px',
  backgroundColor: '#31333F',
  color: '#FFF',
  fontSize: '17px',
  fontWeight: 600,
  lineHeight: '170%',
  letterSpacing: '-0.34px',
  textTransform: 'none',
  '&:hover': { backgroundColor: '#474A55' },
};

const FilterBar = ({ onResetCondition }: FilterBarProps) => {
  return (
    <Box sx={containerSx}>
      {/* TODO: API 연동 시 각 필터 클릭 시 실제 필터링 동작 구현 */}
      <Button sx={filterButtonSx}>발행 연도</Button>
      <Button sx={filterButtonSx}>논문 유형</Button>
      <Button sx={filterButtonSx}>SCI 등재</Button>
      <Button sx={filterButtonSx}>검색 필터 추가하기</Button>
      <Button sx={resetButtonSx} onClick={onResetCondition}>
        탐색 조건 재설정하기
      </Button>
    </Box>
  );
};

export default FilterBar;