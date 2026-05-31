import { useState } from "react";
import { Box, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { type PaperDetail, type PaperBase } from "../../types/paper";
import BookmarkFolderSelectDialog from "./BookmarkFolderSelectDialog";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface PaperDetailContentProps {
  paper: PaperDetail;
  onRelatedPaperClick: (paperId: string) => void;
}

// ─── 배지 ────────────────────────────────────────────────

const PaperTypeBadge = ({ paperType }: { paperType: string }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      px: "6px",
      borderRadius: "7px",
      height: "28px",
      backgroundColor:
        paperType === "학위논문" ? "primary.dark" : "status.negative",
    }}
  >
    <Typography
      sx={{ fontSize: "14px", fontWeight: 700, color: "static.white" }}
    >
      {paperType}
    </Typography>
  </Box>
);

const DarkBadge = ({ label }: { label: string }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      px: "8px",
      py: "3px",
      borderRadius: "12px",
      backgroundColor: "static.black",
    }}
  >
    <Typography
      sx={{ fontSize: "12px", fontWeight: 600, color: "static.white" }}
    >
      {label}
    </Typography>
  </Box>
);

// ─── 연관 논문 카드 ───────────────────────────────────────

const DOI_KCI_ORCID_BADGES = ["DOI ↗", "KCI", "ORCID"];

