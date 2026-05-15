import { Box } from '@mui/material';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

const HomePage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header isLoggedIn />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 3,
          py: 6,
          gap: 6,
        }}
      >
        {/* 개인 맞춤화 메시지 + 검색창 */}
        {/* 최근 탐색 이어하기 + 최근 확인한 논문 */}
      </Box>
      <BottomNav />
    </Box>
  );
};

export default HomePage;