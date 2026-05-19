import { Box, InputBase, Typography } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const containerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  px: '20px',
  py: '15px',
  borderTop: '1px solid',
  borderColor: 'line.normal',
  backgroundColor: 'background.default',
};

const inputWrapperSx: SxProps<Theme> = {
  flex: 1,
  height: 62,
  display: 'flex',
  alignItems: 'center',
  px: '20px',
  borderRadius: '50px',
  border: '1px solid',
  borderColor: '#DADBE2',
  backgroundColor: '#F6F7F8',
};

const sendButtonSx: SxProps<Theme> = {
  width: 66,
  height: 62,
  borderRadius: '40px',
  backgroundColor: '#9195AB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: '#31333F',
  },
};

const ChatInputBar = ({ value, onChange, onSubmit }: ChatInputBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() !== '') {
      onSubmit(value.trim());
    }
  };

  const handleClick = () => {
    if (value.trim() !== '') {
      onSubmit(value.trim());
    }
  };

  return (
    <Box sx={containerSx}>
      <Box sx={inputWrapperSx}>
        <InputBase
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          fullWidth
          sx={{
            fontSize: '18px',
            fontWeight: 400,
            color: 'label.normal',
            lineHeight: '150%',
          }}
        />
      </Box>
      <Box sx={sendButtonSx} onClick={handleClick}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFF',
            lineHeight: 'normal',
          }}
        >
          전송
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatInputBar;