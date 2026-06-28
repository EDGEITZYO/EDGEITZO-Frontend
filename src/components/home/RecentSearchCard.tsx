import { Box, Typography } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { type RecentSearch } from "../../types/home";

interface RecentSearchCardProps {
  data: RecentSearch;
}

const SearchTypeBadge = ({ type }: { type: RecentSearch["type"] }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3px 8px 4px 8px",
      borderRadius: "6px",
      backgroundColor: type === "ai" ? "#E6F9F0" : "#EDFAE6",
      flexShrink: 0,
    }}
  >
    <Typography
      sx={{
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "-0.336px",
        color: type === "ai" ? "primary.dark" : "secondary.dark",
        whiteSpace: "nowrap",
      }}
    >
      {type === "ai" ? "AI 검색" : "키워드"}
    </Typography>
  </Box>
);

const RecentSearchCard = ({ data }: RecentSearchCardProps) => {
  const {
    type,
    title,
    last_viewed_paper_title,
    keyword_path,
    recommended_keywords,
  } = data;

  const handleClick = () => {
    // TODO: AI 검색은 이전 대화 흐름 복원, 키워드는 이전 탐색 경로 복원
  };

  return (
    <Box
      onClick={handleClick}
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
      {/* 헤더: 배지 + 제목 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <SearchTypeBadge type={type} />
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

      {/* 마지막 논문 */}
      {last_viewed_paper_title && (
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
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: { xs: 2, sm: 1 },
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            마지막 논문
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "30px",
              letterSpacing: "-0.378px",
              color: "label.normal",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: { xs: 2, sm: 1 },
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {last_viewed_paper_title}
          </Typography>
        </Box>
      )}

      {/* 탐색 경로 (키워드) */}
      {type === "keyword" && keyword_path.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "4px",
          }}
        >
          {keyword_path.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "3px 8px 4px 8px",
                  borderRadius: "6px",
                  backgroundColor: "#EDFAE6",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                    color: "secondary.dark",
                  }}
                >
                  {item}
                </Typography>
              </Box>
              {index < keyword_path.length - 1 && (
                <Box
                  sx={{
                    width: "31px",
                    height: "31px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                  }}
                >
                  <ChevronRight size={24} color="#73757F" />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* 키워드 태그 (AI 검색) */}
      {type === "ai" && recommended_keywords.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {recommended_keywords.map((keyword, index) => (
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
      )}
    </Box>
  );
};

export default RecentSearchCard;
