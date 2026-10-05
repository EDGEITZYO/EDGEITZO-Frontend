import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import type { RelatedCorpusPaper } from "../../types/paper";
import PaperTypeBadge from "../common/PaperTypeBadge";

interface RelatedCorpusPaperCardProps {
  paper: RelatedCorpusPaper;
  onClick: () => void;
  isDesktop: boolean;
}

const RelatedCorpusPaperCard = ({
  paper,
  onClick,
  isDesktop,
}: RelatedCorpusPaperCardProps) => {
  const [authorsExpanded, setAuthorsExpanded] = useState(false);
  const authors = paper.authors ?? [];
  const citationCount =
    paper.trust_badge?.citation_count ?? paper.citation_count;
  const kciRegistered = paper.trust_badge?.kci ?? paper.kci_registered;
  const sciIndexed = paper.trust_badge?.sci ?? paper.sci_indexed;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: isDesktop ? "415px" : "100%",
        flexShrink: isDesktop ? 0 : undefined,
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "line.neutral",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: "pointer",
        boxSizing: "border-box",
        "&:hover": { backgroundColor: "background.paper" },
      }}
    >
      {/* 배지 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {paper.paper_type && <PaperTypeBadge paperType={paper.paper_type} />}
        {citationCount !== null && citationCount !== undefined && (
          <Box
            sx={{
              display: "inline-flex",
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
              인용수 {citationCount}
            </Typography>
          </Box>
        )}
        {kciRegistered && (
          <Box
            sx={{
              display: "inline-flex",
              padding: "3px 8px 4px 8px",
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
              KCI
            </Typography>
          </Box>
        )}
        {sciIndexed && (
          <Box
            sx={{
              display: "inline-flex",
              padding: "3px 8px 4px 8px",
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
              SCI
            </Typography>
          </Box>
        )}
      </Box>

      {/* 제목 */}
      <Typography
        sx={{
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
        }}
      >
        {paper.title ?? "제목 없음"}
      </Typography>

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
              if (authors.length > 1) setAuthorsExpanded((prev) => !prev);
            }}
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
              {authors.length > 1
                ? `${authors[0]} 외 ${authors.length - 1}인`
                : authors[0]}
            </Typography>
            {authors.length > 1 && (
              <IconButton
                sx={{
                  width: "20px",
                  height: "20px",
                  p: "5px",
                  borderRadius: "12px",
                }}
              >
                {authorsExpanded ? (
                  <KeyboardArrowUpIcon sx={{ fontSize: 10 }} />
                ) : (
                  <KeyboardArrowDownIcon sx={{ fontSize: 10 }} />
                )}
              </IconButton>
            )}
          </Box>
          {authorsExpanded && (
            <Typography
              sx={{
                color: "label.assistive",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: "-0.26px",
                mt: "4px",
              }}
            >
              {authors.join(", ")}
            </Typography>
          )}
        </Box>
      )}

      {/* 저널 정보 */}
      {(paper.pub_year !== null || paper.journal_name) && (
        <Typography
          sx={{
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
          }}
        >
          {[paper.pub_year, paper.journal_name].filter(Boolean).join(" ")}
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

export default RelatedCorpusPaperCard;
