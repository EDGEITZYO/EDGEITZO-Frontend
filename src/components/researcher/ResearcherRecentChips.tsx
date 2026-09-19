import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { type ResearcherRecentSearchItem } from "../../types/researcher";

interface ResearcherRecentChipsProps {
  items: ResearcherRecentSearchItem[];
  onChipClick: (query: string) => void;
}

const wrapperSx: SxProps<Theme> = {
  display: "flex",
  paddingLeft: "8px",
  alignItems: "flex-start",
  gap: "8px",
  alignSelf: "stretch",
};

const labelWrapperSx: SxProps<Theme> = {
  display: "flex",
  padding: "8px 13px",
  justifyContent: "center",
  alignItems: "center",
  gap: "2px",
  borderRadius: "24px",
  flexShrink: 0,
};

const chipsWrapperSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-start",
  alignContent: "flex-start",
  gap: "8px",
  flex: "1 0 0",
  flexWrap: "wrap",
};

const chipSx: SxProps<Theme> = {
  display: "flex",
  padding: "8px 13px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "24px",
  backgroundColor: "fill.normal",
  cursor: "pointer",
};

const ResearcherRecentChips = ({
  items,
  onChipClick,
}: ResearcherRecentChipsProps) => {
  if (items.length === 0) return null;

  return (
    <Box sx={wrapperSx}>
      <Box sx={labelWrapperSx}>
        <Typography
          variant="body1"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "label.alternative",
          }}
        >
          최근 검색어
        </Typography>
        <Box
          sx={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <InfoOutlinedIcon
            sx={{
              width: "16px",
              height: "16px",
              color: "label.alternative",
            }}
          />
        </Box>
      </Box>
      <Box sx={chipsWrapperSx}>
        {items.slice(0, 6).map((item, index) => (
          <Box
            key={`${item.query}-${index}`}
            sx={chipSx}
            onClick={() => onChipClick(item.query)}
          >
            <Typography
              variant="body1"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "label.alternative",
              }}
            >
              {item.query}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ResearcherRecentChips;
