import { Box, Typography, IconButton } from '@mui/material';
import { Trash2, ChevronRight } from 'lucide-react';
import { type RecentSearch } from '../../types/home';

interface RecentSearchCardProps {
  data: RecentSearch;
  onDelete: (id: string) => void;
}

const SearchTypeTag = ({ type }: { type: RecentSearch['searchType'] }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      px: '6.34px',
      borderRadius: '7.39px',
      backgroundColor: 'fill.normal',
    }}
  >
    <Typography
      sx={{
        fontSize: '14px',
        fontWeight: 700,
        lineHeight: '27.46px',
        letterSpacing: '-0.28px',
        color: 'label.strong',
      }}
    >
      {type === 'keyword' ? '키워드' : 'AI 검색'}
    </Typography>
  </Box>
);

const RecentSearchCard = ({ data, onDelete }: RecentSearchCardProps) => {
  const { id, searchType, title, lastPaper, path, keywords } = data;

  return (
    <Box
      sx={{
        padding: '18px 16px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'line.normal',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        cursor: 'pointer',
      }}
    >
      {/* 헤더: 태그 + 제목 + 삭제 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SearchTypeTag type={searchType} />
        <Typography
          sx={{
            flex: 1,
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 'normal',
            color: 'label.strong',
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onDelete(id);
          }}
          sx={{
            width: '37px',
            height: '36px',
            borderRadius: '12px',
            backgroundColor: 'background.paper',
            flexShrink: 0,
            '&:hover': { backgroundColor: 'fill.normal' },
          }}
        >
          <Trash2 size={24} color="#A4A7B2" />
        </IconButton>
      </Box>

      {/* 마지막 논문 */}
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '26px',
          letterSpacing: '-0.32px',
          color: 'label.strong',
        }}
      >
        마지막 논문 : {lastPaper}
      </Typography>

      {/* 탐색 경로 (키워드 검색) */}
      {searchType === 'keyword' && path && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {path.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '26px',
                  letterSpacing: '-0.32px',
                  color: 'label.strong',
                }}
              >
                {item.label}
              </Typography>
              {index < path.length - 1 && (
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '5px',
                    backgroundColor: 'line.normal',
                  }}
                >
                  <ChevronRight size={20} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* 키워드 태그 (AI 검색) */}
      {searchType === 'ai' && keywords && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {keywords.map((keyword, index) => (
            <Box
              key={index}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: '6.34px',
                borderRadius: '7.39px',
                backgroundColor: 'fill.normal',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: '27.46px',
                  letterSpacing: '-0.28px',
                  color: 'label.strong',
                }}
              >
                {keyword}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentSearchCard;