import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface SpecificityCardProps {
  completenessPct: number;
}

const containerSx: SxProps<Theme> = {
  display: "inline-flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  padding: "21px 30px 16px 30px",
  gap: "17px",
  borderRadius: "20px",
  border: "1px solid #AEB1C1",
};

const labelSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#000",
  lineHeight: "150%",
};

const percentSx: SxProps<Theme> = {
  fontSize: "40px",
  fontWeight: 600,
  color: "#1B1C23",
  lineHeight: "150%",
};

const SpecificityCard = ({ completenessPct }: SpecificityCardProps) => {
  return (
    <Box sx={containerSx}>
      <Typography sx={labelSx}>검색 구체화</Typography>
      <Typography sx={percentSx}>{completenessPct}%</Typography>
    </Box>
  );
};

export default SpecificityCard;
