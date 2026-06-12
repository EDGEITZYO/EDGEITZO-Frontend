import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookmarkFolderCard from "./BookmarkFolderCard";
import FolderDialog from "./FolderDialog";
import { type FolderDialogState, type BookmarkFolder } from "../../types/saved";
import { bookmarkApi } from "../../api/bookmark";

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "24px 40px",
  flex: 1,
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleSx: SxProps<Theme> = {
  fontSize: "24px",
  fontWeight: 700,
  color: "static.black",
};

const addButtonSx: SxProps<Theme> = {
  borderRadius: "12px",
  backgroundColor: "static.black",
  color: "static.white",
  fontWeight: 600,
  fontSize: "14px",
  gap: "4px",
  px: "16px",
  py: "8px",
  "&:hover": { backgroundColor: "label.neutral" },
};

const gridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "27px",
};

const ALL_FOLDER: BookmarkFolder = {
  id: "all",
  name: "전체 파일",
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

const BookmarkFolderGrid = () => {
  const navigate = useNavigate();
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

  const { mutate: createFolder } = useMutation({
    mutationFn: (name: string) => bookmarkApi.createFolder(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
    },
  });

  const { mutate: updateFolder } = useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) =>
      bookmarkApi.updateFolder(folderId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
    },
  });

  const { mutate: deleteFolder } = useMutation({
    mutationFn: (folderId: string) => bookmarkApi.deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-bookmark-folders"] });
    },
  });

  const handleFolderClick = (folderId: string) => {
    navigate(`/saved/bookmark/${folderId}`);
  };

  const handleMoreClick = (
    folder: BookmarkFolder,
    action: "edit" | "delete",
  ) => {
    setDialogState({ open: true, mode: action, targetFolder: folder });
  };

  const handleAddClick = () => {
    setDialogState({ open: true, mode: "create", targetFolder: null });
  };

  const handleDialogClose = () => {
    setDialogState(INITIAL_DIALOG_STATE);
  };

  const handleDialogConfirm = (
    mode: FolderDialogState["mode"],
    name?: string,
  ) => {
    if (mode === "create" && name) {
      createFolder(name);
    } else if (mode === "edit" && name && dialogState.targetFolder) {
      updateFolder({ folderId: dialogState.targetFolder.id, name });
    } else if (mode === "delete" && dialogState.targetFolder) {
      deleteFolder(dialogState.targetFolder.id);
    }
    handleDialogClose();
  };

  const foldersWithAll = folders
    ? [{ ...ALL_FOLDER, paper_count: totalCount ?? 0 }, ...folders]
    : [{ ...ALL_FOLDER, paper_count: totalCount ?? 0 }];

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
      <Box sx={headerSx}>
        <Typography sx={titleSx}>북마크한 논문</Typography>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          sx={addButtonSx}
          onClick={handleAddClick}
        >
          파일 생성하기
        </Button>
      </Box>

      <Box sx={gridSx}>
        {foldersWithAll.map((folder) => (
          <BookmarkFolderCard
            key={folder.id}
            folder={folder}
            onClick={handleFolderClick}
            onMoreClick={handleMoreClick}
          />
        ))}
      </Box>

      <FolderDialog
        key={`${dialogState.mode}-${dialogState.targetFolder?.id ?? "new"}`}
        open={dialogState.open}
        mode={dialogState.mode}
        targetFolder={dialogState.targetFolder}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </Box>
  );
};

export default BookmarkFolderGrid;
