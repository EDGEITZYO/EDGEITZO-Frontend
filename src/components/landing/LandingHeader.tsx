import { Box, Typography, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface LandingHeaderProps {
  onGuestLogin: () => void;
  isLoading: boolean;
}

const headerSx: SxProps<Theme> = {
  display: "flex",
  padding: { xs: "12px 16px", sm: "18px 32px" },
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "stretch",
  backgroundColor: "#040405",
};

const buttonSx: SxProps<Theme> = {
  display: "flex",
  height: "32px",
  padding: "4px 10px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "6px",
  backgroundColor: "#0F2901",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#163E01",
  },
};

const LandingHeader = ({ onGuestLogin, isLoading }: LandingHeaderProps) => {
  return (
    <Box sx={headerSx}>
      <Box
        component="img"
        src="/landing/landing_biome_logo.svg"
        alt="BIOME"
        sx={{ width: "88px", height: "22px" }}
      />
      <Box sx={buttonSx} onClick={onGuestLogin}>
        {isLoading ? (
          <CircularProgress size={14} sx={{ color: "#4ACE03" }} />
        ) : (
          <Typography
            sx={{
              color: "#4ACE03",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            게스트 로그인
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LandingHeader;
