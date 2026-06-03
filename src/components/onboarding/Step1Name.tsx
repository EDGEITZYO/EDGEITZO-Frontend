import { useState } from 'react';
import { Box, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import OnboardingNextButton from './OnboardingNextButton';

interface Step1NameProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const validateName = (value: string): string | null => {
  if (/[^a-zA-Z0-9가-힣]/.test(value)) return '특수문자는 사용할 수 없어요';
  return null;
};

const Step1Name = ({ value, onChange, onNext }: Step1NameProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (next.length > 10) return;
    onChange(next);
    setError(validateName(next));
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  const handleNext = () => {
    const validationError = validateName(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    onNext();
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          placeholder="이름"
          value={value}
          onChange={handleChange}
          error={!!error}
          fullWidth
          slotProps={{
            input: {
              endAdornment: value ? (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear} size="small" edge="end">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': { borderColor: 'static.black' },
              '&:hover fieldset': { borderColor: 'static.black' },
              '&.Mui-focused fieldset': { borderColor: 'static.black' },
              '&.Mui-error fieldset': { borderColor: 'status.negative' },
            },
          }}
        />
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" sx={{ color: 'status.negative', fontWeight: 500 }}>
              {error}
            </Typography>
            <Typography variant="body1" sx={{ color: 'status.negative', fontWeight: 500 }}>
              {value.length}/10
            </Typography>
          </Box>
        )}
      </Box>
      <OnboardingNextButton onClick={handleNext} disabled={!value} />
    </Box>
  );
};

export default Step1Name;