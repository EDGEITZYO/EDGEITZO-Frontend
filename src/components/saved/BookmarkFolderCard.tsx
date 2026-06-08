import { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type BookmarkFolder } from "../../types/saved";

interface BookmarkFolderCardProps {
  folder: BookmarkFolder;
  onClick: (folderId: string) => void;
  onMoreClick: (folder: BookmarkFolder, action: "edit" | "delete") => void;
}

const cardSx: SxProps<Theme> = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "line.normal",
  padding: "20px 24px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  cursor: "pointer",
  backgroundColor: "background.default",
  "&:hover": {
    backgroundColor: "background.paper",
  },
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const nameSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "static.black",
  lineHeight: "normal",
};

const keywordRowSx: SxProps<Theme> = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const keywordTagSx: SxProps<Theme> = {
  display: "inline-flex",
  padding: "0 6px",
  borderRadius: "7px",
  backgroundColor: "fill.normal",
  fontSize: "14px",
  fontWeight: 400,
  color: "label.alternative",
};

const metaSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "label.assistive",
  lineHeight: "normal",
};

const menuItemSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "label.normal",
  borderRadius: "8px",
  px: "12px",
};

const BookmarkFolderCard = ({
  folder,
  onClick,
  onMoreClick,
}: BookmarkFolderCardProps) => {
  const { id, name, representative_keywords, paper_count, updated_at } = folder;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: "edit" | "delete") => {
    handleMenuClose();
    onMoreClick(folder, action);
  };

  return (
    <Box sx={cardSx} onClick={() => onClick(id)}>
      <Box sx={headerSx}>
        <Typography sx={nameSx}>{name}</Typography>
        <>
          <IconButton
            size="small"
            sx={{ p: "0px", width: 24, height: 24 }}
            onClick={handleMoreClick}
          >
            <MoreHorizIcon sx={{ fontSize: 24, color: "label.assistive" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: "12px",
                  boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
                  padding: "4px",
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
              수정
            </MenuItem>
            <MenuItem
              sx={{ ...menuItemSx, color: "error.main" }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleMenuAction("delete");
              }}
            >
              삭제
            </MenuItem>
          </Menu>
        </>
      </Box>
      <Box sx={keywordRowSx}>
        {representative_keywords.map((keyword, index) => (
          <Typography key={`${keyword}-${index}`} sx={keywordTagSx}>
            {keyword}
          </Typography>
        ))}
      </Box>
      <Typography sx={metaSx}>
        논문 {paper_count}개 &nbsp; {updated_at}
      </Typography>
    </Box>
  );
};

export default BookmarkFolderCard;
