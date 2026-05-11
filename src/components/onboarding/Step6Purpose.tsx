import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import OnboardingNextButton from './OnboardingNextButton';

const PURPOSE_OPTIONS = ['선택연구 주제 탐색', '랩미팅 발표 준비', '논문 작성 참고', '최신 트렌드 파악', '연구자 탐색'] as const;
type PurposeOption = typeof PURPOSE_OPTIONS[number];

interface Step6PurposeProps {
  value: PurposeOption[];
  onChange: (value: PurposeOption[]) => void;
  onNext: () => void;
}

const Step6Purpose = ({ value, onChange, onNext }: Step6PurposeProps) => {
  const handleToggle = (option: PurposeOption) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Typography variant="body1" sx={{ color: 'label.alternative' }}>
        탐색 목적에 따라 더 정확한 논문 추천이 가능해요
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {PURPOSE_OPTIONS.map((option) => {
          const selected = value.includes(option);
          return (
            <Box
              key={option}
              onClick={() => handleToggle(option)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  border: '1px solid',
                  borderColor: selected ? 'primary.main' : 'line.normal',
                  backgroundColor: selected ? 'primary.main' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {selected && <CheckIcon sx={{ fontSize: 14, color: 'static.white' }} />}
              </Box>
              <Typography variant="body1" sx={{ color: selected ? 'label.strong' : 'label.alternative', fontWeight: 500 }}>
                {option}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <OnboardingNextButton onClick={onNext} disabled={value.length === 0} />
    </Box>
  );
};

export default Step6Purpose;