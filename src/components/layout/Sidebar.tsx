import { useState } from "react";
import { Box, Drawer, IconButton, Tooltip, Typography } from "@mui/material";
import { Bookmark, Clock, Menu, X } from "lucide-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useMypageQuery } from "../../queries/useMypageQuery";

interface SidebarNavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data } = useMypageQuery();
  const userName = data?.profile.name;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const NAV_ITEMS: SidebarNavItem[] = [
    {
      icon: <Bookmark size={20} />,
      label: "저장한 논문",
      path: "/saved/bookmark",
    },
    {
      icon: <Clock size={20} />,
      label: "최근 본 논문",
      path: "/saved/recent",
    },
  ];

  const isActive = (path: string) => {
    const basePath = path.split("?")[0];
    return pathname.startsWith(basePath);
  };

  // 데스크탑용 얇은 사이드바 (항상 고정)
  const DesktopSidebar = (
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
        position: "fixed",
        left: "12px",
        top: "12px",
        zIndex: 1200,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "60px",
        height: "calc(100vh - 24px)",
        padding: "20px 12px 12px 12px",
        borderRadius: "8px",
        backgroundColor: "background.default",
      }}
    >
      {/* 상단: 로고 + 네비 */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* 로고 */}
        <Box
          component="img"
          src="/logo_icon.svg"
          alt="Biome 로고"
          onClick={() => navigate("/home")}
          sx={{
            width: "36px",
            height: "36px",
            cursor: "pointer",
            mb: "12px",
          }}
        />

        {/* 네비 아이템 */}
        {NAV_ITEMS.map((item) => (
          <Tooltip
            key={item.path}
            title={item.label}
            placement="right"
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "#1E2026",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                  px: "10px",
                  py: "4px",
                },
              },
              arrow: {
                sx: { color: "#1E2026" },
              },
            }}
          >
            <Box
              onClick={() => navigate(item.path)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                cursor: "pointer",
                color: isActive(item.path)
                  ? "label.strong"
                  : "label.alternative",
                "&:hover": {
                  backgroundColor: "fill.normal",
                  color: "label.strong",
                },
              }}
            >
              {item.icon}
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* 하단: 프로필 */}
      <Tooltip
        title={userName ?? ""}
        placement="right"
        arrow
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: "#1E2026",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: "-0.26px",
              px: "10px",
              py: "4px",
            },
          },
          arrow: {
            sx: { color: "#1E2026" },
          },
        }}
      >
        <Box
          onClick={() => navigate("/mypage")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            cursor: "pointer",
            color: isActive("/mypage") ? "label.strong" : "label.alternative",
            "&:hover": {
              backgroundColor: "fill.normal",
              color: "label.strong",
            },
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 20 }} />
        </Box>
      </Tooltip>
    </Box>
  );

  // 태블릿/모바일용 드로어
  const MobileDrawer = (
    <Box sx={{ display: { xs: "block", lg: "none" } }}>
      {/* 햄버거 버튼 */}
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: "fixed",
          left: "24px",
          top: "24px",
          zIndex: 1200,
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          padding: "8px",
          backgroundColor: "background.default",
        }}
      >
        <Menu size={20} />
      </IconButton>

      {/* 드로어 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "rgba(0,0,0,0.4)" },
          },
          paper: {
            sx: {
              width: "240px",
              padding: "20px 12px 12px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: "0 8px 8px 0",
              backgroundColor: "background.default",
            },
          },
        }}
      >
        {/* 상단: 로고 + 닫기 + 네비 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* 로고 + 닫기 버튼 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: "12px",
            }}
          >
            <Box
              component="img"
              src="/logo_icon.svg"
              alt="Biome 로고"
              onClick={() => {
                navigate("/home");
                setDrawerOpen(false);
              }}
              sx={{
                width: "36px",
                height: "36px",
                cursor: "pointer",
              }}
            />
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ p: "4px" }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* 네비 아이템 */}
          {NAV_ITEMS.map((item) => (
            <Box
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "216px",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: isActive(item.path)
                  ? "fill.normal"
                  : "transparent",
                color: isActive(item.path)
                  ? "label.strong"
                  : "label.alternative",
                "&:hover": {
                  backgroundColor: "fill.normal",
                  color: "label.strong",
                },
              }}
            >
              {item.icon}
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                  color: "inherit",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* 하단: 프로필 */}
        <Box
          onClick={() => {
            navigate("/mypage");
            setDrawerOpen(false);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "216px",
            padding: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            color: isActive("/mypage") ? "label.strong" : "label.alternative",
            "&:hover": {
              backgroundColor: "fill.normal",
              color: "label.strong",
            },
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 20 }} />
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: "22px",
              letterSpacing: "-0.26px",
              color: "inherit",
            }}
          >
            {userName ?? ""}
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileDrawer}
    </>
  );
};

export default Sidebar;
