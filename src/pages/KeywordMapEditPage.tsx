import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { type SxProps, type Theme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Header from '../components/layout/Header';
import { useKeywordMapActions } from '../stores/keywordMapStore';

const containerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: 'background.paper',
};

const contentSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const titleRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  alignSelf: 'flex-start',
  mb: '27px',
};

const cardSx: SxProps<Theme> = {
  width: '503px',
  borderRadius: '20px',
  backgroundColor: 'background.default',
  padding: '27px',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
};

const inputSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 500,
  },
};

const buttonSx: SxProps<Theme> = {
  height: '52px',
  borderRadius: '12px',
  backgroundColor: 'primary.main',
  color: 'static.white',
  fontSize: '18px',
  fontWeight: 500,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'primary.dark',
    boxShadow: 'none',
  },
};

const KeywordMapEditPage = () => {
  const navigate = useNavigate();
  const { setResearchField } = useKeywordMapActions();
  const [inputValue, setInputValue] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handleGenerate = () => {
    if (!inputValue.trim()) return;
    setResearchField(inputValue.trim());
    navigate('/keyword-map');
  };

  return (
    <Box sx={containerSx}>
      <Header isLoggedIn />
      <Box sx={contentSx}>
        <Box sx={{ width: '503px' }}>
          <Box sx={titleRowSx}>
            <ChevronLeftIcon
              onClick={handleBack}
              sx={{ cursor: 'pointer', fontSize: '32px' }}
            />
            <Typography
              sx={{
                fontSize: '24px',
                fontWeight: 600,
                letterSpacing: '-0.528px',
                color: 'static.black',
              }}
            >
              연구 분야는 어디이신가요?
            </Typography>
          </Box>
          <Box sx={cardSx}>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: 'static.black',
              }}
            >
              간단하게 입력해주세요
            </Typography>
            <TextField
              fullWidth
              placeholder="세포 노화"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') handleGenerate();
              }}
              sx={inputSx}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerate}
              disabled={!inputValue.trim()}
              sx={buttonSx}
            >
              키워드맵 생성하기
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KeywordMapEditPage;