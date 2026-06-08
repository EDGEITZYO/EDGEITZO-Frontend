import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { useQuery } from "@tanstack/react-query";
import { bookmarkApi } from "../../api/bookmark";
import { type BookmarkFolder } from "../../types/saved";

interface BookmarkFolderSelectDialogProps {
  open: boolean;
  onClose: () => void;
  paperId: string;
  onBookmarkAdded: () => void;
}

const BookmarkFolderSelectDialog = ({
  open,
  onClose,
  paperId,
  onBookmarkAdded,
}: BookmarkFolderSelectDialogProps) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { data: folders, isPending } = useQuery({
    queryKey: ["bookmark-folders"],
    queryFn: async () => {
      const res = await bookmarkApi.getFolders();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: open,
  });

  const handleFolderSelect = async (folder: BookmarkFolder) => {
    try {
      await bookmarkApi.addBookmark(paperId, folder.id);
      onBookmarkAdded();
      setSnackbarMessage("북마크에 추가되었습니다");
      setSnackbarOpen(true);
      onClose();
    } catch {
      setSnackbarMessage("북마크 추가에 실패했어요");
      setSnackbarOpen(true);
    }
  };

  const handleAddFolder = () => {
    // TODO: 폴더 생성 다이얼로그 연결 (Saved 이슈에서 처리)
    console.log("폴더 추가하기");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              minWidth: "320px",
              maxWidth: "400px",
              width: "100%",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h5" sx={{ color: "label.strong" }}>
            폴더 선택
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {isPending ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: "20px" }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {folders?.map((folder) => (
                <Box
                  key={folder.id}
                  onClick={() => handleFolderSelect(folder)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "fill.normal" },
                  }}
                >
                  <FolderOutlinedIcon
                    sx={{ fontSize: "20px", color: "label.alternative" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "label.strong", fontWeight: 500 }}
                    >
                      {folder.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "label.alternative" }}
                    >
                      {folder.paper_count}개
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddFolder}
                sx={{
                  justifyContent: "flex-start",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  color: "label.alternative",
                  "&:hover": { backgroundColor: "fill.normal" },
                }}
              >
                폴더 추가하기
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default BookmarkFolderSelectDialog;
