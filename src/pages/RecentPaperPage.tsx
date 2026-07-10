import { Box, Typography, useMediaQuery, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Sidebar from "../components/layout/Sidebar";
import RecentPaperContent from "../components/saved/RecentPaperContent";

const RecentPaperPage = () => {
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
          <IconButton
            sx={{ p: 0, width: "28px", height: "28px" }}
            onClick={() => navigate("/home")}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 16, color: "label.normal" }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "29px",
              letterSpacing: "-0.378px",
              color: "label.normal",
            }}
          >
            최근 읽은 논문
          </Typography>
        </Box>
        <RecentPaperContent />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.paper",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: { lg: "center", sm: "stretch" },
          paddingLeft: { lg: "120px", sm: "64px", xs: "0px" },
          paddingRight: { lg: "120px", sm: "64px", xs: "0px" },
          paddingTop: { lg: "0px", sm: "86px", xs: "0px" },
          minWidth: 0,
        }}
      >
        <RecentPaperContent />
      </Box>
    </Box>
  );
};

export default RecentPaperPage;
