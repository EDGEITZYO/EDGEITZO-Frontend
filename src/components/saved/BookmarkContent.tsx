import { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookmarkFolderGrid from "./BookmarkFolderGrid";
import FolderDialog from "./FolderDialog";
import {
  type FolderDialogState,
  type BookmarkFolder,
  type FolderDialogMode,
} from "../../types/saved";
import { bookmarkApi } from "../../api/bookmark";

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  width: { lg: "914px", sm: "482px", xs: "100%" },
};

const titleFrameSx: SxProps<Theme> = {
  display: "flex",
  padding: "0 16px",
  alignItems: "center",
  gap: "8px",
  alignSelf: "stretch",
};

const titleSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: "36px",
  letterSpacing: "-0.528px",
  color: "label.normal",
};

const ALL_FOLDER: BookmarkFolder = {
  id: "all",
  name: "전체",
  created_at: "",
  paper_count: 0,
  representative_keywords: [],
  updated_at: "",
};

const INITIAL_DIALOG_STATE: FolderDialogState = {
  open: false,
  mode: "create",
  targetFolder: null,
};

const BookmarkContent = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pageSize = isDesktop ? 12 : 6;

  const [desktopPage, setDesktopPage] = useState(1);
  const [tabletPage, setTabletPage] = useState(1);
  const page = isDesktop ? desktopPage : tabletPage;
  const setPage = isDesktop ? setDesktopPage : setTabletPage;

  const queryClient = useQueryClient();
  const [dialogState, setDialogState] =
    useState<FolderDialogState>(INITIAL_DIALOG_STATE);

  const { data: folders, isPending } = useQuery({
    queryKey: ["saved-bookmark-folders"],
    queryFn: async () => {
      const res = await bookmarkApi.getSavedFolders();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: totalCount } = useQuery({
    queryKey: ["saved-bookmarks-total"],
    queryFn: async () => {
      const res = await bookmarkApi.getSavedBookmarks({ page: 1, size: 1 });
      return res.data.data.total;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: updateFolder } = useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) =>
      bookmarkApi.updateFolder(folderId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark-folder"] });
    },
  });

  const { mutate: deleteFolder } = useMutation({
    mutationFn: (folderId: string) => bookmarkApi.deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
    },
  });

  const handleMoreClick = (folder: BookmarkFolder, action: "delete") => {
    if (action === "delete") {
      setDialogState({ open: true, mode: "delete", targetFolder: folder });
    }
  };

  const handleRename = (folderId: string, name: string) => {
    updateFolder({ folderId, name });
  };

  const handleDialogClose = () => {
    setDialogState(INITIAL_DIALOG_STATE);
  };

  const handleDialogConfirm = (mode: FolderDialogMode) => {
    if (mode === "delete" && dialogState.targetFolder) {
      deleteFolder(dialogState.targetFolder.id);
    }
    handleDialogClose();
  };

  const foldersWithAll: BookmarkFolder[] = folders
    ? [{ ...ALL_FOLDER, paper_count: totalCount ?? 0 }, ...folders]
    : [{ ...ALL_FOLDER, paper_count: totalCount ?? 0 }];

  const pagedFolders = isMobile
    ? foldersWithAll
    : foldersWithAll.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = isMobile ? 1 : Math.ceil(foldersWithAll.length / pageSize);

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          py: "80px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      {/* 제목 — 데스크탑/태블릿에서만 표시 */}
      <Box sx={{ ...titleFrameSx, display: { xs: "none", sm: "flex" } }}>
        <Typography sx={titleSx}>북마크한 논문</Typography>
      </Box>

      <BookmarkFolderGrid
        folders={pagedFolders}
        onMoreClick={handleMoreClick}
        onRename={handleRename}
      />

      <FolderDialog
        key={`${dialogState.mode}-${dialogState.targetFolder?.id ?? "none"}`}
        open={dialogState.open}
        mode={dialogState.mode}
        targetFolder={dialogState.targetFolder}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />

      {/* 페이지네이션 — 모바일 제외, 페이지 2개 이상일 때만 */}
      {!isMobile && totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            padding: "0 16px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Box
                key={i}
                onClick={() => setPage(i + 1)}
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "345px",
                  backgroundColor:
                    page === i + 1 ? "primary.light" : "label.disable",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BookmarkContent;
