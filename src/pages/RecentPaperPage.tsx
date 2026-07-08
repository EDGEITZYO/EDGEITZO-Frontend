import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import Sidebar from "../components/layout/Sidebar";
import RecentPaperContent from "../components/saved/RecentPaperContent";

const pageWrapperSx: SxProps<Theme> = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "background.default",
};

const RecentPaperPage = () => {
  return (
    <Box sx={pageWrapperSx}>
      <Sidebar />
      <RecentPaperContent />
    </Box>
  );
};

export default RecentPaperPage;