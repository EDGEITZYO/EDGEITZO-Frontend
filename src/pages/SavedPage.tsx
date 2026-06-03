import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import Header from '../components/layout/Header';
import SavedSidebar, { type SavedTab } from '../components/saved/SavedSidebar';
import BookmarkContent from '../components/saved/BookmarkContent';
import RecentPaperContent from '../components/saved/RecentPaperContent';

const pageWrapperSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: 'background.default',
};

const contentSx: SxProps<Theme> = {
  display: 'flex',
  flex: 1,
};

const isSavedTab = (value: string | null): value is SavedTab =>
  value === 'bookmark' || value === 'recent';

const SavedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeTab: SavedTab = isSavedTab(searchParams.get('tab'))
    ? (searchParams.get('tab') as SavedTab)
    : 'bookmark';

  const handleTabChange = (tab: SavedTab) => {
    navigate(`/saved?tab=${tab}`, { replace: true });
  };

  return (
    <Box sx={pageWrapperSx}>
      <Header isLoggedIn />
      <Box sx={contentSx}>
        <SavedSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === 'bookmark' && <BookmarkContent />}
        {activeTab === 'recent' && <RecentPaperContent />}
      </Box>
    </Box>
  );
};

export default SavedPage;