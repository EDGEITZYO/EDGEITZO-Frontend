import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useKeywordMapActions, useSelectedPaperId } from '../../stores/keywordMapStore';
import { type KeywordPaperDetail } from '../../types/keywordMap';
import PaperCard from './PaperCard';

// ─── 목 데이터 ────────────────────────────────────────────
// TODO: API 연동 시 백엔드 응답으로 교체

const MOCK_PAPER_DETAIL: KeywordPaperDetail = {
  id: '1',
  source: '한국정보통신학회 2021년도 춘계학술대회',
  date: '2021.04.03',
  title: '한글 토크나이징 라이브러리 모듈 분석',
  authors: ['이재경', '외 3인'],
  keywords: ['논문 키워드', '논문 키워드', '논문 키워드', '논문 키워드', '논문 키워드', '논문 키워드'],
  kciType: 'KCI O',
  citationCount: 0,
  isBookmarked: false,
  abstract: '현재 자연어 처리(NLP)에 대한 연구는 급속히 발전하고 있다. 자연어 처리는 인간이 일상생활에서 사용하는 언어의 의미를 분석하여 컴퓨터가 처리할 수 있도록 하는 기술로 음성인식, 맞춤법 검사, 텍스트 분류 등 여러 분야에 사용되고 있다.',
  relatedPapers: [
    {
      id: 'r1',
      source: '2024한국정보과학회 논문지',
      date: '2024.10.16',
      title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
      authors: ['홍길동', '외 4인'],
      keywords: ['논문 키워드', '논문 키워드'],
      kciType: 'KCI O',
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: 'r2',
      source: '2024한국정보과학회 논문지',
      date: '2024.10.16',
      title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
      authors: ['홍길동', '외 4인'],
      keywords: ['논문 키워드', '논문 키워드'],
      kciType: 'KCI O',
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: 'r3',
      source: '2024한국정보과학회 논문지',
      date: '2024.10.16',
      title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
      authors: ['홍길동', '외 4인'],
      keywords: ['논문 키워드', '논문 키워드'],
      kciType: 'KCI O',
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: 'r4',
      source: '2024한국정보과학회 논문지',
      date: '2024.10.16',
      title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
      authors: ['홍길동', '외 4인'],
      keywords: ['논문 키워드', '논문 키워드'],
      kciType: 'KCI O',
      citationCount: 0,
      isBookmarked: false,
    },
  ],
};

// ─── 컴포넌트 ─────────────────────────────────────────────

interface PaperDetailPanelProps {
  onClose: () => void;
}