const RelatedPaperCard = ({
  paper,
  onClick,
}: {
  paper: PaperBase;
  onClick: (id: string) => void;
}) => {
  const [authorExpanded, setAuthorExpanded] = useState(false);

  return (
    <Box
      onClick={() => onClick(paper.id)}
      sx={{
        width: "276px",
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "line.neutral",
        backgroundColor: "static.white",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: "pointer",
        flexShrink: 0,
        "&:hover": { backgroundColor: "background.paper" },
      }}
    >
      <Typography
        sx={{ fontSize: "13px", fontWeight: 400, color: "label.alternative" }}
      >
        {paper.source} {paper.date}
      </Typography>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          color: "label.strong",
          lineHeight: "normal",
          letterSpacing: "-0.34px",
        }}
      >
        {paper.title}
      </Typography>

      {/* 저자 */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: paper.authors.length > 1 ? "pointer" : "default",
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            if (paper.authors.length > 1) setAuthorExpanded((prev) => !prev);
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              color: "label.alternative",
            }}
          >
            {paper.authors.length > 1
              ? `${paper.authors[0]} 외 ${paper.authors.length - 1}인`
              : paper.authors[0]}
          </Typography>
          {paper.authors.length > 1 &&
            (authorExpanded ? (
              <KeyboardArrowUpIcon
                sx={{ fontSize: 12, color: "label.alternative" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{ fontSize: 12, color: "label.alternative" }}
              />
            ))}
        </Box>
        {authorExpanded && (
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              color: "label.assistive",
              mt: "4px",
            }}
          >
            {paper.authors.join(", ")}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {paper.keywords.map((keyword, index) => (
          <Box
            key={index}
            sx={{
              px: "5px",
              borderRadius: "6px",
              backgroundColor: "fill.normal",
              height: "24px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "12px", fontWeight: 400, color: "label.neutral" }}
            >
              {keyword}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: "5px" }}>
        {DOI_KCI_ORCID_BADGES.map((badge) => (
          <Box
            key={badge}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              px: "7px",
              py: "3px",
              borderRadius: "58px",
              backgroundColor: "#31333F",
            }}
          >
            <Typography
              sx={{ fontSize: "12px", fontWeight: 400, color: "static.white" }}
            >
              {badge}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── 메인 컴포넌트 ────────────────────────────────────────

const PaperDetailContent = ({
  paper,
  onRelatedPaperClick,
}: PaperDetailContentProps) => {
  const [authorsExpanded, setAuthorsExpanded] = useState(false);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);

  const handleBookmarkClick = () => {
    if (paper.isBookmarked) {
      // TODO: API 연동 시 북마크 삭제 처리
      console.log("북마크 삭제", paper.id);
    } else {
      setBookmarkDialogOpen(true);
    }
  };

  const handleOriginalLink = () => {
    if (paper.originalUrl) {
      window.open(paper.originalUrl, "_blank");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 논문 정보 영역 */}
      <Box
        sx={{
          padding: "20px 0 26px 0",
          display: "flex",
          flexDirection: "column",
          gap: "17px",
        }}
      >
        {/* 배지 행 + 원문보기 + 북마크 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {paper.paperType && <PaperTypeBadge paperType={paper.paperType} />}
            <DarkBadge label={paper.kciType} />
            <DarkBadge label={`인용수 ${paper.citationCount}`} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <Box
              onClick={handleOriginalLink}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <Typography
                sx={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "label.strong",
                  letterSpacing: "-0.34px",
                }}
              >
                논문 원문 보기
              </Typography>
              <OpenInNewIcon sx={{ fontSize: "20px", color: "label.strong" }} />
            </Box>
            {paper.isBookmarked ? (
              <BookmarkIcon
                onClick={handleBookmarkClick}
                sx={{
                  fontSize: "24px",
                  color: "primary.main",
                  cursor: "pointer",
                }}
              />
            ) : (
              <BookmarkBorderIcon
                onClick={handleBookmarkClick}
                sx={{
                  fontSize: "24px",
                  color: "label.assistive",
                  cursor: "pointer",
                }}
              />
            )}
          </Box>
        </Box>

        {/* 제목 */}
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 600,
            color: "static.black",
            letterSpacing: "-0.48px",
            lineHeight: "36px",
          }}
        >
          {paper.title}
        </Typography>

        {/* 저널명 + 날짜 */}
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: 400,
            color: "label.alternative",
            letterSpacing: "-0.34px",
          }}
        >
          {paper.source}
          {"  "}
          {paper.date}
        </Typography>

        {/* 저자 */}
        <Box>
          <Box
            onClick={() =>
              paper.authors.length > 1 && setAuthorsExpanded((prev) => !prev)
            }
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: paper.authors.length > 1 ? "pointer" : "default",
            }}
          >
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 400,
                color: "label.alternative",
                letterSpacing: "-0.34px",
              }}
            >
              {paper.authors.length > 1
                ? `${paper.authors[0]} 외 ${paper.authors.length - 1}인`
                : paper.authors[0]}
            </Typography>
            {paper.authors.length > 1 &&
              (authorsExpanded ? (
                <KeyboardArrowUpIcon
                  sx={{ fontSize: 12, color: "label.alternative" }}
                />
              ) : (
                <KeyboardArrowDownIcon
                  sx={{ fontSize: 12, color: "label.alternative" }}
                />
              ))}
          </Box>
          {authorsExpanded && (
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 400,
                color: "label.assistive",
                letterSpacing: "-0.34px",
                mt: "4px",
              }}
            >
              {paper.authors.join(", ")}
            </Typography>
          )}
        </Box>

        {/* 핵심 키워드 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Typography
            sx={{ fontSize: "17px", fontWeight: 400, color: "label.normal" }}
          >
            핵심 키워드
          </Typography>
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {paper.keywords.map((keyword, index) => (
              <Box
                key={index}
                sx={{
                  px: "6px",
                  py: 0,
                  borderRadius: "7px",
                  backgroundColor: "fill.strong",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "label.strong",
                    lineHeight: "27px",
                    letterSpacing: "-0.28px",
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* 초록 */}
      <Box
        sx={{
          padding: "18px 38px 18px 30px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          borderRadius: "14px",
          backgroundColor: "static.white",
          mb: "50px",
        }}
      >
        <Box
          sx={{
            px: "9px",
            py: "6px",
            borderRadius: "7px",
            backgroundColor: "background.paper",
            alignSelf: "flex-start",
          }}
        >
          <Typography
            sx={{ fontSize: "17px", fontWeight: 600, color: "label.strong" }}
          >
            초록
          </Typography>
        </Box>
        <Typography
          sx={{
            pl: "8px",
            fontSize: "17px",
            fontWeight: 400,
            color: "static.black",
            lineHeight: "29px",
            letterSpacing: "-0.34px",
          }}
        >
          {paper.abstract}
        </Typography>
      </Box>

      {/* 연관된 논문 */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 600,
            color: "static.black",
            letterSpacing: "-0.48px",
          }}
        >
          연관된 논문
        </Typography>
        <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {paper.relatedPapers.map((relatedPaper) => (
            <RelatedPaperCard
              key={relatedPaper.id}
              paper={relatedPaper}
              onClick={onRelatedPaperClick}
            />
          ))}
        </Box>
      </Box>

      {/* 북마크 폴더 선택 다이얼로그 */}
      <BookmarkFolderSelectDialog
        open={bookmarkDialogOpen}
        onClose={() => setBookmarkDialogOpen(false)}
        paperId={paper.id}
      />
    </Box>
  );
};

export default PaperDetailContent;
