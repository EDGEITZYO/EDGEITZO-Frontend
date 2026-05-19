import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import MiniPaperCard from './MiniPaperCard';
import { type SearchResult, type PaperFeedback } from '../../types/search';

interface SearchResultPanelProps {
  result: SearchResult | null;
  isLoading: boolean;
  onSearchStart: () => void;
  onFeedback: (paperId: string, feedback: PaperFeedback) => void;
  // TODO: API 연동 시 바로 검색 시작 버튼 활성화 조건 백엔드 기준으로 맞출 것 (specificity >= 80)
  canSearchStart: boolean;
}

const containerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
  gap: '8px',
};

const titleSx: SxProps<Theme> = {
  fontSize: '24px',
  fontWeight: 600,
  color: '#000',
  lineHeight: '150%',
};

const subTextSx: SxProps<Theme> = {
  fontSize: '16px',
  fontWeight: 500,
  color: '#5D6279',
  lineHeight: '150%',
};

const resultBoxSx = (hasResult: boolean): SxProps<Theme> => ({
  borderRadius: '12px',
  backgroundColor: '#F6F7F8',
  display: 'flex',
  flexDirection: 'column',
  ...(hasResult ? { flex: 1, overflow: 'hidden' } : { height: 137 }),
});

const emptyBoxSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

const emptyTextSx: SxProps<Theme> = {
  fontSize: '22px',
  fontWeight: 500,
  color: '#9195AB',
  lineHeight: '150%',
  textAlign: 'center',
};

const totalCountSx: SxProps<Theme> = {
  fontSize: '20px',
  fontWeight: 600,
  color: '#000',
  lineHeight: '150%',
  px: '22px',
  pt: '21px',
};

const paperListSx: SxProps<Theme> = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  px: '20px',
  gap: '15px',
  pb: '15px',
};

const searchStartButtonSx = (canStart: boolean): SxProps<Theme> => ({
  display: 'inline-flex',
  padding: '10px 32px 10px 33px',
  borderRadius: '50px',
  backgroundColor: canStart ? '#31333F' : '#CBCDD7',
  color: '#FFF',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '150%',
  alignSelf: 'flex-end',
  mt: '8px',
  pointerEvents: canStart ? 'auto' : 'none',
  '&:hover': {
    backgroundColor: canStart ? '#474A55' : '#CBCDD7',
  },
});

const SearchResultPanel = ({
  result,
  isLoading,
  onSearchStart,
  onFeedback,
  canSearchStart,
}: SearchResultPanelProps) => {
  return (
    <Box sx={containerSx}>
      <Typography sx={titleSx}>검색 진행 결과</Typography>
      {result && (
        <Typography sx={subTextSx}>
          좋아요, 싫어요 버튼을 통해 검색 결과를 유지하거나 삭제할 수 있어요
        </Typography>
      )}
      <Box sx={resultBoxSx(result !== null)}>
        {isLoading ? (
          <Box sx={emptyBoxSx}>
            <CircularProgress size={48} sx={{ color: '#9195AB' }} />
            <Typography sx={emptyTextSx}>검색 진행 중</Typography>
          </Box>
        ) : result === null ? (
          <Box sx={emptyBoxSx}>
            <Typography sx={emptyTextSx}>아직 검색이 진행중이에요</Typography>
          </Box>
        ) : (
          <>
            <Typography sx={totalCountSx}>총 {result.totalCount}건</Typography>
            <Box sx={paperListSx}>
              {result.papers.map((paper) => (
                <MiniPaperCard
                  key={paper.id}
                  paper={paper}
                  onFeedback={onFeedback}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
      {result !== null && (
        <Button sx={searchStartButtonSx(canSearchStart)} onClick={onSearchStart}>
          바로 검색 시작
        </Button>
      )}
    </Box>
  );
};

export default SearchResultPanel;