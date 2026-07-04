import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { type SxProps, type Theme, useTheme } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Sidebar from "../components/layout/Sidebar";
import LogoutDialog from "../components/mypage/LogoutDialog";
import { useMypageQuery } from "../queries/useMypageQuery";

const INFO_ROWS = [
  { label: "성별", key: "gender" },
  { label: "나이", key: "age" },
  { label: "역할", key: "role" },
  { label: "전공 · 연구 분야", key: "research_field" },
] as const;

const MyPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { data, isPending, isError } = useMypageQuery();

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

  const purposesText = profile.purposes.join(", ");

  if (isMobile) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.paper" }}>
        {/* 모바일 상단 헤더 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            px: "16px",
            py: "16px",
          }}
        >
          <ArrowBackIosNewIcon
            onClick={() => navigate("/home")}
            sx={{ fontSize: 16, color: "label.normal", cursor: "pointer" }}
          />
          <Typography variant="h5" sx={{ color: "label.normal" }}>
            마이페이지
          </Typography>
        </Box>

        {/* 모바일 콘텐츠 */}
        <Box
          sx={{ px: "16px", display: "flex", flexDirection: "column", gap: 0 }}
        >
          {/* 프로필 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "16px",
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                border: "1px solid",
                borderColor: "line.neutral",
                backgroundColor: "fill.normal",
              }}
            />
            <Typography variant="h5" sx={{ color: "label.normal" }}>
              {profile.name}
            </Typography>
          </Box>

          {/* 정보 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                height: 0,
                borderTop: "1px solid",
                borderColor: "line.neutral",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                px: "6px",
              }}
            >
              {INFO_ROWS.map(({ label, key }) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    alignSelf: "stretch",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      width: "144px",
                      flexShrink: 0,
                      color: "label.alternative",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      flex: "1 0 0",
                      color: "label.normal",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    {profile[key] ?? "선택 안함"}
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  alignSelf: "stretch",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    width: "144px",
                    flexShrink: 0,
                    color: "label.alternative",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                  }}
                >
                  논문 탐색 목적
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ flex: "1 0 0", color: "label.normal" }}
                >
                  {purposesText}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 버튼 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              mt: "22px",
              pb: "16px",
            }}
          >
            <Button onClick={() => navigate("/mypage/edit")} sx={mobileBtnSx}>
              회원정보 수정
            </Button>
            <Button onClick={() => setLogoutOpen(true)} sx={mobileBtnSx}>
              로그아웃
            </Button>
          </Box>
        </Box>

        <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
      </Box>
    );
  }

  // 데스크탑 / 태블릿
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.paper" }}>
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pt: "170px",
          pb: "64px",
        }}
      >
        <Box
          sx={{
            width: "480px",
            backgroundColor: "static.white",
            borderRadius: "12px",
            border: "1px solid #FAFAFC",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            backdropFilter: "blur(2.9px)",
          }}
        >
          {/* 상단 정보 전체 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            {/* 프로필 이미지 + 이름 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
              }}
            >
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  border: "1px solid",
                  borderColor: "line.neutral",
                  backgroundColor: "fill.normal",
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  color: "label.normal",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {profile.name}
              </Typography>
            </Box>

            {/* 정보 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignSelf: "stretch",
              }}
            >
              <Box
                sx={{
                  height: 0,
                  borderTop: "1px solid",
                  borderColor: "line.neutral",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  px: "6px",
                }}
              >
                {INFO_ROWS.map(({ label, key }) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      alignSelf: "stretch",
                    }}
                  >
                    <Typography
                      variant="headlineM"
                      sx={{
                        width: "144px",
                        flexShrink: 0,
                        color: "label.alternative",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="headlineM"
                      sx={{
                        flex: "1 0 0",
                        color: "label.normal",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                    >
                      {profile[key] ?? "선택 안함"}
                    </Typography>
                  </Box>
                ))}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    alignSelf: "stretch",
                  }}
                >
                  <Typography
                    variant="headlineM"
                    sx={{
                      width: "144px",
                      flexShrink: 0,
                      color: "label.alternative",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    논문 탐색 목적
                  </Typography>
                  <Typography
                    variant="headlineM"
                    sx={{ flex: "1 0 0", color: "label.normal" }}
                  >
                    {purposesText}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 버튼 */}
          <Box sx={{ display: "flex", gap: "8px", alignSelf: "stretch" }}>
            <Button onClick={() => navigate("/mypage/edit")} sx={desktopBtnSx}>
              회원정보 수정
            </Button>
            <Button onClick={() => setLogoutOpen(true)} sx={desktopBtnSx}>
              로그아웃
            </Button>
          </Box>
        </Box>
      </Box>

      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </Box>
  );
};

const desktopBtnSx: SxProps<Theme> = {
  flex: "1 0 0",
  height: "56px",
  padding: "8px 0",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "static.white",
  color: "label.normal",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "29px",
  letterSpacing: "-0.378px",
  "&:hover": { backgroundColor: "fill.normal" },
};

const mobileBtnSx: SxProps<Theme> = {
  height: "56px",
  padding: "8px 0",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "static.white",
  color: "label.normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  alignSelf: "stretch",
  "&:hover": { backgroundColor: "fill.normal" },
};

export default MyPage;
