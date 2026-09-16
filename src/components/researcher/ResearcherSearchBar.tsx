import { useState } from "react";
import { Box, InputBase } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ResearcherSearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const desktopBarSx: SxProps<Theme> = {
  display: "flex",
  height: "56px",
  padding: "8px 8px 8px 24px",
  justifyContent: "space-between",
  alignItems: "center",
  flex: "1 0 0",
  borderRadius: "216px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
};

const mobileBarSx: SxProps<Theme> = {
  display: "flex",
  padding: "16px 12px 12px 12px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
  borderRadius: "24px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
  alignSelf: "stretch",
  width: "100%",
};

const submitButtonSx = (enabled: boolean): SxProps<Theme> => ({
  display: "flex",
  width: "40px",
  height: "40px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: enabled ? "label.normal" : "label.disable",
  flexShrink: 0,
  cursor: enabled ? "pointer" : "default",
  transition: "background-color 0.2s",
});

const ResearcherSearchBar = ({
  onSearch,
  initialValue = "",
}: ResearcherSearchBarProps) => {
  const [value, setValue] = useState(initialValue);
  const theme = useTheme();

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inputSx = {
    ...theme.typography.body1,
    color: "label.normal",
    "& input::placeholder": {
      color: theme.palette.label.alternative,
      opacity: 1,
    },
  };

  return (
    <>
      {/* 데스크탑/태블릿 */}
      <Box sx={{ display: { xs: "none", sm: "flex" }, alignSelf: "stretch" }}>
        <Box sx={desktopBarSx}>
          <InputBase
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="연구자명 또는 연구 분야를 입력하세요"
            fullWidth
            sx={inputSx}
          />
          <Box
            sx={submitButtonSx(value.trim().length > 0)}
            onClick={handleSubmit}
          >
            <ArrowForwardIcon
              sx={{
                fontSize: 20,
                color: "#FAFAFC",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* 모바일 */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, width: "100%" }}>
        <Box sx={mobileBarSx}>
          <InputBase
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="연구자명 또는 연구 분야를 입력하세요"
            fullWidth
            sx={inputSx}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={submitButtonSx(value.trim().length > 0)}
              onClick={handleSubmit}
            >
              <ArrowForwardIcon
                sx={{
                  fontSize: 20,
                  color: "#FAFAFC",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResearcherSearchBar;
