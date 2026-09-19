import { useRef, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface LandingLastSectionProps {
  onGuestLogin: () => void;
  isLoading: boolean;
  registerRef: (el: HTMLElement | null) => void;
}

const sectionSx: SxProps<Theme> = {
  display: "flex",
  padding: {
    xs: "80px 16px 120px 16px",
    sm: "80px 120px 120px 120px",
    lg: "80px 120px 120px 120px",
  },
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "10px",
  alignSelf: "stretch",
  backgroundColor: "#131419",
};

const contentSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  alignSelf: "stretch",
};

const buttonSx: SxProps<Theme> = {
  display: "flex",
  width: "188px",
  padding: "12px 0",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  backgroundColor: "#163E01",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#1f5501",
  },
};

const LandingLastSection = ({
  onGuestLogin,
  isLoading,
  registerRef,
}: LandingLastSectionProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.classList.add("fade-in-target");
      registerRef(sectionRef.current);
    }
  }, [registerRef]);

  return (
    <Box ref={sectionRef} sx={sectionSx}>
      <Box sx={contentSx}>
        <Typography
          sx={{
            alignSelf: "stretch",
            color: "#FAFAFC",
            textAlign: "center",
            fontSize: { xs: "28px", sm: "32px" },
            fontWeight: 700,
            lineHeight: { xs: "42px", sm: "144%" },
            letterSpacing: { xs: "-0.728px", sm: "-0.896px" },
            whiteSpace: "pre-line",
          }}
        >
          {"생명공학 논문 탐색할 때는\n바이옴에서"}
        </Typography>
        <Box sx={buttonSx} onClick={onGuestLogin}>
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "#4ACE03" }} />
          ) : (
            <Typography
              sx={{
                color: "#4ACE03",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "30px",
                letterSpacing: "-0.378px",
              }}
            >
              시작하기
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LandingLastSection;
