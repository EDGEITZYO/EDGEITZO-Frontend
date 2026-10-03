// src/components/researcher/ResearcherDetailPaperCard.tsx
import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type ResearcherPaperItem } from "../../types/researcher";
import { type PaperType } from "../../types/paper";
import PaperTypeBadge from "../common/PaperTypeBadge";

// ─── Props ───────────────────────────────────────────────

interface ResearcherDetailPaperCardProps {
  paper: ResearcherPaperItem;
  onBookmarkToggle: () => void;
  onClick: () => void;
}

// ─── Styles ──────────────────────────────────────────────

const cardSx: SxProps<Theme> = {
  display: "flex",
  padding: "16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "#FFF",
  cursor: "pointer",
};

const keywordsExcludedSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
};

const abstractExcludedSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  alignSelf: "stretch",
};

const authorExcludedSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
};

const titleExcludedSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "stretch",
};

const bookmarkExcludedSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
};

const badgeGroupSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
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

const bookmarkBtnSx: SxProps<Theme> = {
  display: "flex",
  height: "36px",
  padding: "6px 8px",
  justifyContent: "center",
  alignItems: "center",
  gap: "2px",
  borderRadius: "24px",
  backgroundColor: "#F7F8FA",
  flexShrink: 0,
  cursor: "pointer",
};

const titleSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  alignSelf: "stretch",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.normal",
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "30px",
  letterSpacing: "-0.42px",
};

const authorTextSx: SxProps<Theme> = {
  color: "#1B1C23",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

const abstractBoxSx: SxProps<Theme> = {
  display: "flex",
  padding: "10px 12px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "2px",
  alignSelf: "stretch",
  borderRadius: "6px",
  backgroundColor: "#F7F8FA",
};

const abstractTextSx: SxProps<Theme> = {
  alignSelf: "stretch",
  overflow: "hidden",
  color: "label.alternative",
  textOverflow: "ellipsis",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "27px",
  letterSpacing: "-0.336px",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
};

const keywordsFrameSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  alignSelf: "stretch",
};

const keywordsInnerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  flexWrap: "wrap",
};

const keywordSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "6px",
  backgroundColor: "#F7F8FA",
};

const keywordTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const kciSciBadgeSx: SxProps<Theme> = {
  display: "inline-flex",
  padding: "3px 8px 4px 8px",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: "secondary.dark",
  whiteSpace: "nowrap",
};

const kciSciTextSx: SxProps<Theme> = {
  fontSize: "16px",
  fontWeight: 600,
  color: "secondary.dark",
};

const citationBadgeSx: SxProps<Theme> = {
  display: "inline-flex",
  padding: "3px 8px 4px 8px",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: "label.normal",
  whiteSpace: "nowrap",
};

const citationTextSx: SxProps<Theme> = {
  fontSize: "16px",
  fontWeight: 600,
  color: "label.normal",
};

// ─── Component ────────────────────────────────────────────

const ResearcherDetailPaperCard = ({
  paper,
  onBookmarkToggle,
  onClick,
}: ResearcherDetailPaperCardProps) => {
  const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);

  const {
    title,
    paper_type,
    journal_name,
    pub_year,
    authors,
    abstract,
    keywords,
    trust_badge,
    can_bookmark,
    is_bookmarked,
  } = paper;

  const citationCount = trust_badge?.citation_count ?? null;
  const kciRegistered = trust_badge?.kci ?? false;
  const sciIndexed = trust_badge?.sci ?? false;

  const journalInfo = [pub_year, journal_name].filter(Boolean).join(" · ");

  return (
    <Box sx={cardSx} onClick={onClick}>
      {/* 키워드 제외한 거 묶음 */}
      <Box sx={keywordsExcludedSx}>
        {/* 초록 제외한 거 묶음 */}
        <Box sx={abstractExcludedSx}>
          {/* 저자 제외한 거 묶음 */}
          <Box sx={authorExcludedSx}>
            {/* 제목 제외한 거 묶음 */}
            <Box sx={titleExcludedSx}>
              {/* 북마크 제외한 거 묶음 */}
              <Box sx={bookmarkExcludedSx}>
                {/* 배지 묶음 */}
                <Box sx={badgeGroupSx}>
                  {paper_type !== null && (
                    <PaperTypeBadge paperType={paper_type as PaperType} />
                  )}
                  {citationCount !== null && (
                    <Box sx={citationBadgeSx}>
                      <Typography sx={citationTextSx}>
                        인용수 {citationCount}
                      </Typography>
                    </Box>
                  )}
                  {kciRegistered && (
                    <Box sx={kciSciBadgeSx}>
                      <Typography sx={kciSciTextSx}>KCI</Typography>
                    </Box>
                  )}
                  {sciIndexed && (
                    <Box sx={kciSciBadgeSx}>
                      <Typography sx={kciSciTextSx}>SCI</Typography>
                    </Box>
                  )}
                </Box>
                {/* 출간일자 · 저널명 */}
                {journalInfo.length > 0 && (
                  <Typography sx={journalSx}>{journalInfo}</Typography>
                )}
              </Box>
              {/* 북마크 버튼 */}
              {can_bookmark && (
                <Box
                  sx={bookmarkBtnSx}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    onBookmarkToggle();
                  }}
                >
                  {is_bookmarked ? (
                    <BookmarkIcon
                      sx={{ width: 20, height: 20, color: "primary.dark" }}
                    />
                  ) : (
                    <BookmarkBorderIcon
                      sx={{ width: 20, height: 20, color: "label.assistive" }}
                    />
                  )}
                </Box>
              )}
            </Box>
            {/* 제목 */}
            {title !== null && <Typography sx={titleSx}>{title}</Typography>}
          </Box>
          {/* 저자 */}
          {authors.length > 0 && (
            <Box
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: authors.length > 1 ? "pointer" : "default",
                }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  if (authors.length > 1) setIsAuthorExpanded((prev) => !prev);
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
                      width: "20px",
                      height: "20px",
                      p: "5px",
                      borderRadius: "12px",
                    }}
                  >
                    {isAuthorExpanded ? (
                      <KeyboardArrowUpIcon sx={{ fontSize: 10 }} />
                    ) : (
                      <KeyboardArrowDownIcon sx={{ fontSize: 10 }} />
                    )}
                  </IconButton>
                )}
              </Box>
              {isAuthorExpanded && (
                <Typography
                  sx={{
                    ...authorTextSx,
                    color: "label.assistive",
                    mt: "4px",
                  }}
                >
                  {authors.join(", ")}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {/* 초록 */}
        {abstract !== null && (
          <Box sx={abstractBoxSx}>
            <Typography sx={abstractTextSx}>{abstract}</Typography>
          </Box>
        )}
      </Box>
      {/* 키워드 */}
      {keywords.length > 0 && (
        <Box sx={keywordsFrameSx}>
          <Box sx={keywordsInnerSx}>
            {keywords.map((kw, index) => (
              <Box key={`${kw}-${index}`} sx={keywordSx}>
                <Typography sx={keywordTextSx}>{kw}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ResearcherDetailPaperCard;
