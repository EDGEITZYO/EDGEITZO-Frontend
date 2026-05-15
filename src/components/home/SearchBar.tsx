import { Box, InputBase, Button } from '@mui/material';
import { Search, ListTree } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate('/search');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        px: '14.79%',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 300,
          height: '62px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          px: '27px',
          backgroundColor: 'background.default',
          borderRadius: '114px',
        }}
      >
        <Search size={20} color="#A4A7B2" />
        <InputBase
          placeholder="어떤 주제를 탐색하고 싶으세요?"
          onKeyDown={handleKeyDown}
          sx={{
            flex: 1,
            fontSize: '17px',
            fontWeight: 600,
            lineHeight: '29px',
            letterSpacing: '-0.34px',
            '& input::placeholder': {
              color: 'label.assistive',
              opacity: 1,
            },
          }}
        />
      </Box>
      <Button
        variant="contained"
        startIcon={<ListTree size={24} />}
        onClick={() => navigate('/keyword-map')}
        sx={{
          height: '62px',
          px: '17px',
          py: '6px',
          borderRadius: '6px',
          backgroundColor: 'background.default',
          color: 'label.strong',
          whiteSpace: 'nowrap',
          boxShadow: 'none',
          fontSize: '17px',
          fontWeight: 600,
          lineHeight: '29px',
          letterSpacing: '-0.34px',
          '&:hover': {
            backgroundColor: 'fill.normal',
            boxShadow: 'none',
          },
        }}
      >
        내 연구분야 키워드맵 탐색
      </Button>
    </Box>
  );
};

export default SearchBar;