import { Button } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type ChatChoice } from '../../types/search';

interface ChoiceButtonProps {
  choice: ChatChoice;
  selected: boolean;
  onClick: (choice: ChatChoice) => void;
}

const getButtonSx = (selected: boolean): SxProps<Theme> => ({
  display: 'inline-flex',
  alignSelf: 'flex-start',
  padding: '11px 25px 12px',
  borderRadius: '20px',
  border: '1px solid',
  borderColor: selected ? 'gray.50' : 'transparent',
  backgroundColor: selected ? '#1B1C23' : '#F6F7F8',
  color: selected ? '#F6F7F8' : '#31333F',
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: '150%',
  textAlign: 'left',
  justifyContent: 'flex-start',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#1B1C23',
    borderColor: 'gray.50',
    color: '#F6F7F8',
  },
});

const ChoiceButton = ({ choice, selected, onClick }: ChoiceButtonProps) => {
  return (
    <Button sx={getButtonSx(selected)} onClick={() => onClick(choice)}>
      {choice.label}
    </Button>
  );
};

export default ChoiceButton;