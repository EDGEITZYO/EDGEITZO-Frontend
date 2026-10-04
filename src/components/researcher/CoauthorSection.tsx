import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Avatar, Box, Popover, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type CoauthorItem } from "../../types/researcher";

interface CoauthorSectionProps {
  coauthors: CoauthorItem[];
}

const sectionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "24px",
  alignSelf: "stretch",
};

const titleBoxSx: SxProps<Theme> = {
  display: "flex",
  padding: "10px 12px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "2px",
  alignSelf: "stretch",
  borderRadius: "6px",
  backgroundColor: "background.paper",
};

const desktopListSx: SxProps<Theme> = {
  display: { xs: "none", sm: "flex" },
  padding: "0 15px",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
  flexWrap: "wrap",
};

const mobileListSx: SxProps<Theme> = {
  display: { xs: "grid", sm: "none" },
  rowGap: "16px",
  alignSelf: "stretch",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gridAutoFlow: "row",
};

const desktopCoauthorItemSx: SxProps<Theme> = {
  display: "flex",
  width: "104px",
  padding: "0 23px",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  flexShrink: 0,
  cursor: "pointer",
};

const mobileCoauthorItemSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  alignSelf: "stretch",
  cursor: "pointer",
};

const nameInstitutionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const popoverPaperSx: SxProps<Theme> = {
  width: "360px",
  padding: "12px 16px 16px 16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "12px",
  borderRadius: "12px",
  backgroundColor: "rgba(30, 32, 38, 0.90)",
  backdropFilter: "blur(2px)",
  boxShadow: "none",
};

const popoverInnerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
};

const popoverInfoSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "4px",
  alignSelf: "stretch",
};

const popoverNameRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  alignSelf: "stretch",
};

const popoverSubInfoSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  alignSelf: "stretch",
};

const detailButtonSx: SxProps<Theme> = {
  display: "flex",
  height: "56px",
  padding: "8px 16px",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "stretch",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "background.default",
  cursor: "pointer",
};

const getCardInstitutionText = (coauthor: CoauthorItem): string | null => {
  return coauthor.institution ?? null;
};

const CoauthorCard = ({
  coauthor,
  sx,
  onClick,
}: {
  coauthor: CoauthorItem;
  sx: SxProps<Theme>;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}) => (
  <Box sx={sx} onClick={onClick}>
    <Avatar sx={{ width: 54, height: 54, bgcolor: "#D9D9D9" }} />
    <Box sx={nameInstitutionSx}>
      <Typography
        variant="h5"
        sx={{
          color: "label.normal",
          textAlign: "center",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "break-all",
        }}
      >
        {coauthor.name ?? "-"}
      </Typography>
      {getCardInstitutionText(coauthor) && (
        <Typography
          variant="caption"
          sx={{
            color: "label.alternative",
            textAlign: "center",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {getCardInstitutionText(coauthor)}
        </Typography>
      )}
    </Box>
  </Box>
);

const CoauthorSection = ({ coauthors }: CoauthorSectionProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCoauthor, setSelectedCoauthor] = useState<CoauthorItem | null>(
    null,
  );

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>,
    coauthor: CoauthorItem,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCoauthor(coauthor);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCoauthor(null);
  };

  const handleDetailClick = () => {
    if (!selectedCoauthor) return;
    navigate(
      `/researcher/${selectedCoauthor.researcher_id}?q=${encodeURIComponent(q)}`,
    );
    handleClose();
  };

  const open = Boolean(anchorEl);

  if (coauthors.length === 0) return null;

  return (
    <Box sx={sectionSx}>
      <Box sx={titleBoxSx}>
        <Typography
          variant="h5"
          sx={{ color: "label.normal", alignSelf: "stretch" }}
        >
          함께 연구한 사람들 (공저자)
        </Typography>
      </Box>

      {/* 데스크탑/태블릿 */}
      <Box sx={desktopListSx}>
        {coauthors.map((coauthor) => (
          <CoauthorCard
            key={coauthor.researcher_id}
            coauthor={coauthor}
            sx={desktopCoauthorItemSx}
            onClick={(e) => handleOpen(e, coauthor)}
          />
        ))}
      </Box>

      {/* 모바일 */}
      <Box sx={mobileListSx}>
        {coauthors.map((coauthor) => (
          <CoauthorCard
            key={coauthor.researcher_id}
            coauthor={coauthor}
            sx={mobileCoauthorItemSx}
            onClick={() =>
              navigate(
                `/researcher/${coauthor.researcher_id}?q=${encodeURIComponent(q)}`,
              )
            }
          />
        ))}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        disableScrollLock
        slotProps={{
          paper: { sx: popoverPaperSx },
        }}
      >
        {selectedCoauthor && (
          <>
            <Box sx={popoverInnerSx}>
              <Box sx={popoverInfoSx}>
                <Box sx={popoverNameRowSx}>
                  <Typography
                    variant="h5"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#FAFAFC",
                    }}
                  >
                    {selectedCoauthor.name ?? "-"}
                  </Typography>
                </Box>
                <Box sx={popoverSubInfoSx}>
                  {selectedCoauthor.institution && (
                    <Typography
                      variant="body1"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        alignSelf: "stretch",
                        color: "#F7F8FA",
                      }}
                    >
                      {selectedCoauthor.institution}
                    </Typography>
                  )}
                  {selectedCoauthor.keywords.length > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        alignSelf: "stretch",
                        color: "#F7F8FA",
                      }}
                    >
                      대표 키워드 {selectedCoauthor.keywords.length}개
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={detailButtonSx} onClick={handleDetailClick}>
              <Typography
                variant="h5"
                sx={{
                  color: "label.normal",
                }}
              >
                상세 정보
              </Typography>
            </Box>
          </>
        )}
      </Popover>
    </Box>
  );
};

export default CoauthorSection;
