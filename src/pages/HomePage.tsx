import { Box } from "@mui/material";
import Header from "../components/layout/Header";
import BottomNav from "../components/layout/BottomNav";
import PersonalMessage from "../components/home/PersonalMessage";
import SearchBar from "../components/home/SearchBar";
import RecentSearchSection from "../components/home/RecentSearchSection";

const HomePage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header isLoggedIn />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: "15.23vh",
          gap: "48px",
          backgroundColor: "background.paper",
        }}
      >
        <PersonalMessage />
        <SearchBar />
        {/* 하단 섹션 */}
        <Box
          sx={{
            width: "100%",
            px: "4.79%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: "34px",
            pb: 10,
          }}
        >
          <RecentSearchSection />
          {/* 최근 확인한 논문 */}
        </Box>
      </Box>
      <BottomNav />
    </Box>
  );
};

export default HomePage;
