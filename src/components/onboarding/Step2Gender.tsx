import { Box } from '@mui/material';
import OnboardingNextButton from './OnboardingNextButton';

const GENDER_OPTIONS = ['여성', '남성', '선택 안함'] as const;
type GenderOption = typeof GENDER_OPTIONS[number];

interface Step2GenderProps {
  value: GenderOption | null;
  onChange: (value: GenderOption) => void;
  onNext: () => void;
}

const Step2Gender = ({ value, onChange, onNext }: Step2GenderProps) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        {GENDER_OPTIONS.map((option) => (
          <Box
            key={option}
            onClick={() => onChange(option)}
            sx={{
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: value === option ? 'static.black' : 'line.normal',
              backgroundColor: value === option ? 'static.black' : 'transparent',
              color: value === option ? 'static.white' : 'label.normal',
              typography: 'body1',
              fontWeight: 500,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {option}
          </Box>
        ))}
      </Box>
      <OnboardingNextButton onClick={onNext} disabled={value === null} />
    </Box>
  );
};

export default Step2Gender;