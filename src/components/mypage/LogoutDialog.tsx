import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

const LogoutDialog = ({ open, onClose }: LogoutDialogProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // TODO: API 연동 시 세션·인증 토큰 삭제 처리 추가
    onClose();
    navigate("/login");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            padding: "8px",
            minWidth: "320px",
          },
        },
      }}
    >
      <DialogTitle sx={{ typography: "h5", color: "label.strong", pb: 1 }}>
        로그아웃
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body1" sx={{ color: "label.alternative" }}>
          정말 로그아웃하시겠습니까?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ gap: "8px", px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            flex: 1,
            borderColor: "line.normal",
            color: "label.normal",
            borderRadius: "10px",
            "&:hover": {
              borderColor: "label.normal",
              backgroundColor: "fill.normal",
            },
          }}
        >
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            flex: 1,
            backgroundColor: "label.strong",
            color: "static.white",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "label.neutral" },
          }}
        >
          로그아웃
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
