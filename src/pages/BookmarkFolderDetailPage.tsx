import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import BookmarkFilterBar from "../components/saved/BookmarkFilterBar";
import FolderDialog from "../components/saved/FolderDialog";
import PaperListCard from "../components/common/PaperListCard";
import { type FolderDialogState } from "../types/saved";
import { MOCK_PAPERS } from "../components/search/PaperListPanel";

// ─── 스타일 ───────────────────────────────────────────────

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

// ─── 목 데이터 ────────────────────────────────────────────
// TODO: API 연동 시 folderId로 폴더 정보 fetch하여 폴더명 표시
const MOCK_FOLDER_NAME = "전체 파일";

const INITIAL_DIALOG_STATE: FolderDialogState = {
  open: false,
  mode: "edit",
  targetFolder: null,
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const BookmarkFolderDetailPage = () => {
  const navigate = useNavigate();
  const { folderId } = useParams<{ folderId: string }>();
  const [dialogState, setDialogState] =
    useState<FolderDialogState>(INITIAL_DIALOG_STATE);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate("/saved");
  };

  const handleEdit = () => {
    setDialogState({
      open: true,
      mode: "edit",
      targetFolder: {
        id: folderId ?? "",
        name: MOCK_FOLDER_NAME,
        representative_keywords: [],
        paper_count: MOCK_PAPERS.length,
        updated_at: "",
        created_at: "",
      },
    });
  };

  const handleDelete = () => {
    setDialogState({
      open: true,
      mode: "delete",
      targetFolder: {
        id: folderId ?? "",
        name: MOCK_FOLDER_NAME,
        representative_keywords: [],
        paper_count: MOCK_PAPERS.length,
        updated_at: "",
        created_at: "",
      },
    });
  };

  const handleDialogClose = () => {
    setDialogState(INITIAL_DIALOG_STATE);
  };

  const handleDialogConfirm = (
    mode: FolderDialogState["mode"],
    name?: string,
  ) => {
    if (mode === "edit" && name) {
      // TODO: API 연동 시 폴더명 수정
      console.log("edit folder", folderId, name);
    } else if (mode === "delete") {
      // TODO: API 연동 시 폴더 삭제 후 /saved로 이동
      navigate("/saved");
    }
    handleDialogClose();
  };

  const handleBookmark = (paperId: string) => {
    // TODO: API 연동 시 북마크 처리
    console.log("bookmark", paperId);
  };

  const handlePaperClick = (paperId: string) => {
    navigate(
      `/papers/${paperId}?returnTo=${encodeURIComponent(`/saved/bookmark/${folderId}`)}`,
    );
  };

  return (
    <Box sx={pageWrapperSx}>
      <Box sx={headerBarSx}>
        <IconButton onClick={handleBack} sx={{ p: 0 }}>
          <ChevronLeftIcon sx={{ fontSize: 32, color: "static.black" }} />
        </IconButton>
        <Typography sx={folderNameSx}>{MOCK_FOLDER_NAME}</Typography>
      </Box>
      <Box sx={contentSx}>
        <Typography sx={totalCountSx}>논문 {MOCK_PAPERS.length}개</Typography>
        <BookmarkFilterBar onEdit={handleEdit} onDelete={handleDelete} />
        <Box sx={paperListSx}>
          {MOCK_PAPERS.map((paper) => (
            <PaperListCard
              key={paper.id}
              paper={paper}
              onBookmark={handleBookmark}
              onClick={handlePaperClick}
            />
          ))}
        </Box>
      </Box>
      <FolderDialog
        key={`${dialogState.mode}-${dialogState.targetFolder?.id ?? "new"}`}
        open={dialogState.open}
        mode={dialogState.mode}
        targetFolder={dialogState.targetFolder}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
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
