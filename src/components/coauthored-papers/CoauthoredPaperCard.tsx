import { useTheme, useMediaQuery } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Fragment } from "react";
import {
  type CoauthoredPaperItem,
  type AuthorRoleType,
} from "../../types/researcher";

export interface CoauthoredPaperCardProps {
  paper: CoauthoredPaperItem;
  onClick: () => void;
  onBookmarkToggle: () => void;
}

// ─── 헬퍼 함수 ────────────────────────────────────────────

const formatJournalInfo = (
  publishedAt: string | null,
  pubYear: number | null,
  pubMonth: string | null,
  journalName: string | null,
): string => {
  let dateStr: string | null = null;

  if (publishedAt !== null) {
    dateStr = publishedAt;
  } else if (pubYear !== null) {
    dateStr = pubMonth !== null ? `${pubYear}-${pubMonth}` : String(pubYear);
  }

  const parts: string[] = [];
  if (dateStr !== null) parts.push(dateStr);
  if (journalName !== null) parts.push(journalName);
  return parts.join(" ");
};

const getChipBg = (roles: AuthorRoleType[], isResearcher: boolean): string => {
  if (roles.includes("participant")) return "#F7F8FA";
  return isResearcher ? "#E8F6EE" : "#EEF1FF";
};

const getRoleLabelColor = (
  role: AuthorRoleType,
  isResearcher: boolean,
): string => {
  if (role === "participant") return "#595B66";
  if (role === "corresponding") return "#1E2026";
  return isResearcher ? "#029B56" : "#2649D7"; // first / co_corresponding
};

const getDeskAuthorChipSx = (
  roles: AuthorRoleType[],
  isResearcher: boolean,
): SxProps<Theme> => ({
  display: "flex",
  padding: "3px 8px",
  alignItems: "center",
  gap: "4px",
  borderRadius: "6px",
  backgroundColor: getChipBg(roles, isResearcher),
});

const getMobAuthorChipSx = (
  roles: AuthorRoleType[],
  isResearcher: boolean,
): SxProps<Theme> => ({
  display: "flex",
  padding: "1px 6px",
  alignItems: "center",
  gap: "4px",
  borderRadius: "6px",
  backgroundColor: getChipBg(roles, isResearcher),
});

const getDeskRoleLabelSx = (
  role: AuthorRoleType,
  isResearcher: boolean,
): SxProps<Theme> => ({
  color: getRoleLabelColor(role, isResearcher),
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
});

const getMobRoleLabelSx = (
  role: AuthorRoleType,
  isResearcher: boolean,
): SxProps<Theme> => ({
  color: getRoleLabelColor(role, isResearcher),
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
});

const deskRoleSeparatorSx: SxProps<Theme> = {
  color: "#73757F",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const mobRoleSeparatorSx: SxProps<Theme> = {
  color: "#73757F",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

// 데스크탑 칩
const deskChipSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px",
  alignItems: "center",
  gap: "4px",
  borderRadius: "6px",
  border: "1px solid #1E2026",
};
const deskGreenChipSx: SxProps<Theme> = {
  ...deskChipSx,
  border: "1px solid #3BA502",
};
const deskChipTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "#1E2026",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};
const deskGreenChipTextSx: SxProps<Theme> = {
  ...deskChipTextSx,
  color: "#3BA502",
};

// 모바일 칩
const mobChipSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "6px",
  border: "1px solid #1E2026",
};
const mobGreenChipSx: SxProps<Theme> = {
  ...mobChipSx,
  border: "1px solid #3BA502",
};
const mobChipTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "#1E2026",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};
const mobGreenChipTextSx: SxProps<Theme> = {
  ...mobChipTextSx,
  color: "#3BA502",
};

const deskAuthorNameSx: SxProps<Theme> = {
  color: "#1E2026",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "150%",
};

