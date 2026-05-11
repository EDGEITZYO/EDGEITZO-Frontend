import { Box, Select, MenuItem, Typography, type SelectChangeEvent } from '@mui/material';
import OnboardingNextButton from './OnboardingNextButton';

const JOB_OPTIONS = ['대학원 진학 준비', '석사과정', '박사과정', '석박통합과정', '교수·연구원', '대학생', '기타'] as const;
type JobOption = typeof JOB_OPTIONS[number];

interface Step4JobProps {
  value: JobOption | null;
  onChange: (value: JobOption) => void;
  onNext: () => void;
}

const Step4Job = ({ value, onChange, onNext }: Step4JobProps) => {
  const handleChange = (e: SelectChangeEvent<JobOption>) => {
    onChange(e.target.value as JobOption);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Typography variant="body1" sx={{ color: 'label.alternative' }}>
        해당 직무에 적합한 맞춤형 추천을 진행해드릴게요
      </Typography>
      <Select
        displayEmpty
        value={value ?? ('' as unknown as JobOption)}
        onChange={handleChange}
        renderValue={(selected) => (selected === ('' as unknown as JobOption) ? '선택하기' : selected)}
        sx={{
          borderRadius: '12px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'static.black' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'static.black' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'static.black' },
        }}
      >
        {JOB_OPTIONS.map((job) => (
          <MenuItem key={job} value={job}>{job}</MenuItem>
        ))}
      </Select>
      <OnboardingNextButton onClick={onNext} disabled={value === null} />
    </Box>
  );
};

export default Step4Job;