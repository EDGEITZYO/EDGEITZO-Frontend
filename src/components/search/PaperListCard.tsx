import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SearchPaper, type FeedbackType } from "../../types/search";
import PaperTypeBadge from "../common/PaperTypeBadge";

interface PaperListCardProps {
  paper: SearchPaper;
  isBookmarked: boolean;
  feedback?: FeedbackType;
  onClick: () => void;
  onBookmark: () => void;
  onFeedback: (paperId: string, feedback: FeedbackType) => void;
}

const PaperListCard = ({
  paper,
  isBookmarked,
  onClick,
  onBookmark,
}: PaperListCardProps) => {
  const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);

  const journalInfo = [paper.year, paper.journal_name]
    .filter(Boolean)
    .join(" · ");

  const authors = paper.authors.map((a) => a.name);
  const displayAuthors = isAuthorExpanded ? authors : authors.slice(0, 3);

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        padding: "16px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "line.neutral",
        backgroundColor: "background.default",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "fill.normal",
        },
      }}
    >
      {/* 배지~저자 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
        }}
      >
        {/* 배지~제목 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          {/* 배지, 저널, 북마크 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* 배지들 */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {paper.paper_type && (
                  <PaperTypeBadge paperType={paper.paper_type} />
                )}
                {paper.credibility.kci_registered && (
                  <PaperTypeBadge paperType={"학술 저널"} />
                )}
              </Box>
              {/* 저널 정보 */}
              {journalInfo && (
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    color: "label.alternative",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  {journalInfo}
                </Typography>
              )}
            </Box>
            {/* 북마크 */}
            <IconButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onBookmark();
              }}
              sx={{
                display: "flex",
                padding: "8px",
                alignItems: "center",
                gap: "10px",
                borderRadius: "8px",
              }}
            >
              {isBookmarked ? (
                <BookmarkIcon
                  sx={{ width: 20, height: 20, color: "primary.dark" }}
                />
              ) : (
                <BookmarkBorderIcon
                  sx={{ width: 20, height: 20, color: "label.alternative" }}
                />
              )}
            </IconButton>
          </Box>

          {/* 제목 */}
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              alignSelf: "stretch",
              overflow: "hidden",
              color: "label.normal",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.42px",
            }}
          >
            {paper.title}
          </Typography>
        </Box>

        {/* 저자 */}
        <Box
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography
            sx={{
              color: "#1B1C23",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: "-0.26px",
            }}
          >
            {displayAuthors.join(", ")}
            {!isAuthorExpanded && authors.length > 3 && " ..."}
          </Typography>
          {authors.length > 1 && (
            <IconButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setIsAuthorExpanded((prev) => !prev);
              }}
              sx={{
                display: "flex",
                width: "20px",
                height: "20px",
                padding: "5px",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
                borderRadius: "12px",
              }}
            >
              {isAuthorExpanded ? (
                <KeyboardArrowUpIcon sx={{ width: 10, height: 10 }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ width: 10, height: 10 }} />
              )}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* 초록 */}
      {paper.abstract && (
        <Box
          sx={{
            display: "flex",
            padding: "10px 12px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2px",
            alignSelf: "stretch",
            borderRadius: "6px",
            backgroundColor: "#F7F8FA",
          }}
        >
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 5,
              alignSelf: "stretch",
              overflow: "hidden",
              color: "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "27px",
              letterSpacing: "-0.336px",
            }}
          >
            {paper.abstract}
          </Typography>
        </Box>
      )}

      {/* 키워드 */}
      {paper.keywords.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {paper.keywords.map((keyword) => (
              <Box
                key={keyword}
                sx={{
                  display: "flex",
                  padding: "3px 8px 4px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  borderRadius: "6px",
                  backgroundColor: "#F7F8FA",
                }}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    color: "label.normal",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaperListCard;
