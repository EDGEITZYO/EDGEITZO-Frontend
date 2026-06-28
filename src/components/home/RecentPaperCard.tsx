import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PaperTypeBadge from "../common/PaperTypeBadge";
import { type RecentPaper } from "../../types/home";

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
    return `${year}.${month}.${day} ${hours}:${minutes} 읽음`;
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
    viewed_at,
  } = data;

  return (
    <Box
      onClick={() =>
        navigate(`/papers/${paper_id}?returnTo=${encodeURIComponent("/home")}`)
      }
      sx={{
        width: "100%",
        minWidth: 0,
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "line.neutral",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: "pointer",
        "&:hover": { backgroundColor: "fill.normal" },
      }}
    >
      {/* 논문 유형 배지 + 제목 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {paper_type && (
          <Box sx={{ flexShrink: 0 }}>
            <PaperTypeBadge paperType={paper_type} />
          </Box>
        )}
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: "30px",
            letterSpacing: "-0.42px",
            color: "label.normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* 출처 + 날짜 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: "10px 12px",
          borderRadius: "6px",
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "-0.336px",
            color: "label.alternative",
          }}
        >
          {[published_at, journal_name].filter(Boolean).join(" ")}
        </Typography>
      </Box>

      {/* 키워드 태그 + 읽은 시각 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: { sm: "space-between" },
          gap: { xs: "8px", sm: 0 },
        }}
      >
        {/* 키워드 태그 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {keywords.map((keyword, index) => (
            <Box
              key={index}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 8px 4px 8px",
                borderRadius: "6px",
                backgroundColor: "background.paper",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                  color: "label.normal",
                }}
              >
                {keyword}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* 읽은 시각 */}
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: "-0.26px",
            color: "label.alternative",
            flexShrink: 0,
          }}
        >
          {formatViewedAt(viewed_at)}
        </Typography>
      </Box>
    </Box>
  );
};

export default RecentPaperCard;
