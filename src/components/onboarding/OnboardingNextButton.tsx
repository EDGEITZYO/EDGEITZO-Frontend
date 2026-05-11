import { Button, type ButtonProps } from '@mui/material';

interface OnboardingNextButtonProps extends Pick<ButtonProps, 'onClick' | 'disabled'> {
  label?: string;
}

const OnboardingNextButton = ({ onClick, disabled, label = '다음' }: OnboardingNextButtonProps) => {
  return (
    <Button
      fullWidth
      onClick={onClick}
      disabled={disabled}
      sx={{
        height: '51px',
        borderRadius: '12px',
        backgroundColor: 'static.black',
        color: 'static.white',
        typography: 'body1',
        fontWeight: 500,
        '&:hover': {
          backgroundColor: 'label.neutral',
        },
        '&.Mui-disabled': {
          backgroundColor: 'fill.strong',
          color: 'label.disable',
        },
      }}
    >
      {label}
    </Button>
  );
};

export default OnboardingNextButton;