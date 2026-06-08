import { useState, useEffect, useRef } from "react";
import { Box, Typography, Snackbar, Button } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import RecentPaperCard from "../common/RecentPaperCard";
import { type PeriodMode } from "../../types/saved";

// TODO: [이슈 B] API 연동 시 MockRecentPaper → RecentPaper로 교체
// TODO: [이슈 B] API 연동 시 제거
interface MockRecentPaper {
  id: string;
  source: string;
  date: string;
  title: string;
  authors: string[];
  keywords: string[];
  kciType: string;
  citationCount: number;
  readAt: string;
  isBookmarked: boolean;
  publishYear: number;
  citationForChart: number;
  paperType?: string;
}

// ─── 목 데이터 ────────────────────────────────────────────
// TODO: API 연동 시 교체
const MOCK_READ_DATES = [
  "2026.06.04",
  "2026.06.03",
  "2026.06.02",
  "2026.06.01",
  "2026.05.31",
];

const MOCK_RECENT_PAPERS: MockRecentPaper[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: String(i + 1),
    source: "2024한국분자세포생물학회 논문지",
    date: "2024.10.16",
    title: "미토콘드리아 막전위 손실이 세포 노화에 미치는 영향",
    authors: ["박민수", "김철수", "이영희", "홍길동"],
    keywords: ["논문 키워드", "논문 키워드"],
    kciType: "KCI O",
    citationCount: 0,
    readAt: `${MOCK_READ_DATES[i % 5]}.00:00`,
    isBookmarked: false,
    publishYear: 2024 - (i % 5),
    citationForChart: i % 10,
    paperType: i % 2 === 0 ? "학위논문" : "저널",
  }),
);

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

// ─── 날짜별 그루핑 ────────────────────────────────────────

const groupByDate = <T extends { readAt: string }>(
  papers: T[],
): Record<string, T[]> => {
  return papers.reduce<Record<string, T[]>>((acc, paper) => {
    const dateKey = paper.readAt.split(".").slice(0, 3).join(".");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(paper);
    return acc;
  }, {});
};

const formatDateLabel = (dateKey: string): string => {
  const [year, month, day] = dateKey.split(".");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${dateKey} (${days[date.getDay()]})`;
};

// ─── 컴포넌트 ─────────────────────────────────────────────

interface RecentPaperListViewProps {
  periodMode: PeriodMode;
  onPaperClick: (paperId: string) => void;
}

const LOAD_SIZE = 20;

// TODO: API 연동 시 periodMode, currentDate로 해당 기간 데이터 fetch
const RecentPaperListView = ({
  periodMode,
  onPaperClick,
}: RecentPaperListViewProps) => {
  const [papers, setPapers] = useState<MockRecentPaper[]>(
    MOCK_RECENT_PAPERS.slice(0, LOAD_SIZE),
  );
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deletedPaper, setDeletedPaper] = useState<MockRecentPaper | null>(
    null,
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPapers((prev) => {
            const next = MOCK_RECENT_PAPERS.slice(0, prev.length + LOAD_SIZE);
            if (next.length >= MOCK_RECENT_PAPERS.length) setHasMore(false);
            return next;
          });
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  const handleBookmark = (paperId: string) => {
    // TODO: API 연동 시 북마크 처리
    setPapers((prev) =>
      prev.map((p) =>
        p.id === paperId ? { ...p, isBookmarked: !p.isBookmarked } : p,
      ),
    );
  };

  const handleDelete = (paperId: string) => {
    const target = papers.find((p) => p.id === paperId);
    if (!target) return;
    setPapers((prev) => prev.filter((p) => p.id !== paperId));
    setDeletedPaper(target);
    setSnackbarOpen(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setDeletedPaper(null);
      setSnackbarOpen(false);
    }, 5000);
  };

  const handleUndo = () => {
    if (!deletedPaper) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setPapers((prev) => {
      const restored = [...prev, deletedPaper].sort((a, b) =>
        b.readAt.localeCompare(a.readAt),
      );
      return restored;
    });
    setDeletedPaper(null);
    setSnackbarOpen(false);
  };

  const grouped =
    periodMode === "week" ? groupByDate(papers) : groupByDate(papers);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const isEmpty = papers.length === 0;

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
                  <RecentPaperCard
                    key={paper.id}
                    paper={paper}
                    onBookmark={handleBookmark}
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

      {/* 맨위로 버튼 */}
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

      {/* 삭제 스낵바 */}
      <Snackbar
        open={snackbarOpen}
        message="논문이 삭제되었어요"
        action={
          <Button color="inherit" size="small" onClick={handleUndo}>
            실행 취소
          </Button>
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export type { MockRecentPaper };
export { MOCK_RECENT_PAPERS };
export default RecentPaperListView;
