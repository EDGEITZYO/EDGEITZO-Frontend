import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StopIcon from "@mui/icons-material/Stop";

interface ChatInputBarProps {
  isStreaming: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  height: "121px",
  padding: "20px",
  justifyContent: "space-between",
  alignItems: "flex-end",
  alignSelf: "stretch",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
};

const textareaSx: React.CSSProperties = {
  flex: 1,
  alignSelf: "stretch",
  border: "none",
  outline: "none",
  resize: "none",
  background: "transparent",
  fontFamily: "Pretendard Variable, sans-serif",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  color: "#1E2026",
  overflowY: "auto",
};

const ChatInputBar = ({ isStreaming, onSend, onStop }: ChatInputBarProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasValue = value.trim().length > 0;

  return (
    <Box sx={containerSx}>
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setValue(e.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="바이옴에게 물어보세요"
        style={{
          ...textareaSx,
          color: hasValue ? "#1E2026" : "#73757F",
        }}
      />
      <IconButton
        onClick={isStreaming ? onStop : handleSubmit}
        sx={{
          display: "flex",
          width: "36px",
          height: "36px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "100px",
          backgroundColor: isStreaming
            ? "#1E2026"
            : hasValue
              ? "#1E2026"
              : "#D8DAE5",
          "&:hover": {
            backgroundColor: isStreaming
              ? "#1E2026"
              : hasValue
                ? "#1E2026"
                : "#D8DAE5",
          },
          p: 0,
        }}
      >
        {isStreaming ? (
          <StopIcon sx={{ width: 24, height: 24, color: "#FFF" }} />
        ) : (
          <ArrowForwardIcon
            sx={{
              width: 24,
              height: 24,
              color: hasValue ? "#FFF" : "#73757F",
            }}
          />
        )}
      </IconButton>
    </Box>
  );
};

export default ChatInputBar;
