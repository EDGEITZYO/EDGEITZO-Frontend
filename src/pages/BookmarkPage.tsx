import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Sidebar from "../components/layout/Sidebar";
import BookmarkContent from "../components/saved/BookmarkContent";

const BookmarkPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        {/* 모바일 헤더 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            px: "16px",
            py: "16px",
          }}
        >
          <ArrowBackIosNewIcon
            onClick={() => navigate("/home")}
            sx={{ fontSize: 16, color: "label.normal", cursor: "pointer" }}
          />
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "29px",
              letterSpacing: "-0.378px",
              color: "label.normal",
            }}
          >
            북마크한 논문
          </Typography>
        </Box>
        <BookmarkContent />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.paper" }}>
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pt: "170px",
          pb: "64px",
        }}
      >
        <BookmarkContent />
      </Box>
    </Box>
  );
};

export default BookmarkPage;
