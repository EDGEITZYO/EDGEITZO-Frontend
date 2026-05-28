import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type BookmarkFolder, type FolderDialogMode } from "../../types/saved";

interface FolderDialogProps {
  open: boolean;
  mode: FolderDialogMode;
  targetFolder: BookmarkFolder | null;
  onClose: () => void;
  onConfirm: (mode: FolderDialogMode, name?: string) => void;
}

const dialogPaperSx: SxProps<Theme> = {
  borderRadius: "20px",
  padding: "8px",
  minWidth: "400px",
};

const titleSx: SxProps<Theme> = {
  fontSize: "20px",
  fontWeight: 700,
  color: "static.black",
};

const confirmButtonSx = (mode: FolderDialogMode): SxProps<Theme> => ({
  borderRadius: "12px",
  fontWeight: 600,
  backgroundColor: mode === "delete" ? "error.main" : "static.black",
  color: "static.white",
  "&:hover": {
    backgroundColor: mode === "delete" ? "error.dark" : "label.neutral",
  },
  "&:disabled": {
    backgroundColor: "fill.normal",
    color: "label.assistive",
  },
});

const cancelButtonSx: SxProps<Theme> = {
  borderRadius: "12px",
  fontWeight: 600,
  color: "label.normal",
  borderColor: "line.normal",
  "&:hover": {
    borderColor: "label.normal",
    backgroundColor: "background.default",
  },
};

const DIALOG_CONFIG: Record<
  FolderDialogMode,
  { title: string; confirmLabel: string }
> = {
  create: { title: "파일 새로 생성", confirmLabel: "완료" },
  edit: { title: "파일명 수정", confirmLabel: "완료" },
  delete: {
    title: "파일 삭제",
    confirmLabel: "삭제",
  },
};

const FolderDialog = ({
  open,
  mode,
  targetFolder,
  onClose,
  onConfirm,
}: FolderDialogProps) => {
  const [name, setName] = useState(
    mode === "edit" && targetFolder ? targetFolder.name : "",
  );

  const config = DIALOG_CONFIG[mode];
  const isNameMode = mode === "create" || mode === "edit";
  const isConfirmDisabled = isNameMode && name.trim() === "";

  const handleConfirm = () => {
    onConfirm(mode, isNameMode ? name.trim() : undefined);
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") onClose();
      }}
      slotProps={{ paper: { sx: dialogPaperSx } }}
    >
      <DialogTitle>
        <Typography sx={titleSx}>{config.title}</Typography>
      </DialogTitle>

      <DialogContent>
        {mode === "delete" ? (
          <Typography
            sx={{ fontSize: "16px", color: "label.normal", lineHeight: "160%" }}
          >
            정말 해당 파일을 삭제하시나요? 삭제하시면 다시 복구가 어려워요.
            <br />
            파일 내 논문들의 북마크가 전체 해제돼요.
          </Typography>
        ) : (
          <Box sx={{ pt: "8px" }}>
            <TextField
              fullWidth
              placeholder="파일명을 입력해주세요"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: "24px", pb: "16px", gap: "8px" }}>
        <Button variant="outlined" sx={cancelButtonSx} onClick={onClose}>
          취소
        </Button>
        <Button
          variant="contained"
          sx={confirmButtonSx(mode)}
          onClick={handleConfirm}
          disabled={isConfirmDisabled}
          disableElevation
        >
          {config.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderDialog;
