import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { type SxProps, type Theme, useTheme } from "@mui/material/styles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TopNavBar from "../components/layout/TopNavBar";
import BookmarkFilterBar from "../components/saved/BookmarkFilterBar";
import SavedPaperCard from "../components/saved/SavedPaperCard";
import FolderDialog from "../components/saved/FolderDialog";
import { type BookmarkFilter, type FolderDialogState } from "../types/saved";
import { bookmarkApi } from "../api/bookmark";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const PAGE_SIZE = 10;

const INITIAL_DIALOG_STATE: FolderDialogState = {
  open: false,
  mode: "delete",
  targetFolder: null,
};

const NARROW_BREAKPOINT = "(max-width: 976px)";

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

// ─── 스타일 ──────────────────────────────────────────────

const pageWrapperSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "background.paper",
};

const contentSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  pt: "170px",
  pb: "64px",
};

const filterRowSx = (isNarrow: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: isNarrow ? "flex-start" : "center",
  flexDirection: isNarrow ? "column" : "row",
  gap: "9px",
  width: isNarrow ? "475px" : "914px",
});

const countFrameSx: SxProps<Theme> = {
  display: "flex",
  padding: "0 4px",
  alignItems: "center",
  gap: "8px",
  flex: "1 0 0",
};

const countTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.normal",
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: "36px",
  letterSpacing: "-0.528px",
};

const listSx = (isNarrow: boolean, isMobile: boolean): SxProps<Theme> => ({
  display: "flex",
  width: isMobile ? "100%" : isNarrow ? "475px" : "914px",
  padding: "16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: isMobile ? "16px" : "8px",
  borderRadius: "12px",
  border: isMobile ? "none" : "1px solid #FAFAFC",
  backgroundColor: "static.white",
  backdropFilter: "blur(2.9px)",
  boxSizing: "border-box",
});

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

const mobileHeaderSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  px: "16px",
  py: "16px",
};

