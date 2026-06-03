import { Dialog, DialogContent, Typography, Button, Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface ExitConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const dialogContentSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  px: "40px",
  py: "36px",
};

const buttonBoxSx: SxProps<Theme> = {
  display: "flex",
  gap: "12px",
  width: "100%",
};

const cancelButtonSx: SxProps<Theme> = {
  flex: 1,
  height: 48,
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
  color: "label.normal",
  fontSize: "16px",
  fontWeight: 500,
  "&:hover": { backgroundColor: "fill.normal" },
};

const confirmButtonSx: SxProps<Theme> = {
  flex: 1,
  height: 48,
  borderRadius: "12px",
  backgroundColor: "static.black",
  color: "static.white",
  fontSize: "16px",
  fontWeight: 500,
  "&:hover": { backgroundColor: "label.neutral" },
};

const ExitConfirmDialog = ({
  open,
  onConfirm,
  onCancel,
}: ExitConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{
        paper: {
          sx: { borderRadius: "20px", width: 400, maxWidth: 400 },
        },
      }}
    >
      <DialogContent sx={dialogContentSx}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "label.normal",
              lineHeight: "150%",
            }}
          >
            정말로 탐색 과정을 끝내시겠어요?
          </Typography>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 400,
              color: "label.alternative",
              lineHeight: "150%",
            }}
          >
            지금까지 입력한 모든 정보가 사라져요
          </Typography>
        </Box>
        <Box sx={buttonBoxSx}>
          <Button sx={cancelButtonSx} onClick={onCancel}>
            계속 탐색하기
          </Button>
          <Button sx={confirmButtonSx} onClick={onConfirm}>
            탐색 종료하기
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExitConfirmDialog;
