import { Box, Typography } from "@mui/material";
import { type PaperType } from "../../types/paper";

interface PaperTypeBadgeProps {
  paperType: PaperType;
}

const PaperTypeBadge = ({ paperType }: PaperTypeBadgeProps) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3px 8px 4px 8px",
      borderRadius: "6px",
      border: "1px solid",
      borderColor: "label.normal",
      alignSelf: "flex-start",
      whiteSpace: "nowrap",
    }}
  >
    <Typography
      sx={{
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "-0.336px",
        color: "label.normal",
      }}
    >
      {paperType}
    </Typography>
  </Box>
);

export default PaperTypeBadge;
