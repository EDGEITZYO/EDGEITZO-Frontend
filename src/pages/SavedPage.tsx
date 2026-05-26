import { useState } from 'react';
import { Box } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import Header from '../components/layout/Header';
import SavedSidebar, { type SavedTab } from '../components/saved/SavedSidebar';
import BookmarkFolderGrid from '../components/saved/BookmarkFolderGrid';

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
        {activeTab === 'bookmark' && <BookmarkFolderGrid />}
        {activeTab === 'recent' && null} {/* TODO: 최근 읽은 논문 */}
      </Box>
    </Box>
  );
};

export default SavedPage;