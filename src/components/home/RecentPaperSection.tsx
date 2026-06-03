import { Box, Typography, IconButton } from '@mui/material';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecentPaperCard from './RecentPaperCard';
import { type RecentPaper } from '../../types/home';

// 나중에 API 연동 시 제거
const MOCK_DATA: RecentPaper[] = [
  {
    id: '1',
    source: '2024한국분자세포생물학회 논문지',
    date: '2024.03.12',
    title: '미토콘드리아 막전위 손실이 세포 노화에 미치는 영향',
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    readAt: '2024.10.16.00:00',
    paperType: '학위논문',
  },
  {
    id: '2',
    source: '2023한국생화학분자생물학회',
    date: '2023.11.05',
    title: '노화 세포의 SASP 분비 기전 및 조절 전략',
    keywords: ['논문 키워드', '논문 키워드'],
    kciType: 'KCI O',
    citationCount: 0,
    readAt: '2024.10.16.00:00',
    paperType: '학술저널',
  },
];

const RecentPaperSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '11px', flex: 1 }}>
      {/* 타이틀 + + 버튼 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" sx={{ color: 'label.strong' }}>
          최근 확인한 논문
        </Typography>
        <IconButton
          onClick={() => navigate('/saved?tab=recent')}
          sx={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            backgroundColor: 'background.default',
            p: '6px',
            '&:hover': { backgroundColor: 'fill.normal' },
          }}
        >
          <Plus size={24} />
        </IconButton>
      </Box>

      {/* 카드 리스트 or 빈 상태 */}
      {MOCK_DATA.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1" sx={{ color: 'label.assistive' }}>
            최근 확인한 논문이 없어요
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {MOCK_DATA.map((paper) => (
            <RecentPaperCard key={paper.id} data={paper} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentPaperSection;