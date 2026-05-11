import { Box, Typography, IconButton } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import SignupForm from "../components/signup/SignupForm";

const titleSx: SxProps<Theme> = {
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: "36px",
  letterSpacing: "-0.528px",
  color: "static.black",
};

const cardSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 503,
  borderRadius: "20px",
  backgroundColor: "background.default",
  px: "20px",
  py: "20px",
};

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "background.paper",
          paddingTop: "calc(13.854 / 100 * (100vh - 64px))",
          paddingBottom: "calc(36.979 / 100 * (100vh - 64px))",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            maxWidth: 503,
            mb: "24px",
          }}
        >
          <IconButton
            onClick={() => navigate("/login")}
            size="small"
            aria-label="뒤로가기"
            sx={{ p: 0 }}
          >
            <ChevronLeftIcon sx={{ fontSize: 24, color: "static.black" }} />
          </IconButton>
          <Typography sx={titleSx}>계정을 생성해요</Typography>
        </Box>
        <Box sx={cardSx}>
          <SignupForm />
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignupPage;