const BookmarkFolderDetailPage = () => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isNarrow = useMediaQuery(NARROW_BREAKPOINT) && !isMobile;

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<BookmarkFilter>({
    year: null,
    type: null,
    kci: null,
    sci: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [dialogState, setDialogState] =
    useState<FolderDialogState>(INITIAL_DIALOG_STATE);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // 필터 변경 시 페이지 초기화
  const handleFilterChange = (newFilter: BookmarkFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  // 폴더 단건 조회
  const { data: folder, isPending: isFolderPending } = useQuery({
    queryKey: ["bookmark-folder", folderId],
    queryFn: async () => {
      const res = await bookmarkApi.getFolder(folderId!);
      return res.data.data;
    },
    enabled: !!folderId && folderId !== "all",
    staleTime: 1000 * 60 * 5,
  });

  // 북마크 논문 목록
  const { data: bookmarkData, isPending: isBookmarksPending } = useQuery({
    queryKey: ["saved-bookmarks", folderId, filter, page],
    queryFn: async () => {
      const res = await bookmarkApi.getSavedBookmarks({
        folder_id: folderId === "all" ? undefined : folderId,
        page,
        size: PAGE_SIZE,
        year: filter.year ?? undefined,
        type: filter.type ?? undefined,
        kci: filter.kci ?? undefined,
        sci: filter.sci ?? undefined,
      });
      return res.data.data;
    },
    enabled: !!folderId,
    staleTime: 1000 * 60 * 5,
  });

  const papers = bookmarkData?.items ?? [];
  const totalCount = bookmarkData?.total ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // 북마크 삭제
  const { mutate: removeBookmark } = useMutation({
    mutationFn: (paperId: string) => bookmarkApi.removeBookmark(paperId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["saved-bookmarks", folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmarks", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["bookmark-folder", folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmarks-total"] });
      setSnackbarMessage("북마크가 삭제되었어요");
      setSnackbarOpen(true);
    },
    onError: () => {
      setSnackbarMessage("북마크 삭제에 실패했어요");
      setSnackbarOpen(true);
    },
  });

  // 폴더 수정
  const { mutate: updateFolder } = useMutation({
    mutationFn: ({ name }: { name: string }) =>
      bookmarkApi.updateFolder(folderId!, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmark-folder", folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
    },
    onError: () => {
      setSnackbarMessage("폴더 수정에 실패했어요");
      setSnackbarOpen(true);
    },
  });

  // 폴더 삭제
  const { mutate: deleteFolder } = useMutation({
    mutationFn: () => bookmarkApi.deleteFolder(folderId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
      navigate("/saved/bookmark");
    },
    onError: () => {
      setSnackbarMessage("폴더 삭제에 실패했어요");
      setSnackbarOpen(true);
    },
  });

  const handleBack = () => navigate("/saved/bookmark");

  const handleEditingCommit = () => {
    const trimmed = editingName.trim();
    if (trimmed && trimmed !== folder?.name) {
      updateFolder({ name: trimmed });
    }
    setIsEditing(false);
  };

  const handleEditingCancel = () => setIsEditing(false);

  const handleMenuEdit = () => {
    setEditingName(folder?.name ?? "");
    setIsEditing(true);
  };

  const handleMenuDelete = () => {
    if (!folder) return;
    setDialogState({ open: true, mode: "delete", targetFolder: folder });
  };

  const handleDialogClose = () => setDialogState(INITIAL_DIALOG_STATE);

  const handleDialogConfirm = () => {
    deleteFolder();
    handleDialogClose();
  };

  const handlePaperClick = (paperId: string) => {
    navigate(
      `/papers/${paperId}?returnTo=${encodeURIComponent(`/saved/bookmark/${folderId}`)}`,
    );
  };

  const handleBookmarkToggle = (paperId: string) => {
    removeBookmark(paperId);
  };

  const paginationItems = getPaginationItems(page, totalPages);

  const folderName = folderId === "all" ? "전체 파일" : (folder?.name ?? "");

  if (isFolderPending && folderId !== "all") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 모바일
  if (isMobile) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <Box sx={mobileHeaderSx}>
          <IconButton
            sx={{ p: 0, width: "28px", height: "28px" }}
            onClick={handleBack}
          >
            <CloseIcon sx={{ fontSize: 24, color: "label.normal" }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "29px",
              letterSpacing: "-0.378px",
              color: "label.normal",
            }}
          >
            {folderName}
          </Typography>
        </Box>

        <Box
          sx={{
            pb: "64px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {isBookmarksPending ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: "40px" }}>
              <CircularProgress />
            </Box>
          ) : papers.length > 0 ? (
            <Box sx={listSx(false, true)}>
              {papers.map((paper) => (
                <SavedPaperCard
                  key={paper.paper_id}
                  variant="bookmark"
                  paper={paper}
                  onBookmarkToggle={handleBookmarkToggle}
                  onClick={handlePaperClick}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", py: "80px" }}>
              <Typography sx={{ fontSize: "16px", color: "label.alternative" }}>
                아직 북마크한 논문이 없어요
              </Typography>
            </Box>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Box sx={{ ...paginationSx, justifyContent: "center" }}>
              <Box
                sx={pageArrowSx(page > 1)}
                onClick={() => page > 1 && setPage(page - 1)}
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
                onClick={() => page < totalPages && setPage(page + 1)}
              >
                <ChevronRightIcon sx={{ fontSize: 16 }} />
              </Box>
            </Box>
          )}
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Box>
    );
  }

  // 데스크탑 / 태블릿
  return (
    <Box sx={pageWrapperSx}>
      <TopNavBar
        onBack={handleBack}
        title={folderId === "all" ? "전체" : undefined}
        folderConfig={
          folderId !== "all"
            ? {
                name: folderName,
                isEditing,
                editingName,
                onEditingNameChange: setEditingName,
                onEditingCommit: handleEditingCommit,
                onEditingCancel: handleEditingCancel,
                onMenuEdit: handleMenuEdit,
                onMenuDelete: handleMenuDelete,
              }
            : undefined
        }
      />

      <Box sx={contentSx}>
        {/* 논문 개수 + 필터 */}
        <Box sx={filterRowSx(isNarrow)}>
          <Box sx={countFrameSx}>
            <Typography sx={countTextSx}>논문 {totalCount}개</Typography>
          </Box>
          <BookmarkFilterBar
            filter={filter}
            onFilterChange={handleFilterChange}
          />
        </Box>

        {/* 논문 리스트 */}
        {isBookmarksPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: "40px" }}>
            <CircularProgress />
          </Box>
        ) : papers.length > 0 ? (
          <Box sx={listSx(isNarrow, false)}>
            {papers.map((paper) => (
              <SavedPaperCard
                key={paper.paper_id}
                variant="bookmark"
                paper={paper}
                onBookmarkToggle={handleBookmarkToggle}
                onClick={handlePaperClick}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", py: "80px" }}>
            <Typography sx={{ fontSize: "16px", color: "label.alternative" }}>
              아직 북마크한 논문이 없어요
            </Typography>
          </Box>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Box sx={paginationSx}>
            <Box
              sx={pageArrowSx(page > 1)}
              onClick={() => page > 1 && setPage(page - 1)}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                alignSelf: "stretch",
              }}
            >
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
              onClick={() => page < totalPages && setPage(page + 1)}
            >
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        )}
      </Box>

      <FolderDialog
        key={`${dialogState.mode}-${dialogState.targetFolder?.id ?? "none"}`}
        open={dialogState.open}
        mode={dialogState.mode}
        targetFolder={dialogState.targetFolder}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default BookmarkFolderDetailPage;
