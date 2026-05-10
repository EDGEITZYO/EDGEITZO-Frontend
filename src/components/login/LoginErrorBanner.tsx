import { type ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { type SxProps, type Theme } from '@mui/material/styles';

export type LoginErrorType = 'unregistered_email' | 'wrong_password';

interface LoginErrorBannerProps {
  errorType: LoginErrorType;
  onSignup?: () => void;
}

const bannerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: 51,
  px: '12.5px',
  borderRadius: '12px',
  backgroundColor: 'status.negative',
};

const iconWrapSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
};

const messageSx: SxProps<Theme> = {
  flex: 1,
  ml: '7px',
  color: 'static.white',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '160%',
  letterSpacing: '-0.32px',
};

const ERROR_MESSAGE: Record<LoginErrorType, ReactNode> = {
  unregistered_email: '가입되지 않은 이메일 계정이에요',
  wrong_password: '비밀번호가 일치하지 않아요',
};

const LoginErrorBanner = ({ errorType, onSignup }: LoginErrorBannerProps) => {
  return (
    <Box sx={bannerSx}>
      <Box sx={iconWrapSx}>
        <InfoOutlinedIcon sx={{ color: 'static.white', fontSize: 24 }} />
      </Box>
      <Typography sx={messageSx}>
        {ERROR_MESSAGE[errorType]}
      </Typography>
      {errorType === 'unregistered_email' && (
        <Button
          onClick={onSignup}
          disableRipple
          sx={{
            color: 'static.white',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '160%',
            letterSpacing: '-0.32px',
            textDecoration: 'underline',
            minWidth: 'auto',
            p: 0,
            ml: '20px',
            flexShrink: 0,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          가입하기
        </Button>
      )}
    </Box>
  );
};

export default LoginErrorBanner;