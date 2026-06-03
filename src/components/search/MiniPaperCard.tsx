import { Box, Typography, IconButton } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type MiniPaper, type PaperFeedback } from '../../types/search';

interface MiniPaperCardProps {
  paper: MiniPaper;
  onFeedback: (paperId: string, feedback: PaperFeedback) => void;
}

const containerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '6px',
  alignSelf: 'stretch',
  padding: '0',
};

const metaSx: SxProps<Theme> = {
  fontSize: '12px',
  fontWeight: 500,
  color: '#757A94',
  lineHeight: 'normal',
};

const titleSx: SxProps<Theme> = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#000',
  lineHeight: 'normal',
  alignSelf: 'stretch',
};

const tagSx: SxProps<Theme> = {
  display: 'inline-flex',
  padding: '4px 6.34px',
  borderRadius: '7.394px',
  backgroundColor: '#F6F7F8',
  fontSize: '12px',
  fontWeight: 400,
  color: '#1B1C23',
  lineHeight: '150%',
  letterSpacing: '-0.24px',
};

const feedbackRowSx: SxProps<Theme> = {
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  gap: '6px',
};

const MiniPaperCard = ({ paper, onFeedback }: MiniPaperCardProps) => {
  const { id, source, date, title, tags, feedback } = paper;

  const handleThumbUp = () => {
    onFeedback(id, feedback === 'like' ? null : 'like');
  };

  const handleThumbDown = () => {
    onFeedback(id, feedback === 'dislike' ? null : 'dislike');
  };

  return (
    <Box sx={containerSx}>
      <Typography sx={metaSx}>{source}  {date}</Typography>
      <Typography sx={titleSx}>{title}</Typography>
      <Box sx={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Typography key={tag} sx={tagSx}>
            {tag}
          </Typography>
        ))}
      </Box>
      <Box sx={feedbackRowSx}>
        <IconButton
          onClick={handleThumbUp}
          sx={{ p: 0, width: 24, height: 24, color: feedback === 'like' ? 'primary.main' : 'label.assistive' }}
        >
          <ThumbUpOutlinedIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <IconButton
          onClick={handleThumbDown}
          sx={{ p: 0, width: 24, height: 24, color: feedback === 'dislike' ? 'error.main' : 'label.assistive' }}
        >
          <ThumbDownOutlinedIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MiniPaperCard;