import { useState } from 'react';
import { Box } from "@mui/material";
import Header from "../components/layout/Header";
import BottomNav from "../components/layout/BottomNav";
import PersonalMessage from "../components/home/PersonalMessage";
import SearchBar from "../components/home/SearchBar";
import RecentSearchSection from "../components/home/RecentSearchSection";
import RecentPaperSection from '../components/home/RecentPaperSection';
import KeywordMapModal from '../components/keyword-map/KeywordMapModal';

const HomePage = () => {
  const [isKeywordMapModalOpen, setIsKeywordMapModalOpen] = useState(false);

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
        <SearchBar onKeywordMapClick={() => setIsKeywordMapModalOpen(true)} />
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
          <RecentPaperSection />
        </Box>
      </Box>
      <BottomNav />
      <KeywordMapModal
        open={isKeywordMapModalOpen}
        onClose={() => setIsKeywordMapModalOpen(false)}
      />
    </Box>
  );
};

export default HomePage;