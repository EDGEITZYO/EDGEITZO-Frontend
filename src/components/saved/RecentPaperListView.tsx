import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SavedPaperCard from "./SavedPaperCard";
import {
  type RecentPaper,
  type PeriodMode,
  type FolderDialogState,
} from "../../types/saved";
import { bookmarkApi } from "../../api/bookmark";
import BookmarkFolderSelectDialog from "../common/BookmarkFolderSelectDialog";
import FolderDialog from "./FolderDialog";
import { bookmarkKeys, savedKeys } from "../../queries/keys";
import { savedApi } from "../../api/saved";

// ─── 스타일 ───────────────────────────────────────────────

const dateLabelSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "static.black",
  mb: "8px",
};

const formatDateLabel = (dateKey: string): string => {
  const [year, month, day] = dateKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${year}.${month}.${day} (${days[date.getDay()]})`;
};

const INITIAL_DIALOG_STATE: FolderDialogState = {
  open: false,
  mode: "bookmark-delete",
  targetFolder: null,
};

// ─── 컴포넌트 ─────────────────────────────────────────────

interface RecentPaperListViewProps {
  periodMode: PeriodMode;
  papers: RecentPaper[];
  isPending: boolean;
  isError: boolean;
  onPaperClick: (paperId: string) => void;
}

const RecentPaperListView = ({
  periodMode,
  papers,
  isPending,
  isError,
  onPaperClick,
}: RecentPaperListViewProps) => {
  const [bookmarkPaperId, setBookmarkPaperId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [dialogState, setDialogState] =
    useState<FolderDialogState>(INITIAL_DIALOG_STATE);
  const [pendingRemovePaperId, setPendingRemovePaperId] = useState<
    string | null
  >(null);

  const { mutate: removeBookmark } = useMutation({
    mutationFn: (paperId: string) => bookmarkApi.removeBookmark(paperId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: savedKeys.all });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedList() });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedFolders() });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedTotal() });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.check("") });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders() });
    },
  });

  const { mutate: deleteRecentPaper } = useMutation({
    mutationFn: (paperId: string) => savedApi.deleteRecentPaper(paperId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedKeys.all });
    },
  });

  const handleBookmark = (paperId: string) => {
    const paper = papers.find((p) => p.paper_id === paperId);
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
    deleteRecentPaper(paperId);
  };

  const grouped = papers.reduce<Record<string, RecentPaper[]>>((acc, paper) => {
    const dateKey = paper.viewed_at.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(paper);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

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

  if (papers.length === 0) {
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

      <BookmarkFolderSelectDialog
        open={bookmarkPaperId !== null}
        onClose={() => setBookmarkPaperId(null)}
        paperId={bookmarkPaperId ?? ""}
        onBookmarkAdded={() => {
          queryClient.invalidateQueries({ queryKey: savedKeys.all });
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
