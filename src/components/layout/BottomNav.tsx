import { Box, IconButton } from '@mui/material';
import { Home, LayoutPanelLeft, FolderOpen, CircleUserRound } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: Home, path: '/home' },
  { icon: LayoutPanelLeft, path: '/search' },
  { icon: FolderOpen, path: '/saved' },
  { icon: CircleUserRound, path: '/mypage' },
] as const;

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '3.42%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '27.54px',
        px: '24.1px',
        py: '10.33px',
        backgroundColor: 'background.default',
        borderRadius: '293.755px',
      }}
    >
      {NAV_ITEMS.map(({ icon: Icon, path }) => (
        <IconButton
          key={path}
          onClick={() => navigate(path)}
          sx={{
            p: 0,
            color: pathname === path ? 'text.primary' : 'text.disabled',
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          <Icon size={20} />
        </IconButton>
      ))}
    </Box>
  );
};

export default BottomNav;