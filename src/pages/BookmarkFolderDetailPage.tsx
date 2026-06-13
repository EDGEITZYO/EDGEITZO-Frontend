import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import BookmarkFilterBar from "../components/saved/BookmarkFilterBar";
import FolderDialog from "../components/saved/FolderDialog";
import BookmarkPaperCard from "../components/saved/BookmarkPaperCard";
import { type FolderDialogState, type BookmarkFilter } from "../types/saved";
import { bookmarkApi } from "../api/bookmark";

const pageWrapperSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "background.paper",
};

const headerBarSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  px: "20px",
  height: 64,
  borderBottom: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.paper",
  flexShrink: 0,
};

const folderNameSx: SxProps<Theme> = {
  fontSize: "20px",
  fontWeight: 700,
  color: "static.black",
};

const contentSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  px: "216px",
  py: "31px",
  gap: "16px",
};

const totalCountSx: SxProps<Theme> = {
  fontSize: "24px",
  fontWeight: 600,
  color: "static.black",
};

const paperListSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "17px",
};

const INITIAL_DIALOG_STATE: FolderDialogState = {
  open: false,
  mode: "edit",
  targetFolder: null,
};

const BookmarkFolderDetailPage = () => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  const queryClient = useQueryClient();
  const [dialogState, setDialogState] =
    useState<FolderDialogState>(INITIAL_DIALOG_STATE);
  const [filter, setFilter] = useState<BookmarkFilter>({
    year: null,
    type: null,
    kci: null,
    sci: null,
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // 북마크 논문 목록 무한스크롤
  const {
    data: bookmarkPages,
    isPending: isBookmarksPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["saved-bookmarks", folderId, filter],
    queryFn: async ({ pageParam }) => {
      const res = await bookmarkApi.getSavedBookmarks({
        folder_id: folderId === "all" ? undefined : folderId,
        page: pageParam,
        size: 20,
        year: filter.year ?? undefined,
        type: filter.type ?? undefined,
        kci: filter.kci ?? undefined,
        sci: filter.sci ?? undefined,
      });
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.size);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    enabled: !!folderId,
    staleTime: 1000 * 60 * 5,
  });

  const papers = bookmarkPages?.pages.flatMap((page) => page.items) ?? [];

  // Intersection Observer — 마지막 5번째 아이템에서 미리 fetch
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
      navigate("/saved");
    },
    onError: () => {
      setSnackbarMessage("폴더 삭제에 실패했어요");
      setSnackbarOpen(true);
    },
  });

  const handleBack = () => navigate("/saved");

  const handleEdit = () => {
    if (!folder) return;
    setDialogState({ open: true, mode: "edit", targetFolder: folder });
  };

  const handleDelete = () => {
    if (!folder) return;
    setDialogState({ open: true, mode: "delete", targetFolder: folder });
  };

  const handleDialogClose = () => setDialogState(INITIAL_DIALOG_STATE);

  const handleDialogConfirm = (
    mode: FolderDialogState["mode"],
    name?: string,
  ) => {
    if (mode === "edit" && name) {
      updateFolder({ name });
    } else if (mode === "delete") {
      deleteFolder();
    }
    handleDialogClose();
  };

  const handleBookmarkRemove = (paperId: string) => {
    removeBookmark(paperId);
  };

  const handlePaperClick = (paperId: string) => {
    navigate(
      `/papers/${paperId}?returnTo=${encodeURIComponent(`/saved/bookmark/${folderId}`)}`,
    );
  };

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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

  return (
    <Box sx={pageWrapperSx}>
      <Box sx={headerBarSx}>
        <IconButton onClick={handleBack} sx={{ p: 0 }}>
          <ChevronLeftIcon sx={{ fontSize: 32, color: "static.black" }} />
        </IconButton>
        <Typography sx={folderNameSx}>
          {folderId === "all" ? "전체 파일" : (folder?.name ?? "")}
        </Typography>
      </Box>

      <Box sx={contentSx}>
        <Typography sx={totalCountSx}>
          논문{" "}
          {folderId === "all"
            ? (bookmarkPages?.pages[0]?.total ?? 0)
            : (folder?.paper_count ?? 0)}
          개
        </Typography>
        <BookmarkFilterBar
          filter={filter}
          onFilterChange={setFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {isBookmarksPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: "40px" }}>
            <CircularProgress />
          </Box>
        ) : papers.length > 0 ? (
          <Box sx={paperListSx}>
            {papers.map((paper, index) => (
              <Box
                key={paper.paper_id}
                ref={index === papers.length - 5 ? observerRef : null}
              >
                <BookmarkPaperCard
                  paper={paper}
                  onBookmarkRemove={handleBookmarkRemove}
                  onClick={handlePaperClick}
                />
              </Box>
            ))}
            {isFetchingNextPage && (
              <Box
                sx={{ display: "flex", justifyContent: "center", py: "20px" }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", py: "80px" }}>
            <Typography sx={{ fontSize: "16px", color: "label.alternative" }}>
              아직 북마크한 논문이 없어요
            </Typography>
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

      {showScrollTop && (
        <Box
          onClick={handleScrollTop}
          sx={{
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
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: 48, color: "static.white" }} />
        </Box>
      )}
    </Box>
  );
};

export default BookmarkFolderDetailPage;
