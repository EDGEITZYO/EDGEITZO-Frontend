import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type ResearcherItem } from "../../types/researcher";

interface ResearcherCardProps {
  researcher: ResearcherItem;
  onClick: () => void;
}

const cardSx: SxProps<Theme> = {
  display: "flex",
  width: "100%",
  padding: "16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "background.default",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "background.paper",
  },
};

const topRowSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
};

const nameRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  alignSelf: "stretch",
};

const paperBadgeSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: "label.normal",
  flexShrink: 0,
};

const keywordRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const keywordChipSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "6px",
  backgroundColor: "background.paper",
};

const ResearcherCard = ({ researcher, onClick }: ResearcherCardProps) => {
  const institution = [
    researcher.institution_current,
    researcher.institution_dept,
  ]
    .filter(Boolean)
    .join(" ");

  const displayName =
    researcher.author_name_kor || researcher.author_name_eng || "-";

  const displayKeywords =
    researcher.matched_keywords.length > 0
      ? researcher.matched_keywords
      : researcher.keywords;

  return (
    <Box sx={cardSx} onClick={onClick}>
      <Box sx={topRowSx}>
        <Box sx={nameRowSx}>
          <Box sx={paperBadgeSx}>
            <Typography
              variant="body1"
              sx={{
                color: "label.normal",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              논문 {researcher.total_papers}
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "label.normal",
              flex: "1 0 0",
            }}
          >
            {displayName}
          </Typography>
        </Box>
        {institution && (
          <Typography
            variant="body1"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "label.alternative",
              alignSelf: "stretch",
            }}
          >
            {institution}
          </Typography>
        )}
      </Box>
      {displayKeywords.length > 0 && (
        <Box sx={keywordRowSx}>
          {displayKeywords.slice(0, 3).map((keyword) => (
            <Box key={keyword} sx={keywordChipSx}>
              <Typography
                variant="body1"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "label.normal",
                }}
              >
                {keyword}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ResearcherCard;
