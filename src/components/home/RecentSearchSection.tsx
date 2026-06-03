import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import RecentSearchCard from './RecentSearchCard';
import { type RecentSearch, type SearchType } from '../../types/home';

type TabType = 'all' | SearchType;

const TABS: { label: string; value: TabType }[] = [
  { label: '전체', value: 'all' },
  { label: '키워드 검색', value: 'keyword' },
  { label: 'AI 검색', value: 'ai' },
];

// 나중에 API 연동 시 제거
const MOCK_DATA: RecentSearch[] = [
  {
    id: '1',
    searchType: 'keyword',
    title: '세포 노화와 미토콘드리아 기능 저하',
    lastPaper: 'Mitochondrial dysfunction in cellular senescence',
    path: [
      { label: '세포 노화' },
      { label: '미토콘드리아' },
      { label: 'ROS 축적' },
    ],
  },
  {
    id: '2',
    searchType: 'ai',
    title: 'Senescence-associated secretory phenotype in aging',
    lastPaper: '분자생물학 내 세포 노화 연구 흐름',
    keywords: ['추천 검색 키워드', '추천 검색 키워드', '추천 검색 키워드'],
  },
];

const RecentSearchSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searches, setSearches] = useState<RecentSearch[]>(MOCK_DATA);

  const filtered = searches
    .filter((s) => activeTab === 'all' || s.searchType === activeTab)
    .slice(0, 2);

  const handleDelete = (id: string) => {
    setSearches((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '11px', flex: 1 }}>
      {/* 타이틀 */}
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: '30px',
          letterSpacing: '-0.36px',
          color: 'label.strong',
        }}
      >
        최근 탐색 이어하기
      </Typography>

      {/* 탭 */}
      <Box sx={{ display: 'flex', gap: '6px' }}>
        {TABS.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: activeTab === tab.value ? '13px' : '16px',
              py: '5px',
              borderRadius: '7px',
              backgroundColor: activeTab === tab.value ? 'label.neutral' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <Typography
              sx={{
                fontSize: '17px',
                fontWeight: 600,
                lineHeight: '29px',
                letterSpacing: '-0.34px',
                color: activeTab === tab.value ? 'static.white' : 'label.strong',
              }}
            >
              {tab.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 카드 리스트 or 빈 상태 */}
      {filtered.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'label.assistive',
            }}
          >
            최근 탐색 이력이 없어요
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {filtered.map((search) => (
            <RecentSearchCard key={search.id} data={search} onDelete={handleDelete} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentSearchSection;