import { Box } from '@mui/material';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import PersonalMessage from '../components/home/PersonalMessage';
import SearchBar from '../components/home/SearchBar';

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
          pt: '15.23%',
          gap: '48px',
          backgroundColor: 'background.paper',
        }}
      >
        <PersonalMessage />
        <SearchBar />
        {/* 최근 탐색 이어하기 + 최근 확인한 논문 */}
      </Box>
      <BottomNav />
    </Box>
  );
};

export default HomePage;