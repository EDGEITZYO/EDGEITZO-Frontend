import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import BookmarkFolderCard from "./BookmarkFolderCard";
import { type BookmarkFolder } from "../../types/saved";

interface BookmarkFolderGridProps {
  folders: BookmarkFolder[];
  onMoreClick: (folder: BookmarkFolder, action: "delete") => void;
  onRename: (folderId: string, name: string) => void;
}

const gridSx: SxProps<Theme> = {
  width: { lg: "914px", sm: "482px", xs: "100%" },
  height: { lg: "482px", sm: "506px" },
  padding: "16px",
  display: "flex",
  alignItems: "flex-start",
  alignContent: "flex-start",
  gap: { lg: "8px", sm: "20px", xs: "8px" },
  flexWrap: "wrap",
  justifyContent: "flex-start",
  borderRadius: "12px",
  border: "1px solid #FAFAFC",
  backgroundColor: "static.white",
  backdropFilter: "blur(2.9px)",
};

const BookmarkFolderGrid = ({
  folders,
  onMoreClick,
  onRename,
}: BookmarkFolderGridProps) => {
  const navigate = useNavigate();

  const handleFolderClick = (folderId: string) => {
    navigate(`/saved/bookmark/${folderId}`);
  };

  return (
    <Box sx={gridSx}>
      {folders.map((folder) => (
        <BookmarkFolderCard
          key={folder.id}
          folder={folder}
          onClick={handleFolderClick}
          onMoreClick={onMoreClick}
          onRename={onRename}
        />
      ))}
    </Box>
  );
};

export default BookmarkFolderGrid;
