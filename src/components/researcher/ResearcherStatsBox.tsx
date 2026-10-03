import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type ResearcherProfile } from "../../types/researcher";

type ResearcherStatsBoxProps = Pick<
  ResearcherProfile,
  "total_papers" | "total_citations"
>;

const containerSx: SxProps<Theme> = {
  display: "flex",
  padding: "24px",
  alignItems: "flex-end",
  alignContent: "flex-end",
  gap: "12px 32px",
  alignSelf: "stretch",
  flexWrap: "wrap",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
};

const statItemSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const STATS: {
  label: string;
  key: keyof ResearcherStatsBoxProps;
  unit: string;
}[] = [
  { label: "총 논문 수", key: "total_papers", unit: "건" },
  { label: "총 피인용수", key: "total_citations", unit: "회" },
];

const ResearcherStatsBox = ({
  total_papers,
  total_citations,
}: ResearcherStatsBoxProps) => {
  const values: ResearcherStatsBoxProps = { total_papers, total_citations };

  const formatValue = (
    key: keyof ResearcherStatsBoxProps,
    unit: string,
  ): string => {
    const val = values[key];
    if (val === null) return "확인 불가";
    return `${val.toLocaleString()}${unit}`;
  };

  return (
    <Box sx={containerSx}>
      {STATS.map(({ label, key, unit }) => (
        <Box key={key} sx={statItemSx}>
          <Typography variant="body1" sx={{ color: "label.alternative" }}>
            {label}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#029B56",
            }}
          >
            {formatValue(key, unit)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ResearcherStatsBox;
