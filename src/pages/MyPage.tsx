import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/layout/Header";
import LogoutDialog from "../components/mypage/LogoutDialog";
import { mypageApi } from "../api/mypage";

const INFO_ROWS = [
  { label: "성별", key: "gender" },
  { label: "나이", key: "age" },
  { label: "역할", key: "role" },
  { label: "전공 · 연구 분야", key: "research_field" },
] as const;

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "background.paper",
};

const contentSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "calc(8 / 100 * (100vh - 64px))",
  paddingBottom: "calc(8 / 100 * (100vh - 64px))",
};

const cardSx: SxProps<Theme> = {
  width: "498px",
  backgroundColor: "background.default",
  borderRadius: "20px",
  border: "1px solid",
  borderColor: "line.normal",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
};

const profileSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const dividerSx: SxProps<Theme> = {
  width: "100%",
  height: "1px",
  backgroundColor: "line.normal",
};

const infoListSx: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "17px",
  px: "4px",
};

const infoRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-start",
  width: "100%",
};

const infoLabelSx: SxProps<Theme> = {
  width: "130px",
  flexShrink: 0,
  color: "label.neutral",
  fontWeight: 600,
};

const infoValueSx: SxProps<Theme> = {
  flex: 1,
  color: "label.neutral",
};

const purposeWrapSx: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const buttonGroupSx: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  gap: "12px",
};

const buttonSx: SxProps<Theme> = {
  flex: 1,
  height: "52px",
  borderRadius: "12px",
  borderColor: "line.normal",
  color: "label.neutral",
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "27px",
  "&:hover": {
    borderColor: "label.assistive",
    backgroundColor: "fill.normal",
  },
};

const MyPage = () => {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { data, isPending, isError } = useQuery({
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
          프로필 정보를 불러오지 못했어요. 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  const { profile } = data;

  return (
    <Box sx={containerSx}>
      <Header isLoggedIn />
      <Box sx={contentSx}>
        <Box sx={cardSx}>
          {/* 프로필 */}
          <Box sx={profileSx}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                backgroundColor: "primary.dark",
                fontSize: "28px",
                fontWeight: 700,
                color: "static.white",
              }}
            >
              {profile.name[0]}
            </Avatar>
            <Typography
              variant="h4"
              sx={{ color: "label.neutral", textAlign: "center" }}
            >
              {profile.name}
            </Typography>
          </Box>

          <Box sx={dividerSx} />

          {/* 정보 목록 */}
          <Box sx={infoListSx}>
            {INFO_ROWS.map(({ label, key }) => (
              <Box key={key} sx={infoRowSx}>
                <Typography variant="body1" sx={infoLabelSx}>
                  {label}
                </Typography>
                <Typography variant="body1" sx={infoValueSx}>
                  {profile[key] ?? "선택 안함"}
                </Typography>
              </Box>
            ))}
            <Box sx={infoRowSx}>
              <Typography variant="body1" sx={infoLabelSx}>
                논문 탐색 목적
              </Typography>
              <Box sx={purposeWrapSx}>
                {profile.purposes.map((purpose) => (
                  <Chip
                    key={purpose}
                    label={purpose}
                    size="small"
                    sx={{
                      backgroundColor: "fill.normal",
                      color: "label.neutral",
                      borderRadius: "7px",
                      height: "28px",
                      px: "6px",
                      fontSize: "14px",
                      fontWeight: 400,
                      "& .MuiChip-label": { px: 0 },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={dividerSx} />

          {/* 버튼 */}
          <Box sx={buttonGroupSx}>
            <Button
              variant="outlined"
              onClick={() => navigate("/mypage/edit")}
              sx={buttonSx}
            >
              회원정보 수정
            </Button>
            <Button
              variant="outlined"
              onClick={() => setLogoutOpen(true)}
              sx={buttonSx}
            >
              로그아웃
            </Button>
          </Box>
        </Box>
      </Box>

      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </Box>
  );
};

export default MyPage;
