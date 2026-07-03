import { useState } from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useMypageQuery } from "../../queries/useMypageQuery";
import LogoutDialog from "../mypage/LogoutDialog";

interface HeaderProps {
  isLoggedIn?: boolean;
}

const NAV_ITEMS = [
  { label: "저장한 논문", path: "/saved" },
  { label: "마이페이지", path: "/mypage" },
] as const;

const Header = ({ isLoggedIn = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data } = useMypageQuery();
  const userName = data?.profile.name;
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "background.default",
          borderBottom: "1px solid",
          borderColor: "line.normal",
        }}
      >
        <Toolbar
          sx={{
            px: "64px",
            py: "12px",
            height: 64,
            minHeight: "64px !important",
            justifyContent: "space-between",
          }}
        >
          {/* 로고 + 네비 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Box
              component="img"
              src="/logo.svg"
              alt="Biome 로고"
              onClick={() => navigate("/home")}
              sx={{
                height: 25,
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
            {isLoggedIn && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "32px" }}>
                {NAV_ITEMS.map(({ label, path }) => (
                  <Typography
                    key={path}
                    onClick={() => navigate(path)}
                    sx={{
                      fontSize: "16px",
                      fontWeight: pathname.startsWith(path) ? 600 : 400,
                      color: pathname.startsWith(path)
                        ? "label.strong"
                        : "label.alternative",
                      cursor: "pointer",
                      "&:hover": { color: "label.strong" },
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          {/* 우측 */}
          {isLoggedIn && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
              }}
            >
              <AccountCircleIcon sx={{ color: "text.secondary" }} />
              <Typography variant="body2" color="text.primary">
                {userName ? `${userName}님` : ""}
              </Typography>
              <Button
                variant="text"
                size="small"
                sx={{
                  color: "label.alternative",
                  backgroundColor: "fill.normal",
                  borderRadius: "8px",
                  px: "8px",
                  py: "4px",
                  minWidth: "unset",
                  "&:hover": {
                    backgroundColor: "fill.strong",
                  },
                }}
                onClick={() => setLogoutOpen(true)}
              >
                로그아웃
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
};

export default Header;
