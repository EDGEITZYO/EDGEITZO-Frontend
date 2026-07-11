import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TopNavBar from "../components/layout/TopNavBar";
import PaperDetailContent from "../components/common/PaperDetailContent";

const PaperDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleBack = () => {
    const returnTo = searchParams.get("returnTo");
    if (returnTo?.startsWith("/")) {
      navigate(returnTo);
      return;
    }
    navigate(-1);
  };

  const handleRelatedPaperClick = (paperId: string) => {
    navigate(`/papers/${paperId}`);
  };

  if (!id) return null;

  return (
    <Box
      sx={{
        display: "flex",
        padding: "12px",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        minHeight: "100vh",
        backgroundColor: "background.paper",
        boxSizing: "border-box",
      }}
    >
      {/* 데스크탑/태블릿: TopNavBar */}
      {!isMobile && <TopNavBar onBack={handleBack} title="논문 상세보기" />}

      {/* 모바일: 별도 헤더 */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            padding: "16px",
            alignItems: "center",
            gap: "8px",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "28px",
              height: "28px",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <IconButton onClick={handleBack} sx={{ p: 0 }}>
              <CloseIcon sx={{ width: "23.188px", height: "23.188px" }} />
            </IconButton>
          </Box>
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "label.normal",
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "29px",
              letterSpacing: "-0.378px",
            }}
          >
            논문 상세보기
          </Typography>
        </Box>
      )}

      {/* 콘텐츠 박스 */}
      <Box
        sx={{
          display: "flex",
          padding: "32px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "32px",
          flex: "1 0 0",
          alignSelf: "stretch",
          borderRadius: "8px",
          backgroundColor: "background.default",
          // TopNavBar가 fixed이므로 데스크탑/태블릿에서 상단 여백 필요
          ...(!isMobile && { mt: "78px" }),
        }}
      >
        <PaperDetailContent
          paperId={id}
          onRelatedPaperClick={handleRelatedPaperClick}
        />
      </Box>
    </Box>
  );
};

export default PaperDetailPage;
