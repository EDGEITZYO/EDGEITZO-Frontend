import { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/layout/Header";
import PersonalMessage from "../components/home/PersonalMessage";
import SearchBar from "../components/home/SearchBar";
import RecentSearchSection from "../components/home/RecentSearchSection";
import RecentPaperSection from "../components/home/RecentPaperSection";
import KeywordMapModal from "../components/keyword-map/KeywordMapModal";
import { homeApi } from "../api/home";
import { useAuthStore } from "../stores/authStore";

const HomePage = () => {
  const [isKeywordMapModalOpen, setIsKeywordMapModalOpen] = useState(false);
  const setUserName = useAuthStore((state) => state.setUserName);

  const { data, isPending, isError } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await homeApi.getHome();
      setUserName(res.data.data.user.name);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>
          홈 데이터를 불러오지 못했어요. 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

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
        <PersonalMessage message={data.user.personalized_message} />
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
          <RecentSearchSection searches={data.recent_searches} />
          <RecentPaperSection papers={data.recent_papers} />
        </Box>
      </Box>
      <KeywordMapModal
        open={isKeywordMapModalOpen}
        onClose={() => setIsKeywordMapModalOpen(false)}
      />
    </Box>
  );
};

export default HomePage;
