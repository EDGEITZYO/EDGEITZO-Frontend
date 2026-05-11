import { Box, TextField, Typography } from '@mui/material';
import OnboardingNextButton from './OnboardingNextButton';

interface Step5ResearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const Step5ResearchField = ({ value, onChange, onNext }: Step5ResearchFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Typography variant="body1" sx={{ color: 'label.alternative' }}>
        간단하게 입력해주세요
      </Typography>
      <TextField
        placeholder="예) 미생물 연구"
        value={value}
        onChange={handleChange}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': { borderColor: 'static.black' },
            '&:hover fieldset': { borderColor: 'static.black' },
            '&.Mui-focused fieldset': { borderColor: 'static.black' },
          },
        }}
      />
      <OnboardingNextButton onClick={onNext} disabled={!value.trim()} />
    </Box>
  );
};

export default Step5ResearchField;