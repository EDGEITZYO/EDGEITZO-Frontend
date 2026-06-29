import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type Role } from "../../types/user";

const JOB_OPTIONS: Role[] = [
  "대학원 진학 준비",
  "석사과정",
  "박사과정",
  "석박통합과정",
  "교수·연구원",
  "대학생",
  "기타",
];

interface Step4JobProps {
  value: Role | null;
  onChange: (value: Role) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const Step4Job = ({
  value,
  onChange,
  onNext,
  onBack,
  currentStep,
  totalSteps,
}: Step4JobProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelect = (option: Role) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleNext = () => {
    if (!value) return;
    onNext();
  };

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
        지금 어떤 직무에 있으신가요?
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
        해당 직무에 적합한 맞춤형 추천을 진행해드릴게요
      </Typography>
    </Box>
  );

  const dropdownArea = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "8px",
        alignSelf: "stretch",
        position: "relative",
      }}
    >
      <Box
        onClick={() => setIsOpen((prev) => !prev)}
        sx={{
          display: "flex",
          height: "56px",
          padding: "8px 8px 8px 24px",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          flex: 1,
          borderRadius: "216px",
          border: "1px solid",
          borderColor: "label.alternative",
          backgroundColor: "background.default",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: value ? "label.normal" : "label.alternative",
            }}
          >
            {value ?? "직무를 선택해주세요."}
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "40px",
              height: "40px",
              padding: "10px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "24px",
            }}
          >
            {isOpen ? (
              <KeyboardArrowUpIcon
                sx={{ fontSize: 20, color: "label.normal" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{ fontSize: 20, color: "label.normal" }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <IconButton
        onClick={handleNext}
        sx={{
          width: "58px",
          height: "56px",
          padding: "8px 9px",
          borderRadius: "24px",
          backgroundColor: value ? "#1E2026" : "#D8DAE5",
          flexShrink: 0,
          "&:hover": {
            backgroundColor: value ? "label.neutral" : "#D8DAE5",
          },
        }}
      >
        <ArrowForwardIcon sx={{ fontSize: 24, color: "static.white" }} />
      </IconButton>

      {isOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "64px",
            left: 0,
            width: { xs: "100%", sm: "374px" },
            maxHeight: "296px",
            padding: "8px",
            borderRadius: "28px",
            border: "1px solid",
            borderColor: "label.alternative",
            backgroundColor: "background.default",
            overflowY: "auto",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {JOB_OPTIONS.map((option) => (
            <Box
              key={option}
              onClick={() => handleSelect(option)}
              sx={{
                display: "flex",
                height: "56px",
                padding: "8px 8px 8px 16px",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
                alignSelf: "stretch",
                borderRadius: "216px",
                backgroundColor:
                  value === option ? "background.paper" : "background.default",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "background.paper",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                  color: "label.normal",
                  flex: 1,
                }}
              >
                {option}
              </Typography>
            </Box>
          ))}
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
            {dropdownArea}
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

        {/* 드롭다운 + 제출버튼 */}
        {dropdownArea}
      </Box>

      {/* 단계점 */}
      {pageIndicator}
    </Box>
  );
};

export default Step4Job;
