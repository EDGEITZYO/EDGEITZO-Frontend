import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import Sidebar from "../components/layout/Sidebar";
import ResearcherSearchBar from "../components/researcher/ResearcherSearchBar";
import ResearcherRecentChips from "../components/researcher/ResearcherRecentChips";
import { useResearcherRecentSearchesQuery } from "../queries/useResearcherQuery";

const pageSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "background.paper",
};

const contentSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: { xs: "256px", sm: "256px", lg: "256px" },
  paddingX: { xs: "16px", sm: "64px", lg: "144px" },
  gap: { xs: "56px", sm: "180px" },
  alignSelf: "stretch",
};

const innerSx: SxProps<Theme> = {
  display: "flex",
  width: { xs: "100%", lg: "912px" },
  flexDirection: "column",
  alignItems: { xs: "flex-start", sm: "center" },
  gap: "42px",
};

const titleWrapperSx: SxProps<Theme> = {
  display: "flex",
  padding: { xs: "0 16px", sm: "0" },
  justifyContent: { xs: "flex-start", sm: "center" },
  alignItems: "center",
};

const searchAreaSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "23px",
  alignSelf: "stretch",
};

const ResearcherPage = () => {
  const navigate = useNavigate();
  const { data: recentSearches } = useResearcherRecentSearchesQuery();

  const handleSearch = (query: string) => {
    navigate(
      `/researcher/search?q=${encodeURIComponent(query)}&sort=relevance&page=1`,
    );
  };

  const handleChipClick = (query: string) => {
    navigate(
      `/researcher/search?q=${encodeURIComponent(query)}&sort=relevance&page=1`,
    );
  };

  return (
    <Box sx={pageSx}>
      <Sidebar />
      <Box sx={contentSx}>
        <Box sx={innerSx}>
          <Box sx={titleWrapperSx}>
            <Typography
              variant="titleSb"
              sx={{
                background:
                  "linear-gradient(92deg, #03C26C 16.24%, #1E2026 94.05%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
                display: { xs: "none", sm: "block" },
              }}
            >
              당신의 연구 분야의 연구자를 탐색해보세요
            </Typography>
            <Typography
              variant="h4"
              sx={{
                background:
                  "linear-gradient(92deg, #03C26C 16.24%, #1E2026 94.05%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: { xs: "left", sm: "center" },
                display: { xs: "block", sm: "none" },
              }}
            >
              당신의 연구 분야의
              <br />
              연구자를 탐색해보세요
            </Typography>
          </Box>
          <Box sx={searchAreaSx}>
            <ResearcherSearchBar onSearch={handleSearch} />
            {recentSearches && recentSearches.length > 0 && (
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignSelf: "stretch",
                }}
              >
                <ResearcherRecentChips
                  items={recentSearches}
                  onChipClick={handleChipClick}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResearcherPage;
