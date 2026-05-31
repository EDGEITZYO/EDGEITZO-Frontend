import { Box, Typography } from "@mui/material";
import { type RecentPaper } from "../../types/home";
import { useNavigate } from "react-router-dom";

interface RecentPaperCardProps {
  data: RecentPaper;
}

const RecentPaperCard = ({ data }: RecentPaperCardProps) => {
  const navigate = useNavigate();
  const { id, source, date, title, keywords, kciType, citationCount, readAt } =
    data;

  return (
    <Box
      onClick={() => navigate(`/papers/${id}?returnTo=${encodeURIComponent('/home')}`)}
      sx={{
        padding: "18px 16px",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "line.normal",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: "pointer",
      }}
    >
      {/* 출처 + 날짜 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <Typography
          variant="caption"
          sx={{ color: "#757A94", fontWeight: 500 }}
        >
          {source}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#757A94", fontWeight: 500 }}
        >
          {date}
        </Typography>
      </Box>

      {/* 논문 제목 */}
      <Typography
        variant="h5"
        sx={{ color: "label.strong", alignSelf: "stretch" }}
      >
        {title}
      </Typography>

      {/* 논문 키워드 태그 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "9px" }}>
        {keywords.map((keyword, index) => (
          <Box
            key={index}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: "6.34px",
              borderRadius: "7.39px",
              backgroundColor: "fill.normal",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "label.strong", fontWeight: 400 }}
            >
              {keyword}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 배지 + 읽은 날짜 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              px: "8px",
              py: "3px",
              borderRadius: "68px",
              backgroundColor: "#31333F",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "static.white",
                fontWeight: 400,
                letterSpacing: "-0.28px",
              }}
            >
              {kciType}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              px: "8px",
              py: "3px",
              borderRadius: "68px",
              backgroundColor: "#31333F",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "static.white",
                fontWeight: 400,
                letterSpacing: "-0.28px",
              }}
            >
              인용수 {citationCount}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "#757A94", fontWeight: 500 }}
        >
          {readAt} 읽음
        </Typography>
      </Box>
    </Box>
  );
};

export default RecentPaperCard;
