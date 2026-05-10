import { type ReactNode } from 'react';
import { Box } from '@mui/material';
import Header from './Header';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.paper' }}>
      <Header />
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;