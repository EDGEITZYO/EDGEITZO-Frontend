import { Box, Typography } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import FilterBar from './FilterBar';
import PaperListCard from './PaperListCard';
import { type PaperListItem } from '../../types/search';

interface PaperListPanelProps {
  papers: PaperListItem[];
  totalCount: number;
  onResetCondition: () => void;
  onBookmark: (paperId: string) => void;
  onPaperClick: (paperId: string) => void;
}

const containerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  px: '94.5px',
  py: '27px',
  gap: '16px',
  overflow: 'hidden',
};

const headerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  flexShrink: 0,
};

const totalCountSx: SxProps<Theme> = {
  fontSize: '24px',
  fontWeight: 600,
  color: '#000',
  lineHeight: '150%',
};

const paperListSx: SxProps<Theme> = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '17px',
  pb: '20px',
};

// TODO: API 연동 시 실제 데이터로 교체
const MOCK_PAPERS: PaperListItem[] = [
  {
    id: '1',
    source: '2024한국정보과학회 논문지',
    date: '2024.10.16',
    title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
    authors: ['홍길동', '김철수', '이영희', '박민수'],
    abstract: '식물바이러스는 다양한 경로를 통해 전파되며, 이는 작물 생산성과 생태계 건강에 심각한 영향을 미친다. 본 논문은 식물 바이러스의 주요 전파 경로를 검토하고, 최근 주목받고 있는 환경수에 의한 전파 과정을 논의한다.',
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    readAt: '2024.10.16.00:00',
    isBookmarked: false,
  },
  {
    id: '2',
    source: '2024한국정보과학회 논문지',
    date: '2024.10.16',
    title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
    authors: ['홍길동', '김철수', '이영희', '박민수'],
    abstract: '식물바이러스는 다양한 경로를 통해 전파되며, 이는 작물 생산성과 생태계 건강에 심각한 영향을 미친다. 본 논문은 식물 바이러스의 주요 전파 경로를 검토하고, 최근 주목받고 있는 환경수에 의한 전파 과정을 논의한다.',
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    readAt: '2024.10.16.00:00',
    isBookmarked: false,
  },
  {
    id: '3',
    source: '2024한국정보과학회 논문지',
    date: '2024.10.16',
    title: '1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템',
    authors: ['홍길동', '김철수', '이영희', '박민수'],
    abstract: '식물바이러스는 다양한 경로를 통해 전파되며, 이는 작물 생산성과 생태계 건강에 심각한 영향을 미친다. 본 논문은 식물 바이러스의 주요 전파 경로를 검토하고, 최근 주목받고 있는 환경수에 의한 전파 과정을 논의한다.',
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    readAt: '2024.10.16.00:00',
    isBookmarked: false,
  },
];

const PaperListPanel = ({
  papers,
  totalCount,
  onResetCondition,
  onBookmark,
  onPaperClick,
}: PaperListPanelProps) => {
  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <Typography sx={totalCountSx}>검색 결과 {totalCount}건</Typography>
        <FilterBar onResetCondition={onResetCondition} />
      </Box>
      <Box sx={paperListSx}>
        {papers.map((paper) => (
          <Box key={paper.id} onClick={() => onPaperClick(paper.id)}>
            <PaperListCard
              paper={paper}
              onBookmark={onBookmark}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export { MOCK_PAPERS };
export default PaperListPanel;