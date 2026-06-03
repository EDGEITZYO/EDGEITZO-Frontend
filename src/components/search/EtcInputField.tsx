import { Box, InputBase, IconButton } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';

interface EtcInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const containerSx: SxProps<Theme> = {
  display: 'inline-flex',
  padding: '6px 8px 6px 20px',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '59px',
  borderRadius: '17px',
  border: '1px solid #AEB1C1',
};

const sendButtonSx: SxProps<Theme> = {
  width: 48,
  height: 38,
  borderRadius: '12px',
  backgroundColor: '#31333F',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: '#474A55',
  },
  '& svg': {
    width: 24,
    height: 24,
    color: '#FFF',
  },
};

const EtcInputField = ({ value, onChange, onSubmit }: EtcInputFieldProps) => {
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
      <InputBase
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="어떤 방식인지 입력해주세요"
        sx={{
          flex: 1,
          fontSize: '18px',
          fontWeight: 400,
          color: 'label.normal',
          lineHeight: '150%',
          '& input::placeholder': {
            color: '#757A94',
            opacity: 1,
          },
        }}
      />
      <IconButton onClick={handleClick} sx={sendButtonSx} disableRipple>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 19V5M12 5L5 12M12 5L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </IconButton>
    </Box>
  );
};

export default EtcInputField;