import { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paperApi } from "../../api/paper";
import { bookmarkApi } from "../../api/bookmark";
import BookmarkFolderSelectDialog from "./BookmarkFolderSelectDialog";
import SimilarPaperCard from "../paper/SimilarPaperCard";
import PaperTypeBadge from "./PaperTypeBadge";

interface PaperDetailContentProps {
  paperId: string;
  searchId?: string;
  onRelatedPaperClick?: (paperId: string) => void;
}

// ─── 배지 ────────────────────────────────────────────────

const CitationBadge = ({ count }: { count: number }) => (
  <Box
    sx={{
      display: "flex",
      padding: "3px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
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
      인용수 {count}
    </Typography>
  </Box>
);

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

// ─── 섹션 헤더 (초록, 연관된 논문 공통) ────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <Box
    sx={{
      display: "flex",
      padding: "10px 12px",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "2px",
      alignSelf: "stretch",
      borderRadius: "6px",
      backgroundColor: "background.paper",
    }}
  >
    <Typography
      sx={{
        alignSelf: "stretch",
        color: "label.normal",
        fontSize: "18px",
        fontWeight: 600,
        lineHeight: "29px",
        letterSpacing: "-0.378px",
      }}
    >
      {title}
    </Typography>
  </Box>
);

// ─── 메인 컴포넌트 ────────────────────────────────────────

const PaperDetailContent = ({
  paperId,
  searchId,
  onRelatedPaperClick,
}: PaperDetailContentProps) => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
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

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async () => {
      if (bookmarkData?.bookmarked) {
        await bookmarkApi.removeBookmark(paperId);
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

  if (isPaperPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: "80px",
          width: "100%",
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
          width: "100%",
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        alignSelf: "stretch",
      }}
    >
      {/* 논문 기본 정보 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
        }}
      >
        {/* doi, 배지들, 북마크, 제목, 저널정보, 저자 묶음 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "4px",
            alignSelf: "stretch",
          }}
        >
          {/* doi, 배지들, 북마크, 제목, 저널정보 묶음 */}
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
            {/* doi, 배지들, 북마크 행 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
                rowGap: "12px",
                alignSelf: "stretch",
                flexWrap: "wrap",
              }}
            >
              {/* 배지들 */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {paperData.paper_type && (
                  <PaperTypeBadge paperType={paperData.paper_type} />
                )}
                <CitationBadge count={paperData.citation_count} />
                {paperData.trust_badge.kci && <TrustBadge label="KCI" />}
                {paperData.trust_badge.sci && <TrustBadge label="SCI" />}
              </Box>

              {/* doi + 북마크 */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {paperData.doi && (
                  <Box
                    onClick={() => window.open(paperData.doi!, "_blank")}
                    sx={{
                      display: "flex",
                      padding: "6px 12px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "2px",
                      borderRadius: "24px",
                      backgroundColor: "label.normal",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#FAFAFC",
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "24px",
                        letterSpacing: "-0.336px",
                      }}
                    >
                      논문 원문 보기
                    </Typography>
                    <OpenInNewIcon
                      sx={{ width: "20px", height: "20px", color: "#FAFAFC" }}
                    />
                  </Box>
                )}
                <Box
                  onClick={handleBookmarkClick}
                  sx={{
                    display: "flex",
                    height: "36px",
                    padding: "6px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "2px",
                    borderRadius: "24px",
                    backgroundColor: "background.paper",
                    cursor: "pointer",
                  }}
                >
                  {isBookmarked ? (
                    <BookmarkIcon
                      sx={{
                        width: "20px",
                        height: "20px",
                        color: "primary.dark",
                      }}
                    />
                  ) : (
                    <BookmarkBorderIcon
                      sx={{
                        width: "20px",
                        height: "20px",
                        color: "label.assistive",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* 제목 + 저널정보 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  alignSelf: "stretch",
                  color: "label.normal",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "30px",
                  letterSpacing: "-0.42px",
                }}
              >
                {paperData.title}
              </Typography>
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
                {[paperData.published_at, paperData.journal_name]
                  .filter(Boolean)
                  .join(" ")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 저자 */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: paperData.authors.length > 1 ? "pointer" : "default",
            }}
            onClick={() =>
              paperData.authors.length > 1 &&
              setAuthorsExpanded((prev) => !prev)
            }
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
              {paperData.authors.length > 1
                ? `${paperData.authors[0]} 외 ${paperData.authors.length - 1}인`
                : paperData.authors[0]}
            </Typography>
            {paperData.authors.length > 1 && (
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
              {paperData.authors.join(", ")}
            </Typography>
          )}
        </Box>

        {/* 키워드 */}
        {paperData.keywords_ko.length > 0 && (
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
              {paperData.keywords_ko.map((keyword, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    padding: "3px 8px 4px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "6px",
                    backgroundColor: "background.paper",
                  }}
                >
                  <Typography
                    sx={{
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

      {/* 초록 */}
      {paperData.abstract && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          <SectionHeader title="초록" />
          <Box
            sx={{
              display: "flex",
              padding: "0 12px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              alignSelf: "stretch",
            }}
          >
            <Typography
              sx={{
                flex: "1 0 0",
                color: "label.normal",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "27px",
                letterSpacing: "-0.336px",
              }}
            >
              {paperData.abstract}
            </Typography>
          </Box>
        </Box>
      )}

      {/* 연관된 논문 */}
      {similarData && similarData.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          <SectionHeader title="연관된 논문" />
          <Box
            sx={
              isDesktop
                ? {
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    overflowX: "auto",
                    alignSelf: "stretch",
                    pb: "4px",
                  }
                : {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "12px",
                    alignSelf: "stretch",
                  }
            }
          >
            {similarData.map((paper, index) => (
              <SimilarPaperCard
                key={paper.paper_id ?? index}
                paper={paper}
                onClick={onRelatedPaperClick}
                isDesktop={isDesktop}
              />
            ))}
          </Box>
        </Box>
      )}

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
