import { useState, useEffect, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paperApi } from "../../api/paper";
import { bookmarkApi } from "../../api/bookmark";
import { type PaperType } from "../../types/paper";
import { type SimilarPaper } from "../../types/paper";
import BookmarkFolderSelectDialog from "./BookmarkFolderSelectDialog";

interface PaperDetailContentProps {
  paperId: string;
  searchId?: string;
  onRelatedPaperClick?: (paperId: string) => void;
}

// ─── 배지 ────────────────────────────────────────────────

const PaperTypeBadge = ({ paperType }: { paperType: PaperType }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      px: "6px",
      borderRadius: "7px",
      height: "28px",
      backgroundColor:
        paperType === "학술 저널" ? "status.negative" : "primary.dark",
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

// ─── 유사 논문 카드 ───────────────────────────────────────

const SimilarPaperCard = ({
  paper,
  onClick,
}: {
  paper: SimilarPaper;
  onClick?: (paperId: string) => void;
}) => {
  const isClickable = paper.in_service && paper.paper_id !== null;

  return (
    <Box
      onClick={() => isClickable && paper.paper_id && onClick?.(paper.paper_id)}
      sx={{
        width: "276px",
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "line.neutral",
        backgroundColor: isClickable ? "static.white" : "fill.normal",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: isClickable ? "pointer" : "default",
        flexShrink: 0,
        opacity: isClickable ? 1 : 0.5,
        "&:hover": isClickable ? { backgroundColor: "background.paper" } : {},
      }}
    >
      <Typography
        sx={{ fontSize: "13px", fontWeight: 400, color: "label.alternative" }}
      >
        {paper.pubyear}
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
      <Typography
        sx={{ fontSize: "13px", fontWeight: 400, color: "label.alternative" }}
      >
        {paper.author}
      </Typography>
      <Typography
        sx={{ fontSize: "12px", fontWeight: 400, color: "label.assistive" }}
      >
        {paper.material_type}
      </Typography>
    </Box>
  );
};

// ─── 메인 컴포넌트 ────────────────────────────────────────

const PaperDetailContent = ({
  paperId,
  searchId,
  onRelatedPaperClick,
}: PaperDetailContentProps) => {
  const queryClient = useQueryClient();
  const [authorsExpanded, setAuthorsExpanded] = useState(false);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const recentReadCalled = useRef(false);

  const {
    data: paperData,
    isPending: isPaperPending,
    isError: isPaperError,
  } = useQuery({
    queryKey: ["paper", paperId],
    queryFn: async () => {
      const res = await paperApi.getPaper(paperId);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: similarData } = useQuery({
    queryKey: ["paper", paperId, "similar"],
    queryFn: async () => {
      const res = await paperApi.getSimilarPapers(paperId);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: bookmarkData } = useQuery({
    queryKey: ["bookmark", paperId],
    queryFn: async () => {
      const res = await bookmarkApi.checkBookmark(paperId);
      return res.data.data;
    },
    staleTime: 0,
  });

  // recent-reads 호출 (마운트 시 1회)
  useEffect(() => {
    if (recentReadCalled.current) return;
    recentReadCalled.current = true;
    paperApi
      .recordRecentRead(paperId, searchId)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["home"] });
        queryClient.invalidateQueries({ queryKey: ["recent-papers"] });
        queryClient.invalidateQueries({ queryKey: ["recent-paper-stats"] });
      })
      .catch(() => {});
  }, [paperId, searchId, queryClient]);

  // 북마크 낙관적 업데이트
  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async () => {
      if (bookmarkData?.bookmarked) {
        await bookmarkApi.removeBookmark(paperId);
      } else {
        // 북마크 추가는 폴더 선택 다이얼로그에서 처리
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmark", paperId] });
      const previous = queryClient.getQueryData(["bookmark", paperId]);
      queryClient.setQueryData(
        ["bookmark", paperId],
        (old: { paper_id: string; bookmarked: boolean } | undefined) => ({
          paper_id: paperId,
          bookmarked: !old?.bookmarked,
        }),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["bookmark", paperId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark", paperId] });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmarks-total"] });
    },
  });

  const handleBookmarkClick = () => {
    if (bookmarkData?.bookmarked) {
      toggleBookmark();
    } else {
      setBookmarkDialogOpen(true);
    }
  };

  const handleBookmarkAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["bookmark", paperId] });
  };

  const handleOriginalLink = () => {
    if (paperData?.doi) {
      window.open(paperData.doi, "_blank");
    }
  };

  if (isPaperPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: "80px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isPaperError || !paperData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: "80px",
        }}
      >
        <Typography>
          논문 정보를 불러오지 못했어요. 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  const isBookmarked = bookmarkData?.bookmarked ?? false;

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
            {paperData.paper_type && (
              <PaperTypeBadge paperType={paperData.paper_type} />
            )}
            {paperData.trust_badge.kci && <DarkBadge label="KCI" />}
            <DarkBadge label={`인용수 ${paperData.citation_count}`} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "9px" }}>
            {paperData.doi && (
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
                <OpenInNewIcon
                  sx={{ fontSize: "20px", color: "label.strong" }}
                />
              </Box>
            )}
            {isBookmarked ? (
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
          {paperData.title}
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
          {paperData.journal_name}
          {"  "}
          {paperData.published_at}
        </Typography>

        {/* 저자 */}
        <Box>
          <Box
            onClick={() =>
              paperData.authors.length > 1 &&
              setAuthorsExpanded((prev) => !prev)
            }
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: paperData.authors.length > 1 ? "pointer" : "default",
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
              {paperData.authors.length > 1
                ? `${paperData.authors[0]} 외 ${paperData.authors.length - 1}인`
                : paperData.authors[0]}
            </Typography>
            {paperData.authors.length > 1 &&
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
              {paperData.authors.join(", ")}
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
            {paperData.keywords_ko.map((keyword, index) => (
              <Box
                key={index}
                sx={{
                  px: "6px",
                  py: 0,
                  borderRadius: "7px",
                  backgroundColor: "background.default",
                  border: "1px solid",
                  borderColor: "line.normal",
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
      {paperData.abstract && (
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
            {paperData.abstract}
          </Typography>
        </Box>
      )}

      {/* 유사 논문 */}
      {similarData && similarData.length > 0 && (
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
          <Box
            sx={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {similarData.map((paper, index) => (
              <SimilarPaperCard
                key={paper.paper_id ?? index}
                paper={paper}
                onClick={onRelatedPaperClick}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* 북마크 폴더 선택 다이얼로그 */}
      <BookmarkFolderSelectDialog
        open={bookmarkDialogOpen}
        onClose={() => setBookmarkDialogOpen(false)}
        paperId={paperId}
        onBookmarkAdded={handleBookmarkAdded}
      />
    </Box>
  );
};

export default PaperDetailContent;
