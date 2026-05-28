import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type RecentPaper } from '../../types/saved';

interface ChartPaperCardProps {
  paper: RecentPaper;
  onClick: (paperId: string) => void;
}

const containerSx: SxProps<Theme> = {
  width: '100%',
  padding: '13.72px',
  borderRadius: '10px',
  border: '0.86px solid',
  borderColor: 'line.normal',
  backgroundColor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  cursor: 'pointer',
  '&:hover': { backgroundColor: 'background.paper' },
};

const metaSx: SxProps<Theme> = {
  fontSize: '12px',
  fontWeight: 400,
  color: 'label.assistive',
  lineHeight: 'normal',
};

const titleSx: SxProps<Theme> = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'static.black',
  lineHeight: '150%',
};

const authorSx: SxProps<Theme> = {
  fontSize: '12px',
  fontWeight: 400,
  color: 'label.normal',
  lineHeight: 'normal',
};

const keywordTagSx: SxProps<Theme> = {
  display: 'inline-flex',
  padding: '0 6px',
  borderRadius: '7px',
  backgroundColor: 'fill.normal',
  fontSize: '12px',
  fontWeight: 400,
  color: 'label.alternative',
};

const badgeSx: SxProps<Theme> = {
  display: 'inline-flex',
  padding: '4px 12px',
  borderRadius: '6px',
  backgroundColor: 'static.black',
  fontSize: '12px',
  fontWeight: 400,
  color: 'static.white',
  lineHeight: 'normal',
  cursor: 'pointer',
  gap: '2px',
  alignItems: 'center',
};

const ChartPaperCard = ({ paper, onClick }: ChartPaperCardProps) => {
  const [authorExpanded, setAuthorExpanded] = useState(false);
  const { id, source, date, title, authors, keywords } = paper;

  return (
    <Box sx={containerSx} onClick={() => onClick(id)}>
      {/* 출처/날짜 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography sx={metaSx}>{source}</Typography>
        <Typography sx={metaSx}>{date}</Typography>
      </Box>

      {/* 제목 */}
      <Typography sx={titleSx}>{title}</Typography>

      {/* 저자 */}
      <Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: authors.length > 1 ? 'pointer' : 'default' }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            if (authors.length > 1) setAuthorExpanded((prev) => !prev);
          }}
        >
          <Typography sx={authorSx}>
            {authors.length > 1 ? `${authors[0]} 외 ${authors.length - 1}인` : authors[0]}
          </Typography>
          {authors.length > 1 && (
            authorExpanded
              ? <KeyboardArrowUpIcon sx={{ fontSize: 12, color: 'label.normal' }} />
              : <KeyboardArrowDownIcon sx={{ fontSize: 12, color: 'label.normal' }} />
          )}
        </Box>
        {authorExpanded && (
          <Typography sx={{ ...authorSx, color: 'label.assistive', mt: '4px' }}>
            {authors.join(', ')}
          </Typography>
        )}
      </Box>

      {/* 키워드 태그 */}
      <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {keywords.map((kw, index) => (
          <Typography key={`${kw}-${index}`} sx={keywordTagSx}>{kw}</Typography>
        ))}
      </Box>

      {/* 배지 */}
      <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        <Box sx={badgeSx}>
          <Typography sx={{ fontSize: '12px', color: 'static.white' }}>DOI</Typography>
          <Typography sx={{ fontSize: '10px', color: 'static.white' }}>↗</Typography>
        </Box>
        <Box sx={badgeSx}>
          <Typography sx={{ fontSize: '12px', color: 'static.white' }}>KCI</Typography>
        </Box>
        <Box sx={badgeSx}>
          <Typography sx={{ fontSize: '12px', color: 'static.white' }}>ORCID</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChartPaperCard;