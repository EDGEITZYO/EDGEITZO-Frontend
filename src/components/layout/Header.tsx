import { Box, AppBar, Toolbar } from '@mui/material';

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'line.normal',
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        <Box
          sx={{
            width: 120,
            height: 32,
            backgroundColor: 'fill.strong',
            borderRadius: 1,
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;