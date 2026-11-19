import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Popover,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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

const popoverButtonRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
};

const popoverButtonSx: SxProps<Theme> = {
  display: "flex",
  height: "56px",
  padding: "8px 0",
  justifyContent: "center",
  alignItems: "center",
  flex: "1 0 0",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "background.default",
  cursor: "pointer",
};

const mobPopoverPaperSx: SxProps<Theme> = {
  width: "328px",
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

const mobPopoverNameTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "#FAFAFC",
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "30px",
  letterSpacing: "-0.378px",
};

const mobPopoverSubInfoTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 5,
  alignSelf: "stretch",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "#F7F8FA",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

const mobPopoverButtonSx: SxProps<Theme> = {
  display: "flex",
  padding: "12px 0",
  justifyContent: "center",
  alignItems: "center",
  flex: "1 0 0",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "background.default",
  cursor: "pointer",
};

const mobPopoverButtonTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "#1E2026",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { id: researcherId } = useParams<{ id: string }>();
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

  const handleCoauthoredPapersClick = () => {
    if (!selectedCoauthor || !researcherId) return;
    navigate(
      `/researcher/${researcherId}/coauthored-papers/${selectedCoauthor.researcher_id}?q=${encodeURIComponent(q)}`,
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
            onClick={(e) => handleOpen(e, coauthor)}
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
          paper: { sx: isMobile ? mobPopoverPaperSx : popoverPaperSx },
        }}
      >
        {selectedCoauthor && (
          <>
            <Box sx={popoverInnerSx}>
              <Box sx={popoverInfoSx}>
                <Box sx={popoverNameRowSx}>
                  <Typography
                    {...(!isMobile && { variant: "h5" })}
                    sx={
                      isMobile
                        ? mobPopoverNameTextSx
                        : {
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#FAFAFC",
                          }
                    }
                  >
                    {selectedCoauthor.name ?? "-"}
                  </Typography>
                </Box>
                <Box sx={popoverSubInfoSx}>
                  {selectedCoauthor.institution && (
                    <Typography
                      {...(!isMobile && { variant: "body1" })}
                      sx={
                        isMobile
                          ? mobPopoverSubInfoTextSx
                          : {
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 5,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              alignSelf: "stretch",
                              color: "#F7F8FA",
                            }
                      }
                    >
                      {selectedCoauthor.institution}
                    </Typography>
                  )}
                  {selectedCoauthor.keywords.length > 0 && (
                    <Typography
                      {...(!isMobile && { variant: "body1" })}
                      sx={
                        isMobile
                          ? mobPopoverSubInfoTextSx
                          : {
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 5,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              alignSelf: "stretch",
                              color: "#F7F8FA",
                            }
                      }
                    >
                      대표 키워드 {selectedCoauthor.keywords.length}개
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={popoverButtonRowSx}>
              <Box
                sx={isMobile ? mobPopoverButtonSx : popoverButtonSx}
                onClick={handleDetailClick}
              >
                <Typography
                  {...(!isMobile && { variant: "h5" })}
                  sx={
                    isMobile
                      ? mobPopoverButtonTextSx
                      : {
                          color: "label.normal",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }
                  }
                >
                  상세 정보
                </Typography>
              </Box>
              <Box
                sx={isMobile ? mobPopoverButtonSx : popoverButtonSx}
                onClick={handleCoauthoredPapersClick}
              >
                <Typography
                  {...(!isMobile && { variant: "h5" })}
                  sx={
                    isMobile
                      ? mobPopoverButtonTextSx
                      : {
                          color: "label.normal",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }
                  }
                >
                  함께 작성한 논문
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Popover>
    </Box>
  );
};

export default CoauthorSection;