const deskOtherAuthorSx: SxProps<Theme> = {
  color: "#73757F",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

const mobAuthorNameSx: SxProps<Theme> = {
  color: "#1E2026",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

const mobOtherAuthorSx: SxProps<Theme> = {
  color: "#1B1C23",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

// 초록 (데스크탑 전용)
const abstractBoxSx: SxProps<Theme> = {
  display: "flex",
  padding: "10px 12px",
  flexDirection: "column",
  alignItems: "flex-start",
  alignSelf: "stretch",
  borderRadius: "6px",
  backgroundColor: "#F7F8FA",
};
const abstractTextSx: SxProps<Theme> = {
  alignSelf: "stretch",
  color: "#73757F",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "27px",
  letterSpacing: "-0.336px",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

// ─── CoauthoredPaperCard ──────────────────────────────────

const CoauthoredPaperCard = ({
  paper,
  onClick,
  onBookmarkToggle,
}: CoauthoredPaperCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isClickable =
    (paper.can_open_detail && paper.detail_id !== null) ||
    paper.external_url !== null;

  const journalInfo = formatJournalInfo(
    paper.published_at,
    paper.pub_year,
    paper.pub_month,
    paper.journal_name,
  );

  const handleCardClick = () => {
    if (isClickable) onClick();
  };

  const handleBookmarkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onBookmarkToggle();
  };

  const cardSx: SxProps<Theme> = {
    display: "flex",
    padding: isMobile ? "16px" : "20px",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "12px",
    alignSelf: "stretch",
    borderRadius: "8px",
    border: "1px solid #E9EAF2",
    backgroundColor: "#FFF",
    cursor: isClickable ? "pointer" : "default",
    ...(isClickable && {
      "&:hover": { backgroundColor: "#FAFAFA" },
    }),
  };

  // ─── 칩 렌더 ───────────────────────────────────────────
  const renderChips = (mobile: boolean) => (
    <>
      {paper.paper_type !== null && (
        <Box sx={mobile ? mobChipSx : deskChipSx}>
          <Typography sx={mobile ? mobChipTextSx : deskChipTextSx}>
            {paper.paper_type}
          </Typography>
        </Box>
      )}
      {paper.citation_count !== null && (
        <Box sx={mobile ? mobChipSx : deskChipSx}>
          <Typography sx={mobile ? mobChipTextSx : deskChipTextSx}>
            인용 {paper.citation_count.toLocaleString()}
          </Typography>
        </Box>
      )}
      {paper.kci_registered && (
        <Box sx={mobile ? mobGreenChipSx : deskGreenChipSx}>
          <Typography sx={mobile ? mobGreenChipTextSx : deskGreenChipTextSx}>
            KCI
          </Typography>
        </Box>
      )}
      {paper.sci_indexed && (
        <Box sx={mobile ? mobGreenChipSx : deskGreenChipSx}>
          <Typography sx={mobile ? mobGreenChipTextSx : deskGreenChipTextSx}>
            SCI
          </Typography>
        </Box>
      )}
    </>
  );

  // ─── 북마크 아이콘 ────────────────────────────────────
  const renderBookmark = () =>
    paper.can_bookmark ? (
      <Box
        sx={{
          display: "flex",
          width: "20px",
          height: "20px",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
        onClick={handleBookmarkClick}
      >
        {paper.is_bookmarked ? (
          <BookmarkIcon sx={{ fontSize: 20, color: "primary.dark" }} />
        ) : (
          <BookmarkBorderIcon sx={{ fontSize: 20, color: "label.assistive" }} />
        )}
      </Box>
    ) : null;

  // ─── 모바일 레이아웃 ──────────────────────────────────
  if (isMobile) {
    return (
      <Box sx={cardSx} onClick={handleCardClick}>
        {/* 칩, 제목, 저자, 저널 묶음 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          {/* 칩, 제목, 저자 묶음 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            {/* 칩, 제목 묶음 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "12px",
                alignSelf: "stretch",
              }}
            >
              {/* 칩 영역 */}
              <Box
                sx={{
                  display: "flex",
                  height: "36px",
                  alignItems: "center",
                  gap: "12px",
                  alignSelf: "stretch",
                }}
              >
                {/* 칩 묶음 */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                  }}
                >
                  {renderChips(true)}
                </Box>
                {renderBookmark()}
              </Box>

              {/* 제목 */}
              {paper.title !== null && (
                <Typography
                  sx={{
                    alignSelf: "stretch",
                    color: "#1E2026",
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "29px",
                    letterSpacing: "-0.378px",
                  }}
                >
                  {paper.title}
                </Typography>
              )}
            </Box>

            {/* 저자 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* 연구자 칩 */}
                <Box sx={getMobAuthorChipSx(paper.researcher_role.roles, true)}>
                  <Typography sx={mobAuthorNameSx}>
                    {paper.researcher_role.name ?? "-"}
                  </Typography>
                  {paper.researcher_role.roles.map((role, i) => (
                    <Fragment key={i}>
                      {i > 0 && (
                        <Typography sx={mobRoleSeparatorSx}>·</Typography>
                      )}
                      <Typography sx={getMobRoleLabelSx(role, true)}>
                        {paper.researcher_role.role_labels[i]}
                      </Typography>
                    </Fragment>
                  ))}
                </Box>
                {/* 공저자 칩 */}
                <Box sx={getMobAuthorChipSx(paper.coauthor_role.roles, false)}>
                  <Typography sx={mobAuthorNameSx}>
                    {paper.coauthor_role.name ?? "-"}
                  </Typography>
                  {paper.coauthor_role.roles.map((role, i) => (
                    <Fragment key={i}>
                      {i > 0 && (
                        <Typography sx={mobRoleSeparatorSx}>·</Typography>
                      )}
                      <Typography sx={getMobRoleLabelSx(role, false)}>
                        {paper.coauthor_role.role_labels[i]}
                      </Typography>
                    </Fragment>
                  ))}
                </Box>
              </Box>
              {paper.other_author_count > 0 && (
                <Typography sx={mobOtherAuthorSx}>
                  외 {paper.other_author_count}인
                </Typography>
              )}
            </Box>
          </Box>

          {/* 저널 출판일자, 저널명 */}
          {journalInfo.length > 0 && (
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "#73757F",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.336px",
              }}
            >
              {journalInfo}
            </Typography>
          )}
        </Box>

        {/* 키워드 영역 */}
        {paper.keywords.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {paper.keywords.map((kw) => (
                <Box
                  key={kw}
                  sx={{
                    display: "flex",
                    padding: "3px 8px 4px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "6px",
                    backgroundColor: "#F7F8FA",
                  }}
                >
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#1E2026",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "-0.336px",
                      wordBreak: "break-all",
                    }}
                  >
                    {kw}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  // ─── 데스크탑/태블릿 레이아웃 ─────────────────────────
  return (
    <Box sx={cardSx} onClick={handleCardClick}>
      {/* 논문 칩들 + 저널정보 + 북마크 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {renderChips(false)}
        </Box>
        {journalInfo.length > 0 ? (
          <Typography
            sx={{
              flex: 1,
              color: "#73757F",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            {journalInfo}
          </Typography>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}
        {renderBookmark()}
      </Box>

      {/* 제목 */}
      {paper.title !== null && (
        <Typography
          sx={{
            alignSelf: "stretch",
            color: "#1E2026",
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: "30px",
            letterSpacing: "-0.42px",
          }}
        >
          {paper.title}
        </Typography>
      )}

      {/* 저자 묶음 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* 연구자 칩 */}
        <Box sx={getDeskAuthorChipSx(paper.researcher_role.roles, true)}>
          <Typography sx={deskAuthorNameSx}>
            {paper.researcher_role.name ?? "-"}
          </Typography>
          {paper.researcher_role.roles.map((role, i) => (
            <Fragment key={i}>
              {i > 0 && <Typography sx={deskRoleSeparatorSx}>·</Typography>}
              <Typography sx={getDeskRoleLabelSx(role, true)}>
                {paper.researcher_role.role_labels[i]}
              </Typography>
            </Fragment>
          ))}
        </Box>
        {/* 공저자 칩 */}
        <Box sx={getDeskAuthorChipSx(paper.coauthor_role.roles, false)}>
          <Typography sx={deskAuthorNameSx}>
            {paper.coauthor_role.name ?? "-"}
          </Typography>
          {paper.coauthor_role.roles.map((role, i) => (
            <Fragment key={i}>
              {i > 0 && <Typography sx={deskRoleSeparatorSx}>·</Typography>}
              <Typography sx={getDeskRoleLabelSx(role, false)}>
                {paper.coauthor_role.role_labels[i]}
              </Typography>
            </Fragment>
          ))}
        </Box>
        {paper.other_author_count > 0 && (
          <Typography sx={deskOtherAuthorSx}>
            외 {paper.other_author_count}인
          </Typography>
        )}
      </Box>

      {/* 초록 */}
      {paper.abstract !== null && (
        <Box sx={abstractBoxSx}>
          <Typography sx={abstractTextSx}>{paper.abstract}</Typography>
        </Box>
      )}

      {/* 키워드 */}
      {paper.keywords.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            alignSelf: "stretch",
            flexWrap: "wrap",
          }}
        >
          {paper.keywords.map((kw) => (
            <Box
              key={kw}
              sx={{
                display: "flex",
                padding: "3px 8px",
                alignItems: "center",
                gap: "4px",
                borderRadius: "6px",
                backgroundColor: "#F7F8FA",
              }}
            >
              <Typography
                sx={{
                  color: "#1E2026",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                {kw}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CoauthoredPaperCard;
