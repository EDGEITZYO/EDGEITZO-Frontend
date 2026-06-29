import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { type Purpose } from "../../types/user";

const PURPOSE_OPTIONS: { label: string; value: Purpose }[] = [
  { label: "선택연구 주제 탐색", value: "연구 주제 탐색" },
  { label: "랩미팅 발표 준비", value: "랩미팅/발표 준비" },
  { label: "논문 작성 참고", value: "논문 작성 참고" },
  { label: "최신 트렌드 파악", value: "최신 트렌드 파악" },
  { label: "연구자 탐색", value: "연구자 탐색" },
];

interface Step6PurposeProps {
  value: Purpose[];
  onChange: (value: Purpose[]) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const Step6Purpose = ({
  value,
  onChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: Step6PurposeProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleToggle = (option: Purpose) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleNext = () => {
    if (value.length === 0) return;
    onNext();
  };

  const isValid = value.length > 0;

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
        거의 다 왔어요.
        <br />
        논문 탐색 목적을 모두 선택해주세요.
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
        탐색 목적에 따라 더 정확한 논문 추천이 가능해요
      </Typography>
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

  const optionChip = (option: { label: string; value: Purpose }) => {
    const selected = value.includes(option.value);
    return (
      <Box
        key={option.value}
        onClick={() => handleToggle(option.value)}
        sx={{
          display: "flex",
          padding: "8px 13px",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          borderRadius: "24px",
          backgroundColor: selected ? "primary.main" : "fill.normal",
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
            color: selected ? "#FAFAFC" : "label.alternative",
          }}
        >
          {option.label}
        </Typography>
      </Box>
    );
  };

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

            {/* 선택지 + 제출버튼 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                alignSelf: "stretch",
              }}
            >
              {/* 선택지 */}
              <Box
                sx={{
                  display: "flex",
                  width: "252px",
                  height: "144px",
                  alignItems: "center",
                  alignContent: "center",
                  gap: "12px 8px",
                  flexWrap: "wrap",
                }}
              >
                {PURPOSE_OPTIONS.map((option) => optionChip(option))}
              </Box>

              {/* 제출버튼 */}
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
            </Box>
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
        padding: "24px 0 32px 20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "54px",
      }}
    >
      {/* 단계점 제외 전체 프레임 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "48px",
        }}
      >
        {/* 뒤로가기 + 번호 + 제목 + 설명 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "19px",
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
        </Box>

        {/* 선택지 + 제출버튼 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          {/* 선택지 */}
          <Box
            sx={{
              display: "flex",
              width: "358px",
              alignItems: "center",
              alignContent: "center",
              gap: "12px 8px",
              alignSelf: "stretch",
              flexWrap: "wrap",
            }}
          >
            {PURPOSE_OPTIONS.map((option) => optionChip(option))}
          </Box>

          {/* 제출버튼 */}
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
            <ArrowForwardIcon sx={{ fontSize: 24, color: "static.white" }} />
          </IconButton>
        </Box>
      </Box>

      {/* 단계점 */}
      {pageIndicator}
    </Box>
  );
};

export default Step6Purpose;
