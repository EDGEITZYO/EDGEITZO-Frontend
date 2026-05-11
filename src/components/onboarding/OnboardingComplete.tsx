import { Box, Typography } from '@mui/material';
import OnboardingNextButton from './OnboardingNextButton';

interface OnboardingCompleteProps {
  onStart: () => void;
}

const OnboardingComplete = ({ onStart }: OnboardingCompleteProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
          탐색을 위한 모든 준비가 끝났어요
        </Typography>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
          이제 본격적으로 시작해볼까요?
        </Typography>
        <Typography variant="body1" sx={{ color: 'label.alternative' }}>
          입력하신 정보는 마이페이지에서 언제든 수정할 수 있어요
        </Typography>
        {/* 일러스트 자리 */}
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mt: 2 }}>
          뭔가 그 바이옴 나타내는? 바이옴 에이전트 일러스트 들어가면 좋을 듯!
        </Typography>
      </Box>
      <OnboardingNextButton label="시작하기" onClick={onStart} />
    </Box>
  );
};

export default OnboardingComplete;