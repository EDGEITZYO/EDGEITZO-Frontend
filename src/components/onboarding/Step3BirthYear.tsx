import { Box, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import OnboardingNextButton from './OnboardingNextButton';

const BIRTH_YEARS = Array.from({ length: new Date().getFullYear() - 1920 + 1 }, (_, i) => 1920 + i).reverse();

interface Step3BirthYearProps {
  value: number | null;
  onChange: (value: number) => void;
  onNext: () => void;
}

const Step3BirthYear = ({ value, onChange, onNext }: Step3BirthYearProps) => {
  const handleChange = (e: SelectChangeEvent<number>) => {
    onChange(e.target.value as number);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Select
        displayEmpty
        value={value ?? ('' as unknown as number)}
        onChange={handleChange}
        renderValue={(selected) => (selected === ('' as unknown as number) ? '선택하기' : `${selected}년`)}
        sx={{
          borderRadius: '12px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'static.black' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'static.black' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'static.black' },
        }}
      >
        {BIRTH_YEARS.map((year) => (
          <MenuItem key={year} value={year}>{year}년</MenuItem>
        ))}
      </Select>
      <OnboardingNextButton onClick={onNext} disabled={value === null} />
    </Box>
  );
};

export default Step3BirthYear;