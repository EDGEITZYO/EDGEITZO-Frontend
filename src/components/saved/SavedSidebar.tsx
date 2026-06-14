import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

type SavedTab = "bookmark" | "recent";

interface SavedSidebarProps {
  activeTab: SavedTab;
  onTabChange: (tab: SavedTab) => void;
}

const sidebarSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  width: 202,
  flexShrink: 0,
  padding: "13px",
  gap: "13px",
  borderRight: "1px solid",
  borderColor: "line.normal",
  minHeight: "100%",
};

const tabSx = (isActive: boolean): SxProps<Theme> => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "15px 52px",
  borderRadius: "12px",
  cursor: "pointer",
  backgroundColor: isActive ? "primary.main" : "#E8E9ED",
});

const tabTextSx = (isActive: boolean): SxProps<Theme> => ({
  fontSize: "18px",
  fontWeight: 600,
  color: isActive ? "static.white" : "label.normal",
  whiteSpace: "nowrap",
});

const TABS: { label: string; value: SavedTab }[] = [
  { label: "북마크한 논문", value: "bookmark" },
  { label: "최근 읽은 논문", value: "recent" },
];

const SavedSidebar = ({ activeTab, onTabChange }: SavedSidebarProps) => {
  return (
    <Box sx={sidebarSx}>
      {TABS.map((tab) => (
        <Box
          key={tab.value}
          sx={tabSx(activeTab === tab.value)}
          onClick={() => onTabChange(tab.value)}
        >
          <Typography sx={tabTextSx(activeTab === tab.value)}>
            {tab.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export type { SavedTab };
export default SavedSidebar;
