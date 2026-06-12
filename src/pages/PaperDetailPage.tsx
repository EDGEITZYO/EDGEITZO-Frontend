import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { type SxProps, type Theme } from "@mui/material/styles";
import Header from "../components/layout/Header";
import PaperDetailContent from "../components/common/PaperDetailContent";

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "background.paper",
};

const PaperDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    const returnTo = searchParams.get("returnTo");
    if (returnTo?.startsWith("/")) {
      navigate(returnTo);
      return;
    }
    navigate("/saved");
  };

  const handleRelatedPaperClick = (paperId: string) => {
    navigate(`/papers/${paperId}`);
  };

  if (!id) {
    return null;
  }

  return (
    <Box sx={containerSx}>
      <Header isLoggedIn />
      <Box sx={{ padding: "29px 63px 0 63px" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: "5px", pb: "30px" }}
        >
          <IconButton onClick={handleBack} sx={{ width: 32, height: 32, p: 0 }}>
            <ArrowBackIosNewIcon sx={{ fontSize: 16, color: "static.black" }} />
          </IconButton>
          <Typography
            sx={{ fontSize: "24px", fontWeight: 600, color: "static.black" }}
          >
            논문 상세보기
          </Typography>
        </Box>
      </Box>
      <Box sx={{ padding: "0 63px 80px 63px" }}>
        <PaperDetailContent
          paperId={id}
          onRelatedPaperClick={handleRelatedPaperClick}
        />
      </Box>
    </Box>
  );
};

export default PaperDetailPage;
