import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface ToastProps {
  message: string;
  position?: "fixed" | "absolute";
}

const Toast = ({ message, position = "fixed" }: ToastProps) => {
  const toastSx: SxProps<Theme> = {
    position,
    bottom: "54px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    padding: "12px 36px",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    borderRadius: "100px",
    background: "rgba(30, 32, 38, 0.80)",
    zIndex: 10,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    maxWidth: "calc(100% - 32px)",
  };

  return (
    <Box sx={toastSx}>
      <Typography
        sx={{
          overflow: "hidden",
          color: "#F7F8FA",
          textOverflow: "ellipsis",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Toast;
