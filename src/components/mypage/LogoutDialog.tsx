import { useNavigate } from "react-router-dom";
import {
  Dialog,
  Button,
  IconButton,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

const LogoutDialog = ({ open, onClose }: LogoutDialogProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      onClose();
      navigate("/login");
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: isMobile ? "320px" : "480px",
            borderRadius: "12px",
            padding: isMobile ? "20px 16px" : "24px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "32px",
            m: 0,
          },
        },
      }}
    >
      {/* 제목 + X버튼 */}
      <Box sx={{ width: "100%", position: "relative", textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: 600,
            lineHeight: isMobile ? "29px" : "36px",
            letterSpacing: isMobile ? "-0.378px" : "-0.528px",
            color: "label.normal",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          정말 로그아웃하시겠습니까?
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: isMobile ? "24px" : "32px",
            height: isMobile ? "24px" : "32px",
            p: 0,
          }}
        >
          <CloseIcon
            sx={{
              width: isMobile ? "23.188px" : "28px",
              height: isMobile ? "23.188px" : "28px",
            }}
          />
        </IconButton>
      </Box>

      {/* 버튼 영역 */}
      {isMobile ? (
        // 모바일 — 가로 나란히 (취소 → 로그아웃)
        <Box sx={{ width: "100%", display: "flex", gap: "12px" }}>
          <Button
            onClick={onClose}
            sx={{
              flex: "1 0 0",
              height: "56px",
              padding: "8px 0",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "line.neutral",
              backgroundColor: "static.white",
              color: "label.normal",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              "&:hover": { backgroundColor: "fill.normal" },
            }}
          >
            취소
          </Button>
          <Button
            onClick={() => logout()}
            sx={{
              flex: "1 0 0",
              height: "56px",
              padding: "8px 0",
              borderRadius: "8px",
              backgroundColor: "#1E2026",
              color: "#FAFAFC",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              "&:hover": { backgroundColor: "label.neutral" },
            }}
          >
            로그아웃
          </Button>
        </Box>
      ) : (
        // 데스크탑 — 세로로 쌓임 (로그아웃 → 취소)
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Button
            onClick={() => logout()}
            sx={{
              width: "100%",
              height: "56px",
              padding: "8px 0",
              borderRadius: "8px",
              backgroundColor: "#1E2026",
              color: "#FAFAFC",
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "29px",
              letterSpacing: "-0.378px",
              "&:hover": { backgroundColor: "label.neutral" },
            }}
          >
            로그아웃
          </Button>
          <Button
            onClick={onClose}
            sx={{
              width: "100%",
              height: "56px",
              padding: "8px 0",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "line.neutral",
              backgroundColor: "static.white",
              color: "label.normal",
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "29px",
              letterSpacing: "-0.378px",
              "&:hover": { backgroundColor: "fill.normal" },
            }}
          >
            취소
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default LogoutDialog;
