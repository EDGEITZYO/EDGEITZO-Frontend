import { Box, Button, IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { type SxProps, type Theme } from '@mui/material/styles';

interface BookmarkFilterBarProps {
  onEdit: () => void;
  onDelete: () => void;
}

const containerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexShrink: 0,
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

const iconButtonSx: SxProps<Theme> = {
  width: 40,
  height: 39,
  borderRadius: '13px',
  backgroundColor: 'background.default',
  '&:hover': { backgroundColor: 'fill.normal' },
};

const BookmarkFilterBar = ({ onEdit, onDelete }: BookmarkFilterBarProps) => {
  return (
    <Box sx={containerSx}>
      {/* TODO: API 연동 시 각 필터 클릭 시 실제 필터링 동작 구현 */}
      <Button sx={filterButtonSx}>발행 연도</Button>
      <Button sx={filterButtonSx}>논문 유형</Button>
      <Button sx={filterButtonSx}>SCI 등재</Button>
      <Button sx={filterButtonSx}>검색 필터 추가하기</Button>
      <Box sx={{ flex: 1 }} />
      <IconButton sx={iconButtonSx} onClick={onEdit}>
        <EditOutlinedIcon sx={{ fontSize: 24, color: 'label.alternative' }} />
      </IconButton>
      <IconButton sx={iconButtonSx} onClick={onDelete}>
        <DeleteOutlineIcon sx={{ fontSize: 24, color: 'label.alternative' }} />
      </IconButton>
    </Box>
  );
};

export default BookmarkFilterBar;