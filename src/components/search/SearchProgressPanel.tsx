import { useState } from 'react';
import { Box } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import SpecificityCard from './SpecificityCard';
import StepIndicator from './StepIndicator';
import SearchResultPanel from './SearchResultPanel';
import { type SearchProgress, type SearchResult, type PaperFeedback } from '../../types/search';

interface SearchProgressPanelProps {
  onSearchStart: () => void;
}

const containerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '27px 20px 20px 20px',
  gap: '17px',
  overflow: 'hidden',
};

const topRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: '17px',
  flexShrink: 0,
  alignItems: 'flex-start',
};

// TODO: API 연동 시 progress, result, isLoading을 props로 받거나 상위에서 상태 관리
const MOCK_PROGRESS: SearchProgress = {
  specificity: 10,
  currentStep: 'purpose',
};

const MOCK_RESULT: SearchResult | null = null;

const SearchProgressPanel = ({ onSearchStart }: SearchProgressPanelProps) => {
  const [progress] = useState<SearchProgress>(MOCK_PROGRESS);
  // TODO: API 연동 시 실제 결과로 교체
  const [result] = useState<SearchResult | null>(MOCK_RESULT);
  // TODO: API 연동 시 로딩 상태 실제 API 호출 기준으로 교체
  const [isLoading] = useState(false);

  const handleFeedback = (paperId: string, feedback: PaperFeedback) => {
    // TODO: API 연동 시 좋아요/싫어요 API 호출로 교체
    console.log('feedback', paperId, feedback);
  };

  // TODO: API 연동 시 specificity >= 80 조건 백엔드 기준으로 맞출 것
  const canSearchStart = progress.specificity >= 80;

  return (
    <Box sx={containerSx}>
      <Box sx={topRowSx}>
        <SpecificityCard specificity={progress.specificity} />
        <StepIndicator currentStep={progress.currentStep} />
      </Box>
      <SearchResultPanel
        result={result}
        isLoading={isLoading}
        onSearchStart={onSearchStart}
        onFeedback={handleFeedback}
        canSearchStart={canSearchStart}
      />
    </Box>
  );
};

export default SearchProgressPanel;