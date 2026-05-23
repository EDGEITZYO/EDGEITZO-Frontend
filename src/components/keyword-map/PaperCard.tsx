import { Box, Typography, Chip } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type KeywordPaper } from '../../types/keywordMap';

interface PaperCardProps {
  paper: KeywordPaper;
  onClick: (paperId: string) => void;
  onBookmark: (paperId: string) => void;
}

const cardSx: SxProps<Theme> = {
  padding: '18px 16px',
  borderBottom: '1px solid',
  borderColor: 'line.normal',
  backgroundColor: 'background.default',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  flexShrink: 0,
  alignSelf: 'stretch',
  '&:hover': {
    backgroundColor: 'background.paper',
  },
};

const PaperCard = ({ paper, onClick, onBookmark }: PaperCardProps) => {
  const handleBookmarkClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onBookmark(paper.id);
  };

  return (
    <Box sx={cardSx} onClick={() => onClick(paper.id)}>
      {/* 출처 + 날짜 + 북마크 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'label.alternative',
            letterSpacing: '-0.26px',
          }}
        >
          {paper.source} {paper.date}
        </Typography>
        {paper.isBookmarked ? (
          <BookmarkIcon
            onClick={handleBookmarkClick}
            sx={{ fontSize: '24px', color: 'primary.main', cursor: 'pointer' }}
          />
        ) : (
          <BookmarkBorderIcon
            onClick={handleBookmarkClick}
            sx={{ fontSize: '24px', color: 'label.assistive', cursor: 'pointer' }}
          />
        )}
      </Box>

      {/* 제목 */}
      <Typography
        sx={{
          fontSize: '17px',
          fontWeight: 600,
          color: 'label.strong',
          letterSpacing: '-0.34px',
          lineHeight: '29px',
        }}
      >
        {paper.title}
      </Typography>

      {/* 저자 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'label.alternative',
            letterSpacing: '-0.26px',
          }}
        >
          {paper.authors[0]}
          {paper.authors.length > 1 ? ` 외 ${paper.authors.length - 1}인` : ''}
        </Typography>
        <ExpandMoreIcon sx={{ fontSize: '16px', color: 'label.assistive' }} />
      </Box>

      {/* 키워드 */}
      <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                fontSize: '12px',
                fontWeight: 400,
                color: 'label.alternative',
              }}
            >
              {keyword}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* KCI + 인용수 */}
      <Box sx={{ display: 'flex', gap: '6px' }}>
        <Chip
          label={paper.kciType}
          size="small"
          sx={{
            backgroundColor: 'static.black',
            color: 'static.white',
            fontSize: '12px',
            fontWeight: 600,
            height: '24px',
            borderRadius: '12px',
          }}
        />
        <Chip
          label={`인용수 ${paper.citationCount}`}
          size="small"
          sx={{
            backgroundColor: 'static.black',
            color: 'static.white',
            fontSize: '12px',
            fontWeight: 600,
            height: '24px',
            borderRadius: '12px',
          }}
        />
      </Box>
    </Box>
  );
};

export default PaperCard;