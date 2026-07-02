import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const pillInputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "216px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    paddingRight: "8px",
    "& fieldset": {
      borderColor: "label.alternative",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "label.alternative",
    },
    "&.Mui-focused fieldset": {
      borderColor: "label.alternative",
      borderWidth: "1px",
    },
  },
  "& input": {
    padding: "16px 24px",
  },
};

interface Step5ResearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const Step5ResearchField = ({
  value,
  onChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: Step5ResearchFieldProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNext = () => {
    if (!value.trim()) return;
    onNext();
  };

  const isValid = value.trim().length > 0;

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

  const titleArea = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      <Typography
        sx={{
          fontSize: isMobile ? "20px" : "24px",
          fontWeight: 600,
          lineHeight: isMobile ? "30px" : "36px",
          letterSpacing: isMobile ? "-0.42px" : "-0.528px",
          color: "label.normal",
        }}
      >
        연구 분야는 어디이신가요?
      </Typography>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
          color: "label.alternative",
        }}
      >
        간단하게 입력해주세요
      </Typography>
    </Box>
  );

  const input = (
    <TextField
      placeholder="ex) 유전자 편집, 효소 공학, 나노 바이오"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      fullWidth
      sx={pillInputSx}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end" sx={{ gap: "4px" }}>
              <IconButton
                onClick={handleNext}
                sx={{
                  width: "42px",
                  height: "40px",
                  padding: "8px 9px",
                  borderRadius: "24px",
                  backgroundColor: isValid ? "#1E2026" : "#D8DAE5",
                  "&:hover": {
                    backgroundColor: isValid ? "label.neutral" : "#D8DAE5",
                  },
                }}
              >
                <ArrowForwardIcon
                  sx={{ fontSize: 24, color: "static.white" }}
                />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
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
              {titleArea}
            </Box>
            {input}
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
        height: "420px",
        padding: "24px 20px 32px 20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* 단계점 제외 전체 프레임 */}
      <Box
        sx={{
          display: "flex",
          height: "302px",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexShrink: 0,
          alignSelf: "stretch",
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
          <Box
            sx={{ display: "flex", paddingLeft: "4px", alignItems: "center" }}
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
          {stepNumber}
        </Box>

        {/* 제목 + 설명 */}
        {titleArea}

        {/* 인풋 */}
        {input}
      </Box>

      {/* 단계점 */}
      {pageIndicator}
    </Box>
  );
};

export default Step5ResearchField;
