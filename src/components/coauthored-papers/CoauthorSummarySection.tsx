import { useRef, useState, useLayoutEffect } from "react";
import { Link } from "lucide-react";
import { Avatar, Box, Typography, useMediaQuery } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type CoauthorPairSummaryResponse } from "../../types/researcher";

interface CoauthorSummarySectionProps {
  summary: CoauthorPairSummaryResponse;
}

// ─── 스타일 ───────────────────────────────────────────────

const outerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
  alignSelf: "stretch",
};

const profileSectionSx: SxProps<Theme> = {
  display: "flex",
  padding: "24px 24px 24px 36px",
  justifyContent: "space-between",
  alignItems: "center",
  alignContent: "center",
  rowGap: "12px",
  alignSelf: "stretch",
  flexWrap: "wrap",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
  "@media (max-width: 599px)": {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    alignContent: "flex-start",
    rowGap: "16px",
    columnGap: "32px",
  },
};

const researchersInfoSx: SxProps<Theme> = {
  display: "flex",
  height: "71px",
  justifyContent: "center",
  alignItems: "center",
  gap: "32px",
  "@media (max-width: 599px)": {
    flexDirection: "column",
    height: "auto",
    alignItems: "flex-start",
  },
};

const researcherSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "16px",
};

const nameInstitutionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "6px",
};

const researcherChipSx: SxProps<Theme> = {
  display: "flex",
  height: "30px",
  padding: "3px 8px",
  alignItems: "center",
  gap: "4px",
  borderRadius: "6px",
  backgroundColor: "#E6F9F0",
  maxWidth: "84px",
  overflow: "hidden",
};

const coauthorChipSx: SxProps<Theme> = {
  ...researcherChipSx,
  backgroundColor: "#EDF0FF",
};

const nameTextSx: SxProps<Theme> = {
  color: "label.normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const institutionTextSx: SxProps<Theme> = {
  color: "label.alternative",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

const linkIconBoxSx: SxProps<Theme> = {
  display: "flex",
  padding: "10px",
  alignItems: "flex-start",
  borderRadius: "24px",
  backgroundColor: "#E6F5ED",
};

const keywordsLabelSx: SxProps<Theme> = {
  color: "label.alternative",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  "@media (max-width: 599px)": {
    fontSize: "13px",
    lineHeight: "22px",
    letterSpacing: "-0.26px",
  },
};

const keywordChipSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "6px",
  backgroundColor: "#F7F8FA",
  flexShrink: 0,
};

const keywordTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const statsSectionSx: SxProps<Theme> = {
  display: "flex",
  padding: "24px",
  alignItems: "flex-end",
  alignContent: "flex-end",
  gap: "12px 32px",
  alignSelf: "stretch",
  flexWrap: "wrap",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
};

const statItemSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const statLabelSx: SxProps<Theme> = {
  color: "label.alternative",
  textAlign: "center",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const statValueSx: SxProps<Theme> = {
  color: "#029B56",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "29px",
  letterSpacing: "-0.378px",
};

// ─── 헬퍼 ─────────────────────────────────────────────────

const getPeriodText = (
  startYear: number | null,
  endYear: number | null,
): string => {
  if (startYear === null && endYear === null) return "-";
  if (startYear === null) return `- ${endYear}`;
  if (endYear === null) return `${startYear} -`;
  if (startYear === endYear) return String(startYear);
  return `${startYear} - ${endYear}`;
};

// ─── CoauthorSummarySection ───────────────────────────────

const CoauthorSummarySection = ({ summary }: CoauthorSummarySectionProps) => {
  const isMobile = useMediaQuery("(max-width: 599px)");

  const researchersInfoRef = useRef<HTMLDivElement>(null);
  const keywordsSectionRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  const [isWrappedBelow, setIsWrappedBelow] = useState(false);
  const [isChipsWrapping, setIsChipsWrapping] = useState(false);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => {
      if (researchersInfoRef.current && keywordsSectionRef.current) {
        setIsWrappedBelow(
          keywordsSectionRef.current.offsetTop >
            researchersInfoRef.current.offsetTop,
        );
      }
      if (chipsContainerRef.current) {
        const first = chipsContainerRef.current
          .firstElementChild as HTMLElement | null;
        if (first) {
          setIsChipsWrapping(
            chipsContainerRef.current.clientHeight > first.offsetHeight + 1,
          );
        }
      }
    });

    const elements = [
      researchersInfoRef.current,
      keywordsSectionRef.current,
      chipsContainerRef.current,
    ].filter((el): el is HTMLDivElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ─── 동적 스타일 ───────────────────────────────────────────

  const keywordsSectionSx: SxProps<Theme> = (() => {
    if (isMobile) {
      // State 5: 모바일 — 항상 세로
      return {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
      };
    }
    if (!isWrappedBelow) {
      // State 1: 연구자 정보와 나란히 — 오른쪽 정렬 세로
      return {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "16px",
      };
    }
    if (!isChipsWrapping) {
      // State 2: 아래로 내려감 + 칩 한 줄 — 가로 양끝 정렬
      return {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: "16px",
      };
    }
    // State 4: 아래로 내려감 + 칩 여러 줄 — 세로 왼쪽 정렬
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "8px",
      width: "100%",
    };
  })();

  const keywordsWrapperSx: SxProps<Theme> =
    isMobile || (isWrappedBelow && isChipsWrapping)
      ? // State 4 / 모바일: 칩 세로 정렬
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "6px",
        }
      : // State 1 / 2: 칩 가로 정렬
        {
          display: "flex",
          alignItems: "flex-start",
          gap: "4px",
          flexWrap: "wrap",
        };

  const periodText = getPeriodText(
    summary.period_start_year,
    summary.period_end_year,
  );

  return (
    <Box sx={outerSx}>
      {/* ── 연구자들 정보 + 공통 키워드 ── */}
      <Box sx={profileSectionSx}>
        {/* 연구자들 정보 */}
        <Box ref={researchersInfoRef} sx={researchersInfoSx}>
          {/* 본래 연구자 */}
          <Box sx={researcherSx}>
            <Avatar sx={{ width: 54, height: 54, bgcolor: "#D9D9D9" }} />
            <Box sx={nameInstitutionSx}>
              <Box sx={researcherChipSx}>
                <Typography sx={nameTextSx}>
                  {summary.researcher.name ?? "-"}
                </Typography>
              </Box>
              {summary.researcher.institution !== null && (
                <Typography sx={institutionTextSx}>
                  {summary.researcher.institution}
                </Typography>
              )}
            </Box>
          </Box>

          {/* 연결 아이콘 */}
          <Box sx={{ ...linkIconBoxSx, display: { xs: "none", sm: "flex" } }}>
            <Link size={20} color="#029B56" />
          </Box>

          {/* 공저자 */}
          <Box sx={researcherSx}>
            <Avatar sx={{ width: 54, height: 54, bgcolor: "#D9D9D9" }} />
            <Box sx={nameInstitutionSx}>
              <Box sx={coauthorChipSx}>
                <Typography sx={nameTextSx}>
                  {summary.coauthor.name ?? "-"}
                </Typography>
              </Box>
              {summary.coauthor.institution !== null && (
                <Typography sx={institutionTextSx}>
                  {summary.coauthor.institution}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* 공통 연구 키워드 */}
        {summary.common_keywords.length > 0 && (
          <Box ref={keywordsSectionRef} sx={keywordsSectionSx}>
            <Typography sx={keywordsLabelSx}>공통 연구 키워드</Typography>
            <Box ref={chipsContainerRef} sx={keywordsWrapperSx}>
              {summary.common_keywords.map((kw) => (
                <Box key={kw.keyword} sx={keywordChipSx}>
                  <Typography sx={keywordTextSx}>{kw.keyword}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* ── 공동 연구 정보 ── */}
      <Box sx={statsSectionSx}>
        <Box sx={statItemSx}>
          <Typography sx={statLabelSx}>함께 작성한 논문</Typography>
          <Typography sx={statValueSx}>{summary.co_paper_count}건</Typography>
        </Box>
        <Box sx={statItemSx}>
          <Typography sx={statLabelSx}>공동 연구 기간</Typography>
          <Typography sx={statValueSx}>{periodText}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CoauthorSummarySection;
