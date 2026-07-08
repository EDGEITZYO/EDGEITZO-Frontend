import { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type BookmarkFolder } from "../../types/saved";

interface BookmarkFolderCardProps {
  folder: BookmarkFolder;
  onClick: (folderId: string) => void;
  onMoreClick: (folder: BookmarkFolder, action: "delete") => void;
  onRename: (folderId: string, name: string) => void;
}

const cardSx: SxProps<Theme> = {
  width: { xs: "100%", sm: "214px" },
  height: { xs: "120px", sm: "144px" },
  padding: "16px",
  flexShrink: 0,
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  cursor: "pointer",
  backgroundColor: "background.default",
  position: "relative",
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  alignSelf: "stretch",
};

const nameSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  flex: "1 0 0",
  fontSize: { xs: "18px", sm: "20px" },
  fontWeight: 600,
  lineHeight: { xs: "29px", sm: "30px" },
  letterSpacing: { xs: "-0.378px", sm: "-0.42px" },
  color: "label.normal",
};

const editingNameSx: SxProps<Theme> = {
  ...nameSx,
  color: "label.alternative",
  outline: "none",
  border: "none",
  background: "transparent",
  fontFamily: "Pretendard Variable, sans-serif",
  width: "100%",
  cursor: "text",
};

const countSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  alignSelf: "stretch",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  color: "label.alternative",
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
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const BookmarkFolderCard = ({
  folder,
  onClick,
  onMoreClick,
  onRename,
}: BookmarkFolderCardProps) => {
  const { id, name, paper_count } = folder;
  const isAllFolder = id === "all";
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    handleMenuClose();
    if (action === "edit") {
      setEditingName(name);
      setIsEditing(true);
    } else {
      onMoreClick(folder, action);
    }
  };

  const handleRenameCommit = () => {
    const trimmed = editingName.trim();
    if (trimmed && trimmed !== name) {
      onRename(id, trimmed);
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRenameCommit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <Box
      sx={cardSx}
      onClick={() => {
        if (!isEditing) onClick(id);
      }}
    >
      {/* 제목 + 메뉴 */}
      <Box sx={headerSx}>
        {isEditing ? (
          <Box
            component="input"
            ref={inputRef}
            value={editingName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditingName(e.target.value)
            }
            onBlur={handleRenameCommit}
            onKeyDown={handleInputKeyDown}
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
            sx={editingNameSx}
          />
        ) : (
          <Typography sx={nameSx}>{name}</Typography>
        )}

        {!isAllFolder && !isEditing && (
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <IconButton sx={menuButtonSx} onClick={handleMoreClick}>
              <MoreHorizIcon
                sx={{ width: "28px", height: "28px", color: "label.assistive" }}
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
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <MenuItem
                sx={menuItemSx}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleMenuAction("edit");
                }}
              >
                이름 수정
              </MenuItem>
              <MenuItem
                sx={{ ...menuItemSx, color: "status.negative" }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleMenuAction("delete");
                }}
              >
                삭제
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      {/* 논문 개수 */}
      <Typography sx={countSx}>논문 {paper_count}개</Typography>
    </Box>
  );
};

export default BookmarkFolderCard;
