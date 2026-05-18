import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { type SxProps, type Theme } from '@mui/material/styles';

interface SearchHeaderProps {
  title: string;
  onBack: () => void;
}

const toolbarSx: SxProps<Theme> = {
  px: '20px',
  height: 64,
  minHeight: '64px !important',
  gap: '14px',
  borderBottom: '1px solid #CBCDD7',
};

const SearchHeader = ({ title, onBack }: SearchHeaderProps) => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.default' }}>
      <Toolbar sx={toolbarSx}>
        <IconButton onClick={onBack} sx={{ p: 0, width: 36, height: 36 }}>
          <ArrowBackIosNewIcon sx={{ fontSize: 20, color: 'static.black' }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'static.black',
            lineHeight: 'normal',
          }}
        >
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default SearchHeader;