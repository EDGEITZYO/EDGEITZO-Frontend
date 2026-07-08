import { type ReactNode, useRef, useEffect, useState } from "react";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface FolderNavConfig {
  name: string;
  isEditing: boolean;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  onEditingCommit: () => void;
  onEditingCancel: () => void;
  onMenuEdit: () => void;
  onMenuDelete: () => void;
}

interface TopNavBarProps {
  onBack: () => void;
  children?: ReactNode;
  title?: string;
  folderConfig?: FolderNavConfig;
}

const navBarSx: SxProps<Theme> = {
  display: "flex",
  padding: "16px 12px",
  alignItems: "center",
  gap: "8px",
  position: "fixed",
  left: "12px",
  top: "12px",
  right: "12px",
  borderRadius: "8px",
  backgroundColor: "background.default",
  zIndex: 1100,
};

const leftSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
};

const folderNameSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.normal",
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "30px",
  letterSpacing: "-0.42px",
};

const editingNameSx: SxProps<Theme> = {
  ...folderNameSx,
  color: "label.alternative",
  outline: "none",
  border: "none",
  background: "transparent",
  fontFamily: "Pretendard Variable, sans-serif",
  width: "100%",
  cursor: "text",
};

const menuButtonSx: SxProps<Theme> = {
  display: "flex",
  width: "36px",
  height: "36px",
  padding: "4px",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
};

const menuItemSx: SxProps<Theme> = {
  padding: "12px 16px",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  color: "label.normal",
};

const TopNavBar = ({ onBack, children, title, folderConfig }: TopNavBarProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (folderConfig?.isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [folderConfig?.isEditing]);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={navBarSx}>
      {/* 왼쪽: 로고 + 뒤로가기 */}
      <Box sx={leftSx}>
        <Box
          component="img"
          src="/logo_icon.svg"
          alt="Biome 로고"
          onClick={() => navigate("/home")}
          sx={{ width: "36px", height: "36px", cursor: "pointer" }}
        />
        <IconButton
          onClick={onBack}
          sx={{ p: 0, width: "28px", height: "28px" }}
        >
          <ChevronLeftIcon sx={{ fontSize: 28, color: "label.normal" }} />
        </IconButton>
      </Box>

      {title && <Typography sx={folderNameSx}>{title}</Typography>}

      {/* 폴더명 + 메뉴 */}
      {folderConfig && (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {folderConfig.isEditing ? (
            <Box
              component="input"
              ref={inputRef}
              value={folderConfig.editingName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                folderConfig.onEditingNameChange(e.target.value)
              }
              onBlur={folderConfig.onEditingCommit}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") folderConfig.onEditingCommit();
                else if (e.key === "Escape") folderConfig.onEditingCancel();
              }}
              sx={editingNameSx}
            />
          ) : (
            <>
              <Typography sx={folderNameSx}>{folderConfig.name}</Typography>
              <IconButton sx={menuButtonSx} onClick={handleMenuOpen}>
                <MoreHorizIcon
                  sx={{
                    width: "28px",
                    height: "28px",
                    color: "label.normal",
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    sx: {
                      width: "148px",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: "line.normal",
                      backgroundColor: "background.default",
                      boxShadow: "none",
                      padding: "0 1px",
                    },
                  },
                }}
              >
                <MenuItem
                  sx={menuItemSx}
                  onClick={() => {
                    handleMenuClose();
                    folderConfig.onMenuEdit();
                  }}
                >
                  이름 수정
                </MenuItem>
                <MenuItem
                  sx={{ ...menuItemSx, color: "status.negative" }}
                  onClick={() => {
                    handleMenuClose();
                    folderConfig.onMenuDelete();
                  }}
                >
                  삭제
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      )}

      {children}
    </Box>
  );
};

export default TopNavBar;
