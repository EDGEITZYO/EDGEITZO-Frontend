import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type RecentPaperChartItem } from "../../types/saved";
import PaperTypeBadge from "./PaperTypeBadge";

interface ChartPaperCardProps {
  paper: RecentPaperChartItem;
  onClick: (paperId: string) => void;
}

const containerSx: SxProps<Theme> = {
  width: "100%",
  padding: "16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "background.default",
  display: "flex",
  cursor: "pointer",
  "&:hover": { backgroundColor: "background.paper" },
  boxSizing: "border-box",
  minWidth: 0,
};

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

const keywordSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  alignItems: "center",
  borderRadius: "6px",
  backgroundColor: "background.paper",
  maxWidth: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  minWidth: 0,
};

const keywordTextSx: SxProps<Theme> = {
  color: "label.normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  wordBreak: "break-word",
  overflowWrap: "break-word",
};

const ChartPaperCard = ({ paper, onClick }: ChartPaperCardProps) => {
  const [authorExpanded, setAuthorExpanded] = useState(false);

  const {
    paper_id,
    journal_name,
    published_at,
    title,
    authors,
    keywords,
    paper_type,
    trust_badge,
  } = paper;

  return (
    <Box sx={containerSx} onClick={() => onClick(paper_id)}>
      {/* 배지들 + 제목 + 저자 묶음 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "4px",
          alignSelf: "stretch",
        }}
      >
        {/* 배지들 */}
        <Box
          sx={{
            display: "flex",
            height: "36px",
            alignItems: "flex-start",
            gap: "8px",
            alignSelf: "stretch",
          }}
        >
          {paper_type && <PaperTypeBadge paperType={paper_type} />}
          {trust_badge?.citation_count !== null &&
            trust_badge?.citation_count !== undefined && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "3px 8px 4px 8px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: "label.normal",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                    color: "label.normal",
                  }}
                >
                  인용수 {trust_badge.citation_count}
                </Typography>
              </Box>
            )}
          {trust_badge?.kci && (
            <Box
              sx={{
                display: "flex",
                padding: "3px 8px 4px 8px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: "secondary.dark",
              }}
            >
              <Typography
                sx={{
                  color: "secondary.dark",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                KCI
              </Typography>
            </Box>
          )}
          {trust_badge?.sci && (
            <Box
              sx={{
                display: "flex",
                padding: "3px 8px 4px 8px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: "secondary.dark",
              }}
            >
              <Typography
                sx={{
                  color: "secondary.dark",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                SCI
              </Typography>
            </Box>
          )}
        </Box>

        {/* 제목 */}
        <Typography sx={titleSx}>{title}</Typography>
      </Box>

      {/* 저자 */}
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

      {/* 저널 정보 */}
      {(journal_name || published_at) && (
        <Typography sx={journalSx}>
          {[published_at, journal_name].filter(Boolean).join(" ")}
        </Typography>
      )}

      {/* 키워드 */}
      {keywords && keywords.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            width: "100%",
            minWidth: 0,
          }}
        >
          {keywords.map((kw, index) => (
            <Box key={`${kw}-${index}`} sx={keywordSx}>
              <Typography sx={keywordTextSx}>{kw}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ChartPaperCard;
