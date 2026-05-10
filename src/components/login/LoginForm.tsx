import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { type SxProps, type Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LoginErrorBanner, { type LoginErrorType } from './LoginErrorBanner';

// ---- Zod 스키마 ----
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아니에요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ---- Styles ----
const formWrapSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minWidth: 381,
  gap: '8px',
};

const socialButtonSx: SxProps<Theme> = {
  width: '100%',
  height: 51,
  borderRadius: '12px',
  backgroundColor: 'fill.strong',
  color: 'label.normal',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '160%',
  letterSpacing: '-0.32px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'fill.normal',
    boxShadow: 'none',
  },
};

const dividerWrapSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  my: '6px',
};

const inputSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    height: 51,
    borderRadius: '12px',
    backgroundColor: 'background.default',
    fontSize: '16px',
    fontWeight: 400,
    letterSpacing: '-0.32px',
    '& fieldset': {
      borderColor: 'static.black',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'static.black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'static.black',
      borderWidth: '1px',
    },
  },
  '& input': {
    py: 0,
    px: '20px',
  },
  '& input::placeholder': {
    color: 'label.assistive',
    opacity: 1,
  },
};

const primaryButtonSx: SxProps<Theme> = {
  width: '100%',
  height: 51,
  borderRadius: '12px',
  backgroundColor: 'static.black',
  color: 'static.white',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '160%',
  letterSpacing: '-0.32px',
  mt: '4px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'label.neutral',
    boxShadow: 'none',
  },
};

// ---- Component ----
const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // API 연동 전 UI 확인용 — 연동 시 서버 응답 기반으로 교체
  const [loginError, setLoginError] = useState<LoginErrorType | null>(null);

  const { register, handleSubmit, getValues } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (/* data */) => {
    // TODO: API 연동 시 아래 주석 해제 후 실제 호출로 교체
    // try {
    //   await loginApi(data);
    //   navigate('/home');
    // } catch (error) {
    //   if (isUnregisteredEmail(error)) setLoginError('unregistered_email');
    //   else setLoginError('wrong_password');
    // }

    // UI 확인용 임시 에러 (개발 중 삭제)
    setLoginError('unregistered_email');
  };

  const handleSignup = () => {
    const email = getValues('email');
    // 가입하기 클릭 시 이메일 값 넘겨서 회원가입 페이지로 이동
    navigate('/signup', { state: { email } });
  };

  const handleForgotPassword = () => {
    // TODO: 비밀번호 찾기 페이지 또는 모달 연결
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={formWrapSx}
      noValidate
    >
      {/* 소셜 로그인 */}
      <Button variant="contained" sx={socialButtonSx} disableElevation>
        구글로 계속하기
      </Button>
      <Button variant="contained" sx={socialButtonSx} disableElevation>
        카카오톡으로 계속하기
      </Button>

      {/* 구분선 */}
      <Box sx={dividerWrapSx}>
        <Divider sx={{ flex: 1, borderColor: 'line.normal' }} />
        <Typography
          sx={{
            color: 'label.assistive',
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: '22px',
            letterSpacing: '-0.02em',
          }}
        >
          또는
        </Typography>
        <Divider sx={{ flex: 1, borderColor: 'line.normal' }} />
      </Box>

      {/* 에러 배너 */}
      {loginError !== null && (
        <LoginErrorBanner
          errorType={loginError}
          onSignup={handleSignup}
        />
      )}

      {/* 이메일 입력 */}
      <TextField
        {...register('email')}
        placeholder="이메일 주소"
        type="email"
        autoComplete="email"
        fullWidth
        sx={inputSx}
      />

      {/* 비밀번호 입력 */}
      <TextField
        {...register('password')}
        placeholder="비밀번호"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        fullWidth
        sx={inputSx}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: '8px' }}>
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  size="small"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? (
                    <VisibilityOutlinedIcon sx={{ fontSize: 24, color: 'label.alternative' }} />
                  ) : (
                    <VisibilityOffOutlinedIcon sx={{ fontSize: 24, color: 'label.alternative' }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* 로그인 버튼 */}
      <Button type="submit" variant="contained" sx={primaryButtonSx} disableElevation>
        로그인
      </Button>

      {/* 비밀번호 찾기 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: '1px' }}>
        <Button
          onClick={handleForgotPassword}
          disableRipple
          sx={{
            color: 'label.alternative',
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: '22px',
            letterSpacing: '-0.02em',
            p: 0,
            minWidth: 'auto',
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          비밀번호를 잊으셨나요?
        </Button>
      </Box>

      {/* 새 계정 만들기 */}
      <Button
        onClick={handleSignup}
        variant="contained"
        sx={{ ...primaryButtonSx, mt: '21px' }}
        disableElevation
      >
        새 계정 만들기
      </Button>
    </Box>
  );
};

export default LoginForm;