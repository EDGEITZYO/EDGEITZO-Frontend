import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  width: "480px",
  padding: "24px 20px",
  borderRadius: "12px",
  backgroundColor: "background.default",
  margin: 0,
};

const innerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "32px",
  alignSelf: "stretch",
};

const titleRowSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "stretch",
  position: "relative",
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

const closeButtonSx: SxProps<Theme> = {
  position: "absolute",
  right: 0,
  display: "flex",
  width: "32px",
  height: "32px",
  justifyContent: "center",
  alignItems: "center",
  p: 0,
  flexShrink: 0,
};

const deleteButtonSx: SxProps<Theme> = {
  display: "flex",
  height: "56px",
  padding: "8px 0",
  justifyContent: "center",
  alignItems: "center",
  flex: "1 0 0",
  borderRadius: "8px",
  backgroundColor: "label.neutral",
  color: "#FAFAFC",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "29px",
  letterSpacing: "-0.378px",
  "&:hover": { backgroundColor: "label.normal" },
  "&:disabled": {
    backgroundColor: "fill.normal",
    color: "label.assistive",
  },
};

const cancelButtonSx: SxProps<Theme> = {
  display: "flex",
  height: "56px",
  padding: "8px 0",
  justifyContent: "center",
  alignItems: "center",
  flex: "1 0 0",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "background.default",
  color: "label.normal",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "29px",
  letterSpacing: "-0.378px",
  "&:hover": { backgroundColor: "fill.normal" },
};

const DIALOG_CONFIG: Record<
  FolderDialogMode,
  { title: string; confirmLabel: string }
> = {
  create: { title: "파일 새로 생성", confirmLabel: "완료" },
  delete: { title: "정말 삭제하시겠습니까?", confirmLabel: "삭제" },
  "bookmark-delete": { title: "북마크에서 삭제하시겠습니까?", confirmLabel: "삭제" },
};

const FolderDialog = ({
  open,
  mode,
  onClose,
  onConfirm,
}: FolderDialogProps) => {
  const [name, setName] = useState("");
  const config = DIALOG_CONFIG[mode];
  const isNameMode = mode === "create";
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
      <DialogContent sx={{ p: 0 }}>
        <Box sx={innerSx}>
          {/* 제목 + X 버튼 */}
          <Box sx={titleRowSx}>
            <Typography sx={titleSx}>{config.title}</Typography>
            <IconButton sx={closeButtonSx} onClick={onClose}>
              <CloseIcon sx={{ fontSize: 24, color: "label.normal" }} />
            </IconButton>
          </Box>

          {/* delete: 텍스트 없음 / create: 텍스트 필드 */}
          {mode === "delete" || mode === "bookmark-delete" ? null : (
            <TextField
              fullWidth
              placeholder="파일명을 입력해주세요"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          )}

          {/* 버튼 */}
          <DialogActions sx={{ p: 0, gap: "12px", alignSelf: "stretch", "& > :not(:first-of-type)": { ml: 0 } }}>
            <Button
              variant="contained"
              disableElevation
              sx={deleteButtonSx}
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
            >
              {config.confirmLabel}
            </Button>
            <Button
              variant="outlined"
              disableElevation
              sx={cancelButtonSx}
              onClick={onClose}
            >
              취소
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDialog;
