import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

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
  const userName = useAuthStore((state) => state.userName);

  return (
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
            sx={{
              width: 120,
              height: 32,
              backgroundColor: "fill.strong",
              borderRadius: 1,
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => navigate("/home")}
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
              {userName ? `${userName}님` : ''}
            </Typography>
            <Button
              variant="text"
              size="small"
              sx={{ color: "text.secondary" }}
            >
              로그아웃
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;