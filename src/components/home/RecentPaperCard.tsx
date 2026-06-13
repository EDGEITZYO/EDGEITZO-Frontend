import { Box, Typography } from "@mui/material";
import { type RecentPaper } from "../../types/home";
import { useNavigate } from "react-router-dom";
import PaperTypeBadge from "../common/PaperTypeBadge";

interface RecentPaperCardProps {
  data: RecentPaper;
}

const formatViewedAt = (viewedAt: string): string => {
  try {
    const date = new Date(viewedAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day}.${hours}:${minutes}`;
  } catch {
    return "";
  }
};

const RecentPaperCard = ({ data }: RecentPaperCardProps) => {
  const navigate = useNavigate();
  const {
    paper_id,
    paper_type,
    journal_name,
    published_at,
    title,
    keywords,
    badges,
    viewed_at,
  } = data;

  return (
    <Box
      onClick={() =>
        navigate(`/papers/${paper_id}?returnTo=${encodeURIComponent("/home")}`)
      }
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
      {/* 배지 행 */}
      {paper_type && <PaperTypeBadge paperType={paper_type} />}

      {/* 출처 + 날짜 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
        {journal_name && (
          <Typography
            variant="caption"
            sx={{ color: "#757A94", fontWeight: 500 }}
          >
            {journal_name}
          </Typography>
        )}
        {published_at && (
          <Typography
            variant="caption"
            sx={{ color: "#757A94", fontWeight: 500 }}
          >
            {published_at}
          </Typography>
        )}
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
          {badges.kci && (
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
                KCI {badges.kci}
              </Typography>
            </Box>
          )}
          {badges.citation_count !== null && (
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
                인용수 {badges.citation_count}
              </Typography>
            </Box>
          )}
        </Box>
        <Typography
          variant="caption"
          sx={{ color: "#757A94", fontWeight: 500 }}
        >
          {formatViewedAt(viewed_at)} 읽음
        </Typography>
      </Box>
    </Box>
  );
};

export default RecentPaperCard;
