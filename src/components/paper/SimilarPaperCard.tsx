import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type SimilarPaper } from "../../types/paper";

interface SimilarPaperCardProps {
  paper: SimilarPaper;
  onClick?: (paperId: string) => void;
  isDesktop: boolean;
}

const TrustBadge = ({ label }: { label: "KCI" | "SCI" }) => (
  <Box
    sx={{
      display: "flex",
      padding: "3px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      borderRadius: "6px",
      border: "1px solid",
      borderColor: "secondary.dark",
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
      {label}
    </Typography>
  </Box>
);

const titleSx: SxProps<Theme> = {
  alignSelf: "stretch",
  color: "label.normal",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "29px",
  letterSpacing: "-0.378px",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const authorTextSx: SxProps<Theme> = {
  color: "#1B1C23",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

const journalSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.alternative",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const SimilarPaperCard = ({
  paper,
  onClick,
  isDesktop,
}: SimilarPaperCardProps) => {
  const [authorExpanded, setAuthorExpanded] = useState(false);
  const isClickable = paper.in_service && paper.paper_id !== null;
  const authors = paper.author
    ? paper.author.split(",").map((a) => a.trim())
    : [];

  return (
    <Box
      onClick={() => isClickable && paper.paper_id && onClick?.(paper.paper_id)}
      sx={{
        width: isDesktop ? "415px" : "100%",
        flexShrink: isDesktop ? 0 : undefined,
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "line.neutral",
        backgroundColor: isClickable ? "background.default" : "fill.normal",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: isClickable ? "pointer" : "default",
        boxSizing: "border-box",
        "&:hover": isClickable ? { backgroundColor: "background.paper" } : {},
      }}
    >
      {/* 배지들 */}
      {(paper.trust_badge?.kci || paper.trust_badge?.sci) && (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {paper.trust_badge.kci && <TrustBadge label="KCI" />}
          {paper.trust_badge.sci && <TrustBadge label="SCI" />}
        </Box>
      )}

      {/* 제목 */}
      <Typography sx={titleSx}>{paper.title}</Typography>

      {/* 저자 */}
      {authors.length > 0 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: authors.length > 1 ? "pointer" : "default",
            }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              if (authors.length > 1) setAuthorExpanded((prev) => !prev);
            }}
          >
            <Typography sx={authorTextSx}>
              {authors.length > 1
                ? `${authors[0]} 외 ${authors.length - 1}인`
                : authors[0]}
            </Typography>
            {authors.length > 1 && (
              <IconButton
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
                {authorExpanded ? (
                  <KeyboardArrowUpIcon sx={{ fontSize: 10 }} />
                ) : (
                  <KeyboardArrowDownIcon sx={{ fontSize: 10 }} />
                )}
              </IconButton>
            )}
          </Box>
          {authorExpanded && (
            <Typography
              sx={{ ...authorTextSx, color: "label.assistive", mt: "4px" }}
            >
              {authors.join(", ")}
            </Typography>
          )}
        </Box>
      )}

      {/* 저널 정보 */}
      {(paper.journal_name || paper.pubyear) && (
        <Typography sx={journalSx}>
          {[paper.pubyear, paper.journal_name].filter(Boolean).join(" ")}
        </Typography>
      )}

      {/* 키워드 */}
      {paper.keywords && paper.keywords.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {paper.keywords.map((kw, index) => (
            <Box
              key={`${kw}-${index}`}
              sx={{
                display: "flex",
                padding: "3px 8px 4px 8px",
                alignItems: "center",
                borderRadius: "6px",
                backgroundColor: "background.paper",
              }}
            >
              <Typography
                sx={{
                  color: "label.normal",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                {kw}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SimilarPaperCard;
