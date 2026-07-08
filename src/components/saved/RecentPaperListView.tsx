import { useRef, useState, useEffect } from "react";
import { Box, Typography, Snackbar, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SavedPaperCard from "./SavedPaperCard";
import { type RecentPaper, type PeriodMode } from "../../types/saved";
import { savedApi } from "../../api/saved";
import { formatDateParam } from "../../utils/savedUtils";
import { bookmarkApi } from "../../api/bookmark";
import BookmarkFolderSelectDialog from "../common/BookmarkFolderSelectDialog";

// ─── 스타일 ───────────────────────────────────────────────

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  pb: "40px",
  overflow: "visible",
};

const dateLabelSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "static.black",
  mb: "8px",
};

const scrollTopButtonSx: SxProps<Theme> = {
  position: "fixed",
  bottom: "50px",
  right: "105px",
  width: "56px",
  height: "56px",
  borderRadius: "50px",
  backgroundColor: "#31333F",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  zIndex: 100,
};

const formatDateLabel = (dateKey: string): string => {
  const [year, month, day] = dateKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${year}.${month}.${day} (${days[date.getDay()]})`;
};

// ─── 컴포넌트 ─────────────────────────────────────────────

interface RecentPaperListViewProps {
  periodMode: PeriodMode;
  currentDate: Date;
  onPaperClick: (paperId: string) => void;
}

const LOAD_SIZE = 20;

const RecentPaperListView = ({
  periodMode,
  currentDate,
  onPaperClick,
}: RecentPaperListViewProps) => {
  const [displayCount, setDisplayCount] = useState(LOAD_SIZE);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const dateParam = formatDateParam(currentDate);

  const [bookmarkPaperId, setBookmarkPaperId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutate: removeBookmark } = useMutation({
    mutationFn: (paperId: string) => bookmarkApi.removeBookmark(paperId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recent-papers"] });
    },
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["recent-papers", periodMode, dateParam],
    queryFn: async () => {
      const res = await savedApi.getRecentPapers({
        period: periodMode,
        date: dateParam,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 전체 papers flat 리스트
  const allPapers: RecentPaper[] = data?.groups.flatMap((g) => g.papers) ?? [];

  // 프론트에서 20개씩 slice
  const displayPapers = allPapers.slice(0, displayCount);

  // Intersection Observer — 하단 도달 시 20개씩 추가
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < allPapers.length) {
          setDisplayCount((prev) => prev + LOAD_SIZE);
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [displayCount, allPapers.length]);

  const handleBookmark = (paperId: string) => {
    const paper = allPapers.find((p) => p.paper_id === paperId);
    if (paper?.bookmarked_at !== null) {
      removeBookmark(paperId);
    } else {
      setBookmarkPaperId(paperId);
    }
  };

  const handleDelete = (paperId: string) => {
    // TODO: [중간 수정] 최근 읽은 논문 삭제 API 백엔드 미구현
    console.log("delete", paperId);
    setSnackbarOpen(true);
  };

  // 날짜별 그루핑 (displayPapers 기준)
  const grouped = displayPapers.reduce<Record<string, RecentPaper[]>>(
    (acc, paper) => {
      const dateKey = paper.viewed_at.split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(paper);
      return acc;
    },
    {},
  );
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: "80px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: "80px" }}>
        <Typography sx={{ fontSize: "16px", color: "label.alternative" }}>
          데이터를 불러오지 못했어요. 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  const isEmpty = allPapers.length === 0;

  return (
    <>
      <Box sx={containerSx}>
        {isEmpty ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Typography sx={{ fontSize: "18px", color: "label.assistive" }}>
              {periodMode === "day"
                ? "이 날 읽은 논문이 없어요"
                : "이번 주 읽은 논문이 없어요"}
            </Typography>
          </Box>
        ) : (
          sortedDates.map((dateKey) => (
            <Box key={dateKey}>
              {periodMode === "week" && (
                <Typography sx={dateLabelSx}>
                  {formatDateLabel(dateKey)}
                </Typography>
              )}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "17px" }}
              >
                {grouped[dateKey].map((paper) => (
                  <SavedPaperCard
                    key={paper.paper_id}
                    variant="recent"
                    paper={paper}
                    onBookmarkToggle={handleBookmark}
                    onDelete={handleDelete}
                    onClick={onPaperClick}
                  />
                ))}
              </Box>
            </Box>
          ))
        )}
        <Box ref={observerRef} sx={{ height: "1px" }} />
      </Box>

      {showScrollTop && (
        <Box
          sx={scrollTopButtonSx}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Typography
            sx={{ fontSize: "24px", color: "static.white", lineHeight: 1 }}
          >
            ∧
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="삭제 기능은 준비 중이에요"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <BookmarkFolderSelectDialog
        open={bookmarkPaperId !== null}
        onClose={() => setBookmarkPaperId(null)}
        paperId={bookmarkPaperId ?? ""}
        onBookmarkAdded={() => {
          queryClient.invalidateQueries({ queryKey: ["recent-papers"] });
          setBookmarkPaperId(null);
        }}
      />
    </>
  );
};

export default RecentPaperListView;
