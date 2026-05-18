import { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { type SxProps, type Theme } from '@mui/material/styles';
import SearchHeader from '../components/search/SearchHeader';
import ExitConfirmDialog from '../components/search/ExitConfirmDialog';
import { type SearchView } from '../types/search';

interface LocationState {
  query: string;
  title: string;
}

const pageContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: 'background.default',
  minWidth: 1200,
};

const contentAreaSx: SxProps<Theme> = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
};

const chatPanelSx: SxProps<Theme> = {
  width: '50%',
  borderRight: '1px solid',
  borderColor: 'line.normal',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const progressPanelSx: SxProps<Theme> = {
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const query = state?.query ?? '';
  const [title, setTitle] = useState(state?.title ?? '검색');

  const [view, setView] = useState<SearchView>('chat');
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const handleBackClick = () => {
    setExitDialogOpen(true);
  };

  const handleExitConfirm = () => {
    setExitDialogOpen(false);
    navigate('/home');
  };

  const handleExitCancel = () => {
    setExitDialogOpen(false);
  };

  const handleSearchStart = () => {
    setView('list');
  };

  const handleResetCondition = () => {
    setView('chat');
  };

  return (
    <Box sx={pageContainerSx}>
      <SearchHeader title={title} onBack={handleBackClick} />
      <Box sx={contentAreaSx}>
        {view === 'chat' ? (
          <>
            {/* 좌측 대화 패널 */}
            <Box sx={chatPanelSx}>
              {/* TODO: SearchChatPanel */}
            </Box>
            {/* 우측 진행 결과 패널 */}
            <Box sx={progressPanelSx}>
              {/* TODO: SearchProgressPanel */}
            </Box>
          </>
        ) : (
          /* 전체화면 논문 리스트 */
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            {/* TODO: PaperListPage */}
          </Box>
        )}
      </Box>
      <ExitConfirmDialog
        open={exitDialogOpen}
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
      />
    </Box>
  );
};

export default SearchPage;