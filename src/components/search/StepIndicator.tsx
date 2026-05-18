import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type SearchStep } from "../../types/search";

interface StepIndicatorProps {
  currentStep: SearchStep;
}

const STEPS: { key: SearchStep; label: string }[] = [
  { key: "purpose", label: "연구 목적" },
  { key: "scope", label: "논문 범위" },
  { key: "period", label: "발행 시기" },
  { key: "narrowDown", label: "범위 축소" },
  { key: "start", label: "탐색 시작" },
];

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flex: 1,
  padding: "21px 30px 16px 30px",
  borderRadius: "20px",
  border: "1px solid #AEB1C1",
};

const labelSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#000",
  lineHeight: "150%",
};

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <Box sx={containerSx}>
      <Typography sx={labelSx}>남은 단계</Typography>
      <Box sx={{ position: "relative" }}>
        {/* 스텝 라인 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            mt: "8px",
          }}
        >
          {/* 배경 라인 */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "3px",
              backgroundColor: "#AEB1C1",
              transform: "translateY(-50%)",
            }}
          />
          {/* 스텝 도트들 */}
          {STEPS.map((step, index) => (
            <Box
              key={step.key}
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 19,
                  height: 19,
                  borderRadius: "50%",
                  backgroundColor:
                    index === currentIndex ? "#1B1C23" : "#D9D9D9",
                  transition: "background-color 0.3s ease",
                }}
              />
            </Box>
          ))}
        </Box>
        {/* 스텝 라벨들 */}
        <Box sx={{ display: "flex", mt: "8px" }}>
          {STEPS.map((step) => (
            <Typography
              key={step.key}
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1B1C23",
                lineHeight: "150%",
                flex: 1,
                textAlign: 'center'
              }}
            >
              {step.label}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StepIndicator;