const PaperDetailPanel = ({ onClose }: PaperDetailPanelProps) => {
  const selectedPaperId = useSelectedPaperId();
  const { selectPaper } = useKeywordMapActions();

  if (!selectedPaperId) return null;

  // TODO: API 연동 시 selectedPaperId로 논문 상세 데이터 fetch
  const paper = MOCK_PAPER_DETAIL;

  const handleClose = () => {
    selectPaper(null);
    onClose();
  };

  const handleBookmark = () => {
    // TODO: API 연동 시 북마크 처리
    console.log('bookmark', selectedPaperId);
  };

  const handleRelatedPaperClick = (paperId: string) => {
    selectPaper(paperId);
  };

  const handleRelatedPaperBookmark = (paperId: string) => {
    // TODO: API 연동 시 북마크 처리
    console.log('bookmark related', paperId);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        zIndex: 11,
        overflowY: 'auto',
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 10px 10px 25px',
          borderBottom: '1px solid',
          borderColor: 'line.normal',
          backgroundColor: 'background.paper',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography
            sx={{
              fontSize: '17px',
              fontWeight: 600,
              color: 'label.strong',
              letterSpacing: '-0.34px',
            }}
          >
            {/* TODO: API 연동 시 검색 키워드로 교체 */}
            검색 결과
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: '24px', color: 'label.strong' }} />
        </IconButton>
      </Box>

      {/* 논문 정보 */}
      <Box
        sx={{
          padding: '20px 31px 26px 31px',
          display: 'flex',
          flexDirection: 'column',
          gap: '17px',
          borderBottom: '1px solid',
          borderColor: 'line.normal',
          backgroundColor: 'background.paper',
          flexShrink: 0,
        }}
      >
        {/* KCI + 인용수 + 원문보기 + 북마크 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', gap: '6px' }}>
            {[paper.kciType, `인용수 ${paper.citationCount}`].map((tag) => (
              <Box
                key={tag}
                sx={{
                  px: '8px',
                  py: '3px',
                  borderRadius: '12px',
                  backgroundColor: 'static.black',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'static.white',
                  }}
                >
                  {tag}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <Typography
                sx={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'label.strong',
                  letterSpacing: '-0.34px',
                }}
              >
                원문보기
              </Typography>
              <OpenInNewIcon sx={{ fontSize: '25px', color: 'label.strong' }} />
            </Box>
            {paper.isBookmarked ? (
              <BookmarkIcon
                onClick={handleBookmark}
                sx={{ fontSize: '24px', color: 'primary.main', cursor: 'pointer' }}
              />
            ) : (
              <BookmarkBorderIcon
                onClick={handleBookmark}
                sx={{ fontSize: '24px', color: 'label.assistive', cursor: 'pointer' }}
              />
            )}
          </Box>
        </Box>

        {/* 제목 */}
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'static.black',
            letterSpacing: '-0.48px',
            lineHeight: '36px',
          }}
        >
          {paper.title}
        </Typography>

        {/* 출처 + 날짜 */}
        <Typography
          sx={{
            fontSize: '17px',
            fontWeight: 400,
            color: 'label.alternative',
            letterSpacing: '-0.34px',
          }}
        >
          {paper.source} {paper.date}
        </Typography>

        {/* 저자 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography
            sx={{
              fontSize: '17px',
              fontWeight: 400,
              color: 'label.alternative',
              letterSpacing: '-0.34px',
            }}
          >
            {paper.authors.join(' ')}
          </Typography>
          <ExpandMoreIcon sx={{ fontSize: '16px', color: 'label.assistive' }} />
        </Box>

        {/* 핵심 키워드 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography
            sx={{
              fontSize: '17px',
              fontWeight: 400,
              color: 'label.normal',
            }}
          >
            핵심 키워드
          </Typography>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {paper.keywords.map((keyword, index) => (
              <Box
                key={index}
                sx={{
                  px: '8px',
                  py: '4px',
                  borderRadius: '4px',
                  border: '1px solid',
                  borderColor: 'line.normal',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: 'label.alternative',
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* 초록 */}
      <Box
        sx={{
          padding: '18px 99px 18px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '19px',
          borderRadius: '14px',
          backgroundColor: 'background.default',
          margin: '20px 31px',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            px: '9px',
            py: '6px',
            borderRadius: '7px',
            backgroundColor: 'background.paper',
            alignSelf: 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontSize: '17px',
              fontWeight: 600,
              color: 'label.strong',
            }}
          >
            초록
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '17px',
            fontWeight: 400,
            color: 'static.black',
            lineHeight: '29px',
            letterSpacing: '-0.34px',
          }}
        >
          {paper.abstract}
        </Typography>
      </Box>

      {/* 연관된 논문 */}
      <Box
        sx={{
          padding: '0 31px 40px 31px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'static.black',
            letterSpacing: '-0.48px',
          }}
        >
          연관된 논문
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
          }}
        >
          {paper.relatedPapers.map((relatedPaper) => (
            <Box key={relatedPaper.id} sx={{ width: 'calc(50% - 8px)' }}>
              <PaperCard
                paper={relatedPaper}
                onClick={handleRelatedPaperClick}
                onBookmark={handleRelatedPaperBookmark}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PaperDetailPanel;