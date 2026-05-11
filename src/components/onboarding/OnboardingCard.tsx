import { type ReactNode } from 'react';
import { Box } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';

interface OnboardingCardProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const OnboardingCard = ({ children, sx }: OnboardingCardProps) => {
  return (
    <Box
      sx={{
        width: '503px',
        height: '440px',
        padding: '27px',
        borderRadius: '20px',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default OnboardingCard;