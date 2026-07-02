import { type ReactNode } from "react";
import { Box } from "@mui/material";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      {children}
    </Box>
  );
};

export default AuthLayout;
