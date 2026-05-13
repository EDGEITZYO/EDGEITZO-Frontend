import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface HeaderProps {
  isLoggedIn?: boolean;
}

const Header = ({ isLoggedIn = false }: HeaderProps) => {
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
      <Toolbar sx={{ px: 3, height: 64, minHeight: '64px !important', justifyContent: 'space-between' }}>
        <Box
          sx={{
            width: 120,
            height: 32,
            backgroundColor: 'fill.strong',
            borderRadius: 1,
          }}
        />
        {isLoggedIn && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircleIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.primary">
              홍길동님
            </Typography>
            <Button variant="text" size="small" sx={{ color: 'text.secondary' }}>
              로그아웃
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;