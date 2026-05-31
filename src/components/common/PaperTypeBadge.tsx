import { Box, Typography } from '@mui/material';
import { type PaperType } from '../../types/paper';

interface PaperTypeBadgeProps {
  paperType: PaperType;
}

const PaperTypeBadge = ({ paperType }: PaperTypeBadgeProps) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      px: '6px',
      borderRadius: '7px',
      height: '28px',
      alignSelf: 'flex-start',
      backgroundColor: paperType === '학위논문' ? 'primary.dark' : 'status.negative',
    }}
  >
    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: 'static.white' }}>
      {paperType}
    </Typography>
  </Box>
);

export default PaperTypeBadge;