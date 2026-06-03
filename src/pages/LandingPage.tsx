import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{ textAlign: 'center', whiteSpace: 'pre-line' }}
      >
        {'살아 숨쉬는 연구 생태계 속에서\n나에게 핏한 논문을 빠르게 탐색해보세요'}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/login')}>
        로그인
      </Button>
    </Box>
  );
};

export default LandingPage;