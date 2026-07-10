import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SavedPaperCard from "./SavedPaperCard";
import { type RecentPaper, type PeriodMode } from "../../types/saved";
import { savedApi } from "../../api/saved";
import { formatDateParam } from "../../utils/savedUtils";
import { bookmarkApi } from "../../api/bookmark";
import BookmarkFolderSelectDialog from "../common/BookmarkFolderSelectDialog";
import FolderDialog from "./FolderDialog";
import { type FolderDialogState } from "../../types/saved";

const PAGE_SIZE = 10;

// ─── 페이지네이션 유틸 ────────────────────────────────────

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): (number | "...")[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "...")[] = [];

  if (currentPage <= 5) {
    for (let i = 1; i <= Math.min(5, totalPages); i++) items.push(i);
    if (totalPages > 5) {
      items.push("...");
      items.push(totalPages);
    }
  } else if (currentPage >= totalPages - 4) {
    items.push(1);
    items.push("...");
    for (let i = totalPages - 4; i <= totalPages; i++) items.push(i);
  } else {
    items.push(1);
    items.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
    items.push("...");
    items.push(totalPages);
  }

  return items;
};

// ─── 스타일 ───────────────────────────────────────────────

const dateLabelSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "static.black",
  mb: "8px",
};

const paginationSx: SxProps<Theme> = {
  display: "flex",
  padding: "0 16px",
  alignItems: "center",
  gap: "2px",
};

const pageNumSx = (isActive: boolean): SxProps<Theme> => ({
  display: "flex",
  width: "24px",
  height: "24px",
  flexDirection: "column",
  justifyContent: "center",
  color: isActive ? "primary.light" : "label.alternative",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
  cursor: "pointer",
});

const pageArrowSx = (enabled: boolean): SxProps<Theme> => ({
  display: "flex",
  width: "24px",
  height: "24px",
  padding: "4px 6px",
  justifyContent: "center",
  alignItems: "center",
  cursor: enabled ? "pointer" : "default",
  color: enabled ? "label.alternative" : "line.normal",
});

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

const INITIAL_DIALOG_STATE: FolderDialogState = {
  open: false,
  mode: "bookmark-delete",
  targetFolder: null,
};

const RecentPaperListView = ({
  periodMode,
  currentDate,
  onPaperClick,
}: RecentPaperListViewProps) => {
  const [page, setPage] = useState(1);
  const [bookmarkPaperId, setBookmarkPaperId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const [dialogState, setDialogState] =
    useState<FolderDialogState>(INITIAL_DIALOG_STATE);
  const [pendingRemovePaperId, setPendingRemovePaperId] = useState<
    string | null
  >(null);

  const dateParam = formatDateParam(currentDate);

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

  const { mutate: removeBookmark } = useMutation({
    mutationFn: (paperId: string) => bookmarkApi.removeBookmark(paperId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recent-papers"] });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmarks-total"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark-folders"] });
    },
  });

  const allPapers: RecentPaper[] = data?.groups.flatMap((g) => g.papers) ?? [];
  const totalPages = Math.ceil(allPapers.length / PAGE_SIZE);
  const pagedPapers = allPapers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleBookmark = (paperId: string) => {
    const paper = allPapers.find((p) => p.paper_id === paperId);
    if (paper?.bookmarked_at !== null) {
      setPendingRemovePaperId(paperId);
      setDialogState({
        open: true,
        mode: "bookmark-delete",
        targetFolder: null,
      });
    } else {
      setBookmarkPaperId(paperId);
    }
  };

  const handleDialogConfirm = () => {
    if (pendingRemovePaperId) {
      removeBookmark(pendingRemovePaperId);
      setPendingRemovePaperId(null);
    }
    setDialogState(INITIAL_DIALOG_STATE);
  };

  const handleDialogClose = () => {
    setPendingRemovePaperId(null);
    setDialogState(INITIAL_DIALOG_STATE);
  };

  const handleDelete = (paperId: string) => {
    // TODO: 최근 읽은 논문 삭제 API 백엔드 미구현
    console.log("delete", paperId);
  };

  // 날짜별 그루핑 (pagedPapers 기준)
  const grouped = pagedPapers.reduce<Record<string, RecentPaper[]>>(
    (acc, paper) => {
      const dateKey = paper.viewed_at.split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(paper);
      return acc;
    },
    {},
  );
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const paginationItems = getPaginationItems(page, totalPages);

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: "80px",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: "80px",
          width: "100%",
        }}
      >
        <Typography sx={{ fontSize: "16px", color: "label.alternative" }}>
          데이터를 불러오지 못했어요. 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  if (allPapers.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: "80px",
          width: "100%",
        }}
      >
        <Typography sx={{ fontSize: "18px", color: "label.assistive" }}>
          {periodMode === "day"
            ? "이 날 읽은 논문이 없어요"
            : "이번 주 읽은 논문이 없어요"}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        {sortedDates.map((dateKey) => (
          <Box key={dateKey}>
            {periodMode === "week" && (
              <Typography sx={dateLabelSx}>
                {formatDateLabel(dateKey)}
              </Typography>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
        ))}
      </Box>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box
          sx={{
            ...paginationSx,
            justifyContent: "center",
            width: "100%",
            mt: "8px",
          }}
        >
          <Box
            sx={pageArrowSx(page > 1)}
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 16 }} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {paginationItems.map((item, i) =>
              item === "..." ? (
                <Typography key={`ellipsis-${i}`} sx={pageNumSx(false)}>
                  ...
                </Typography>
              ) : (
                <Typography
                  key={item}
                  sx={pageNumSx(page === item)}
                  onClick={() => setPage(item as number)}
                >
                  {item}
                </Typography>
              ),
            )}
          </Box>
          <Box
            sx={pageArrowSx(page < totalPages)}
            onClick={() => {
              if (page < totalPages) setPage(page + 1);
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      )}

      <BookmarkFolderSelectDialog
        open={bookmarkPaperId !== null}
        onClose={() => setBookmarkPaperId(null)}
        paperId={bookmarkPaperId ?? ""}
        onBookmarkAdded={() => {
          queryClient.invalidateQueries({ queryKey: ["recent-papers"] });
          setBookmarkPaperId(null);
        }}
      />
      <FolderDialog
        key={dialogState.mode}
        open={dialogState.open}
        mode={dialogState.mode}
        targetFolder={null}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
};

export default RecentPaperListView;
