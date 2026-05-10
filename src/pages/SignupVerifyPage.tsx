import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';

const RESEND_COOLDOWN = 30;

const cardSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 503,
  borderRadius: '20px',
  backgroundColor: 'background.default',
  p: '27px',
  gap: '10px',
};

const inputSx: SxProps<Theme> = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: '16px',
    '& fieldset': { borderColor: 'static.black', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: 'static.black' },
    '&.Mui-focused fieldset': { borderColor: 'static.black', borderWidth: '1px' },
  },
  '& .MuiInputLabel-root': { color: 'label.alternative' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'label.alternative' },
};

const SignupVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';

  const [code, setCode] = useState('');
  const [verifyError, setVerifyError] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const handleVerify = () => {
    // TODO: API 연동 시 교체
    // 임시 에러 표시
    // setVerifyError(true);
    navigate('/signup/complete', { state: { type: 'email' } });
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    startCooldown();
    setVerifyError(false);
    // TODO: 재전송 API 호출
  };

  return (
    <AuthLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'background.paper',
          paddingTop: 'max(60px, calc((100vh - 64px - 650px) / 2))',
          paddingBottom: 'max(60px, calc((100vh - 64px - 650px) / 2))',
        }}
      >
        {/* 타이틀 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            maxWidth: 503,
            mb: '24px',
          }}
        >
          <IconButton
            onClick={() => navigate('/signup')}
            size="small"
            aria-label="뒤로가기"
            sx={{ p: 0 }}
          >
            <ChevronLeftIcon sx={{ fontSize: 24, color: 'static.black' }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: '36px',
              letterSpacing: '-0.528px',
              color: 'static.black',
            }}
          >
            이메일 인증해주세요
          </Typography>
        </Box>

        {/* 카드 */}
        <Box sx={cardSx}>
          {/* 일러스트 영역 - 추후 이미지 교체 */}
          <Box
            sx={{
              width: '100%',
              height: 209,
              backgroundColor: 'fill.normal',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'label.assistive', fontSize: '14px' }}>
              일러스트 이미지
            </Typography>
          </Box>

          {/* 이메일 */}
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '30px',
              letterSpacing: '-0.42px',
              color: 'static.black',
              textAlign: 'center',
            }}
          >
            {email}
          </Typography>

          {/* 안내 텍스트 */}
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: '30px',
              letterSpacing: '-0.378px',
              color: 'static.black',
              textAlign: 'center',
            }}
          >
            위의 주소로 전송된 인증코드를 입력해주세요
          </Typography>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: '30px',
              letterSpacing: '-0.378px',
              color: 'static.black',
              textAlign: 'center',
            }}
          >
            인증코드는 15분간 유효해요
          </Typography>

          {/* 인증코드 입력 */}
          <TextField
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCode(e.target.value);
              setVerifyError(false);
            }}
            placeholder="인증 코드 입력"
            fullWidth
            sx={inputSx}
          />

          {/* 에러 배너 */}
          {verifyError && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: 51,
                px: '11px',
                borderRadius: '12px',
                backgroundColor: 'status.negative',
                gap: '8px',
              }}
            >
              <InfoOutlinedIcon sx={{ color: 'static.white', fontSize: 24, flexShrink: 0 }} />
              <Typography
                sx={{
                  color: 'static.white',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '160%',
                  letterSpacing: '-0.32px',
                }}
              >
                인증 코드가 일치하지 않아요. 다시 입력해주세요.
              </Typography>
            </Box>
          )}

          {/* 인증하기 버튼 */}
          <Button
            onClick={handleVerify}
            variant="contained"
            fullWidth
            disableElevation
            sx={{
              height: 51,
              borderRadius: '12px',
              backgroundColor: 'static.black',
              color: 'static.white',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '-0.32px',
              boxShadow: 'none',
              '&:hover': { backgroundColor: 'label.neutral', boxShadow: 'none' },
            }}
          >
            이메일 주소 인증하기
          </Button>

          {/* 다시 전송하기 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: '30px',
                letterSpacing: '-0.378px',
                color: 'static.black',
              }}
            >
              코드를 받지 못하셨나요?
            </Typography>
            <Button
              onClick={handleResend}
              disableRipple
              disabled={cooldown > 0}
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: '30px',
                letterSpacing: '-0.378px',
                color: cooldown > 0 ? 'label.assistive' : 'static.black',
                textDecoration: 'underline',
                p: 0,
                minWidth: 'auto',
                '&:hover': { backgroundColor: 'transparent' },
                '&.Mui-disabled': {
                  color: 'label.assistive',
                },
              }}
            >
              다시 전송하기{cooldown > 0 ? ` (${cooldown}s)` : ''}
            </Button>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignupVerifyPage;