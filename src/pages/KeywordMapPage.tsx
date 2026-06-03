import { useState } from 'react';
import { Box } from '@mui/material';
import { ReactFlowProvider } from 'reactflow';
import Header from '../components/layout/Header';
import Breadcrumb from '../components/keyword-map/Breadcrumb';
import KeywordMapGraph from '../components/keyword-map/KeywordMapGraph';
import PaperListPanel from '../components/keyword-map/PaperListPanel';
import PaperDetailPanel from '../components/keyword-map/PaperDetailPanel';
import { useKeywordMapActions } from '../stores/keywordMapStore';

const KeywordMapPage = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { selectPaper } = useKeywordMapActions();

  const handleFullscreen = () => {
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    selectPaper(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header isLoggedIn />
      <Breadcrumb />
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden', height: '100%' }}>
        <ReactFlowProvider>
          <KeywordMapGraph />
        </ReactFlowProvider>
        <PaperListPanel onFullscreen={handleFullscreen} />
        {isDetailOpen && <PaperDetailPanel onClose={handleDetailClose} />}
      </Box>
    </Box>
  );
};

export default KeywordMapPage;