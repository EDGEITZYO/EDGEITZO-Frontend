import { Box, Typography, CircularProgress } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type ChatMessage as ChatMessageType } from '../../types/search';

interface ChatMessageProps {
  message: ChatMessageType;
}

const aiTextSx: SxProps<Theme> = {
  fontSize: '18px',
  fontWeight: 400,
  color: 'label.alternative',
  lineHeight: '150%',
};

const userBubbleSx: SxProps<Theme> = {
  display: 'inline-flex',
  height: '60px',
  alignItems: 'center',
  px: '28px',
  borderRadius: '20px',
  border: '1px solid #CBCDD7',
  backgroundColor: '#FFF',
};

const userTextSx: SxProps<Theme> = {
  fontSize: '18px',
  fontWeight: 500,
  color: 'label.alternative',
  lineHeight: 'normal',
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { role, content, isLoading } = message;

  if (role === 'ai') {
    return (
      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* AI 아바타 */}
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#DADBE2',
            flexShrink: 0,
          }}
        />
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', height: 60 }}>
            <CircularProgress size={24} sx={{ color: 'label.assistive' }} />
          </Box>
        ) : (
          <Typography sx={aiTextSx}>{content}</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box sx={userBubbleSx}>
        <Typography sx={userTextSx}>{content}</Typography>
      </Box>
    </Box>
  );
};

export default ChatMessage;