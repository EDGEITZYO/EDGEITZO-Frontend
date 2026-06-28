import { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/layout/Sidebar";
import PersonalMessage from "../components/home/PersonalMessage";
import SearchBar from "../components/home/SearchBar";
import RecentSearchSection from "../components/home/RecentSearchSection";
import RecentPaperSection from "../components/home/RecentPaperSection";
import KeywordMapModal from "../components/keyword-map/KeywordMapModal";
import { homeApi } from "../api/home";
import { mypageApi } from "../api/mypage";
import { useAuthStore } from "../stores/authStore";

const HomePage = () => {
  const [isKeywordMapModalOpen, setIsKeywordMapModalOpen] = useState(false);
  const setUserName = useAuthStore((state) => state.setUserName);
  const setUserId = useAuthStore((state) => state.setUserId);

  const { data, isPending, isError } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await homeApi.getHome();
      setUserName(res.data.data.user.name);
      setUserId(res.data.data.user.id);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useQuery({
    queryKey: ["mypage"],
    queryFn: async () => {
      const res = await mypageApi.getMypage();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        minWidth: 0,
        backgroundColor: "background.paper",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: "256px",
          pb: "64px",
          minWidth: 0,
        }}
      >
        {/* 상단: 개인화 메시지 + 검색바 */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { lg: "912px" },
            px: { xs: "16px", sm: "64px", lg: 0 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "42px",
            minWidth: 0,
          }}
        >
          <PersonalMessage message={data.user.personalized_message} />
          <SearchBar onKeywordMapClick={() => setIsKeywordMapModalOpen(true)} />
        </Box>

        {/* 간격: 검색바 영역 ↔ 최근 탐색 섹션 */}
        <Box sx={{ height: { xs: "56px", sm: "180px" } }} />

        {/* 하단: 최근 탐색 + 최근 확인한 논문 */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { lg: "912px" },
            px: { xs: "16px", sm: "64px", lg: 0 },
            display: "flex",
            flexDirection: "column",
            gap: "64px",
            minWidth: 0,
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
