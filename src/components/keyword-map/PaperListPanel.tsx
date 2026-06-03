import { Box, Typography, IconButton } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PaperCard from './PaperCard';
import { usePaperPanel, useKeywordMapActions } from '../../stores/keywordMapStore';
import { type KeywordPaper } from '../../types/keywordMap';

// ─── 목 데이터 ────────────────────────────────────────────
// TODO: API 연동 시 백엔드 응답으로 교체

const MOCK_PAPERS: KeywordPaper[] = [
  {
    id: '1',
    source: '2024한국정보과학회 논문지',
    date: '2024.10.16',
    title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
    authors: ['홍길동', '김철수', '이영희', '박민준'],
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    isBookmarked: false,
    paperType: '학위논문',
  },
  {
    id: '2',
    source: '2024한국정보과학회 논문지',
    date: '2024.10.16',
    title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
    authors: ['홍길동', '김철수', '이영희', '박민준'],
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    isBookmarked: false,
    paperType: '학술저널',
  },
  {
    id: '3',
    source: '2024한국정보과학회 논문지',
    date: '2024.10.16',
    title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
    authors: ['홍길동', '김철수', '이영희', '박민준'],
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    isBookmarked: false,
    paperType: '학위논문',
  },
  {
    id: '4',
    source: '2024한국정보과학회 논문지',
    date: '2024.10.16',
    title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
    authors: ['홍길동', '김철수', '이영희', '박민준'],
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    isBookmarked: false,
    paperType: '학술저널',
  },
];

// ─── 필터 바 ──────────────────────────────────────────────

const filterChipSx: SxProps<Theme> = {
  px: '13px',
  py: '5px',
  borderRadius: '7px',
  backgroundColor: 'background.default',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  '&:hover': { backgroundColor: 'fill.normal' },
};

// ─── 컴포넌트 ─────────────────────────────────────────────

interface PaperListPanelProps {
  onFullscreen: () => void;
}

const PaperListPanel = ({ onFullscreen }: PaperListPanelProps) => {
  const {
    isPaperPanelOpen,
    panelKeyword,
    papers,
    totalCount,
    currentPage,
  } = usePaperPanel();
  const { closePaperPanel, selectPaper, setCurrentPage } = useKeywordMapActions();

  // TODO: API 연동 시 실제 데이터로 교체
  const displayPapers = papers.length > 0 ? papers : MOCK_PAPERS;
  const displayTotal = totalCount > 0 ? totalCount : MOCK_PAPERS.length;
  const totalPages = Math.ceil(displayTotal / 4);

  if (!isPaperPanelOpen) return null;

  const handlePaperClick = (paperId: string) => {
    selectPaper(paperId);
    onFullscreen();
  };

  const handleBookmark = (paperId: string) => {
    // TODO: API 연동 시 북마크 처리
    console.log('bookmark', paperId);
  };

  return (
    <Box
      sx={{
        width: '762px',
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '11px 0 0 11px',
        backgroundColor: 'background.paper',
        boxShadow: '0 0 9px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 10px 9px 25px',
          borderBottom: '1px solid',
          borderColor: 'line.normal',
          backgroundColor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 키워드 칩 */}
          <Box
            sx={{
              px: '9px',
              py: '6px',
              borderRadius: '7px',
              backgroundColor: 'fill.strong',
            }}
          >
            <Typography
              sx={{
                fontSize: '17px',
                fontWeight: 600,
                color: 'static.white',
                letterSpacing: '-0.34px',
              }}
            >
              {panelKeyword}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '17px',
              fontWeight: 600,
              color: 'label.strong',
              letterSpacing: '-0.34px',
            }}
          >
            검색 결과 {displayTotal}건
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onFullscreen} size="small">
            <FullscreenIcon sx={{ fontSize: '24px', color: 'label.strong' }} />
          </IconButton>
          <IconButton onClick={closePaperPanel} size="small">
            <CloseIcon sx={{ fontSize: '24px', color: 'label.strong' }} />
          </IconButton>
        </Box>
      </Box>

      {/* 필터 바 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 10px 9px 25px',
          borderBottom: '1px solid',
          borderColor: 'line.normal',
          backgroundColor: 'background.paper',
          flexShrink: 0,
        }}
      >
        {['발행 연도', '논문 유형'].map((filter) => (
          <Box key={filter} sx={filterChipSx}>
            <Typography
              sx={{
                fontSize: '17px',
                fontWeight: 600,
                color: 'label.strong',
                letterSpacing: '-0.34px',
              }}
            >
              {filter}
            </Typography>
            <KeyboardArrowRightIcon
              sx={{ fontSize: '24px', color: 'label.strong', transform: 'rotate(90deg)' }}
            />
          </Box>
        ))}
        {['SCI 등재', 'KCI 등재'].map((filter) => (
          <Box key={filter} sx={filterChipSx}>
            <Typography
              sx={{
                fontSize: '17px',
                fontWeight: 600,
                color: 'label.strong',
                letterSpacing: '-0.34px',
              }}
            >
              {filter}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 논문 목록 */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {displayPapers.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography
              sx={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'static.black',
                letterSpacing: '-0.48px',
              }}
            >
              검색 조건에 맞는 학술 자료가 없어요
            </Typography>
          </Box>
        ) : (
          displayPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onClick={handlePaperClick}
              onBookmark={handleBookmark}
            />
          ))
        )}
      </Box>

      {/* 페이지네이션 */}
      {displayPapers.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            flexShrink: 0,
            borderTop: '1px solid',
            borderColor: 'line.normal',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              px: '12px',
              py: '3px',
              borderRadius: '91px',
              backgroundColor: 'background.default',
              boxShadow: '0 0 8.9px rgba(0, 0, 0, 0.1)',
            }}
          >
            <KeyboardArrowLeftIcon
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              sx={{
                fontSize: '20px',
                cursor: currentPage > 1 ? 'pointer' : 'default',
                color: currentPage > 1 ? 'label.strong' : 'label.disable',
              }}
            />
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '-0.4px',
              }}
            >
              <Box component="span" sx={{ color: 'label.strong' }}>
                {currentPage}
              </Box>
              <Box component="span" sx={{ color: 'label.assistive' }}>
                /{totalPages}
              </Box>
            </Typography>
            <KeyboardArrowRightIcon
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              sx={{
                fontSize: '20px',
                cursor: currentPage < totalPages ? 'pointer' : 'default',
                color: currentPage < totalPages ? 'label.strong' : 'label.disable',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaperListPanel;