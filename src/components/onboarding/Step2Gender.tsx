import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { type Gender } from "../../types/user";

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "남성", value: "남성" },
  { label: "여성", value: "여성" },
  { label: "그 외", value: "선택 안함" },
];

interface Step2GenderProps {
  value: Gender | null;
  onChange: (value: Gender) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const Step2Gender = ({
  value,
  onChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: Step2GenderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const stepNumber = (
    <Box
      sx={{
        display: "flex",
        width: "50px",
        height: "50px",
        borderRadius: "345px",
        backgroundColor: "primary.light",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: isMobile ? "24px" : "28px",
          fontWeight: 600,
          lineHeight: isMobile ? "36px" : "42px",
          letterSpacing: isMobile ? "-0.528px" : "-0.784px",
          color: "#FAFAFC",
        }}
      >
        {currentStep}
      </Typography>
    </Box>
  );

  const title = (
    <Typography
      sx={{
        fontSize: isMobile ? "20px" : "24px",
        fontWeight: 600,
        lineHeight: isMobile ? "30px" : "36px",
        letterSpacing: isMobile ? "-0.42px" : "-0.528px",
        color: "label.normal",
      }}
    >
      성별을 선택해주세요.
    </Typography>
  );

  const selectionArea = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {GENDER_OPTIONS.map((option) => (
          <Box
            key={option.value}
            onClick={() => onChange(option.value)}
            sx={{
              display: "flex",
              padding: "8px 13px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "24px",
              backgroundColor:
                value === option.value ? "primary.main" : "fill.normal",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.336px",
                color: value === option.value ? "#FAFAFC" : "label.alternative",
              }}
            >
              {option.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <IconButton
        onClick={onNext}
        disabled={value === null}
        sx={{
          width: "42px",
          height: "40px",
          padding: "8px 9px",
          borderRadius: "24px",
          backgroundColor: value !== null ? "#1E2026" : "#D8DAE5",
          "&:hover": {
            backgroundColor: value !== null ? "label.neutral" : "#D8DAE5",
          },
          "&.Mui-disabled": {
            backgroundColor: "#D8DAE5",
          },
        }}
      >
        <ArrowForwardIcon sx={{ fontSize: 24, color: "static.white" }} />
      </IconButton>
    </Box>
  );

  const pageIndicator = (
    <Box
      sx={{
        display: "flex",
        padding: "0 16px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "345px",
              backgroundColor:
                i === currentStep - 1 ? "primary.light" : "label.disable",
            }}
          />
        ))}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          width: "100%",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Box
          sx={{
            display: "flex",
            padding: "16px 0",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <IconButton
            onClick={onBack}
            size="small"
            sx={{ p: 0 }}
            aria-label="뒤로가기"
          >
            <ChevronLeftIcon sx={{ fontSize: 28, color: "label.normal" }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 0 42px 0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "54px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "42px",
                paddingLeft: "4px",
              }}
            >
              {stepNumber}
              {title}
            </Box>
            {selectionArea}
          </Box>
          {pageIndicator}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "480px",
        padding: "24px 20px 32px 20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "54px",
      }}
    >
      {/* 뒤로가기 + 번호 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
        }}
      >
        <Box sx={{ display: "flex", paddingLeft: "4px", alignItems: "center" }}>
          <IconButton
            onClick={onBack}
            size="small"
            sx={{ p: 0 }}
            aria-label="뒤로가기"
          >
            <ChevronLeftIcon sx={{ fontSize: 28, color: "label.normal" }} />
          </IconButton>
        </Box>
        {stepNumber}
      </Box>

      {/* 제목 */}
      {title}

      {/* 선택버튼 + 제출버튼 */}
      {selectionArea}

      {/* 단계점 */}
      {pageIndicator}
    </Box>
  );
};

export default Step2Gender;
