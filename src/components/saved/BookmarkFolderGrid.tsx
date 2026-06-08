import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type SxProps, type Theme } from "@mui/material/styles";
import BookmarkFolderCard from "./BookmarkFolderCard";
import FolderDialog from "./FolderDialog";
import { type BookmarkFolder, type FolderDialogState } from "../../types/saved";

// ─── 목 데이터 ────────────────────────────────────────────
// TODO: API 연동 시 교체
const MOCK_FOLDERS: BookmarkFolder[] = [
  {
    id: "all",
    name: "전체 파일",
    representative_keywords: ["논문 키워드", "논문 키워드"],
    paper_count: 64,
    updated_at: "2달 전",
    created_at: "",
  },
  {
    id: "1",
    name: "미토콘드리아",
    representative_keywords: ["논문 키워드", "논문 키워드"],
    paper_count: 64,
    updated_at: "2달 전",
    created_at: "",
  },
  {
    id: "2",
    name: "분자생물학",
    representative_keywords: ["논문 키워드", "논문 키워드"],
    paper_count: 64,
    updated_at: "2달 전",
    created_at: "",
  },
  {
    id: "3",
    name: "노화치료",
    representative_keywords: ["논문 키워드", "논문 키워드"],
    paper_count: 64,
    updated_at: "2달 전",
    created_at: "",
  },
];

// ─── 스타일 ───────────────────────────────────────────────

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

// ─── 컴포넌트 ─────────────────────────────────────────────

const INITIAL_DIALOG_STATE: FolderDialogState = {
  open: false,
  mode: "create",
  targetFolder: null,
};

const BookmarkFolderGrid = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<BookmarkFolder[]>(MOCK_FOLDERS);
  const [dialogState, setDialogState] =
    useState<FolderDialogState>(INITIAL_DIALOG_STATE);

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
      // TODO: API 연동 시 교체
      const newFolder: BookmarkFolder = {
        id: Date.now().toString(),
        name,
        representative_keywords: [],
        paper_count: 0,
        updated_at: "방금",
        created_at: "",
      };
      setFolders((prev) => [...prev, newFolder]);
    } else if (mode === "edit" && name && dialogState.targetFolder) {
      // TODO: API 연동 시 교체
      setFolders((prev) =>
        prev.map((f) =>
          f.id === dialogState.targetFolder?.id ? { ...f, name } : f,
        ),
      );
    } else if (mode === "delete" && dialogState.targetFolder) {
      // TODO: API 연동 시 교체
      setFolders((prev) =>
        prev.filter((f) => f.id !== dialogState.targetFolder?.id),
      );
    }
    handleDialogClose();
  };

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
        {folders.map((folder) => (
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
