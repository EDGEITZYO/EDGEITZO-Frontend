import { useState } from "react";
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

const errorPillInputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "216px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    paddingRight: "8px",
    "& fieldset": {
      borderColor: "status.negative",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "status.negative",
    },
    "&.Mui-focused fieldset": {
      borderColor: "status.negative",
      borderWidth: "1px",
    },
  },
  "& input": {
    padding: "16px 24px",
  },
};

const validateName = (value: string): string | null => {
  if (/[^a-zA-Z0-9가-힣]/.test(value)) return "특수문자는 사용할 수 없어요";
  return null;
};

interface Step1NameProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const Step1Name = ({
  value,
  onChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: Step1NameProps) => {
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (next.length > 10) return;
    onChange(next);
    setError(validateName(next));
  };

  const handleNext = () => {
    const validationError = validateName(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!value) return;
    onNext();
  };

  const isValid = value.length > 0 && !error;

  // 공통 컨텐츠
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
      바이옴에게 어떤 이름으로 불리고 싶으세요?
    </Typography>
  );

  const input = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
      }}
    >
      <TextField
        placeholder="이름을 입력해주세요"
        value={value}
        onChange={handleChange}
        fullWidth
        sx={error ? errorPillInputSx : pillInputSx}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end" sx={{ gap: "16px" }}>
                {value.length > 0 && (
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "-0.336px",
                      color: "label.assistive",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {value.length}/10
                  </Typography>
                )}
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
      {error && (
        <Box
          sx={{
            display: "flex",
            height: "24px",
            padding: "0 8px 0 12px",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: "-0.26px",
              color: "#D0220B",
            }}
          >
            특수문자는 사용할 수 없어요
          </Typography>
        </Box>
      )}
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
        {/* 뒤로가기 */}
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

        {/* 나머지 */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 0 42px 0",
          }}
        >
          {/* 번호 + 제목 + 인풋 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "54px",
            }}
          >
            {/* 번호 + 제목 */}
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

      {/* 인풋 + 에러 */}
      {input}

      {/* 단계점 */}
      {pageIndicator}
    </Box>
  );
};

export default Step1Name;
