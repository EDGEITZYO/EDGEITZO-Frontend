import { useState } from 'react';
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

const SavedPage = () => {
  const [activeTab, setActiveTab] = useState<SavedTab>('bookmark');

  return (
    <Box sx={pageWrapperSx}>
      <Header isLoggedIn />
      <Box sx={contentSx}>
        <SavedSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'bookmark' && <BookmarkContent />}
        {activeTab === 'recent' && <RecentPaperContent />}
      </Box>
    </Box>
  );
};

export default SavedPage;