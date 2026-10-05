import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Popover,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ArrowUpRight } from "lucide-react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { externalPaperApi } from "../../api/externalPaper";
import { externalPaperKeys } from "../../queries/keys";
import {
  useExternalPaperDetailQuery,
  useRelatedCorpusPapersQuery,
  useAdditionRequestStatusQuery,
} from "../../queries/useExternalPaperQuery";
import RelatedCorpusPaperCard from "./RelatedCorpusPaperCard";
import PaperTypeBadge from "../common/PaperTypeBadge";

// ─── props ────────────────────────────────────────────────

interface OverseasPaperDetailContentProps {
  externalId: string;
  onRelatedPaperClick?: (paperId: string) => void;
  onClose?: () => void;
}

// ─── SectionHeader ────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <Box
    sx={{
      display: "flex",
      padding: "10px 12px",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "2px",
      alignSelf: "stretch",
      borderRadius: "6px",
      backgroundColor: "background.paper",
    }}
  >
    <Typography
      sx={{
        alignSelf: "stretch",
        color: "label.normal",
        fontSize: "18px",
        fontWeight: 600,
        lineHeight: "29px",
        letterSpacing: "-0.378px",
      }}
    >
      {title}
    </Typography>
  </Box>
);

// ─── 체크 / 엑스 아이콘 ───────────────────────────────────

const CheckMark = () => (
  <Box
    sx={{
      width: "20px",
      height: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    }}
  >
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
      <path
        d="M1 3.5L4 6.5L10 1"
        stroke="#4ACE03"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);

const XMark = () => (
  <Box
    sx={{
      width: "20px",
      height: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    }}
  >
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path
        d="M1 1L8 8M8 1L1 8"
        stroke="#E65845"
        strokeWidth="1.667"
        strokeLinecap="round"
      />
    </svg>
  </Box>
);

// ─── 메인 컴포넌트 ────────────────────────────────────────

const OverseasPaperDetailContent = ({
  externalId,
  onRelatedPaperClick,
  onClose,
}: OverseasPaperDetailContentProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const queryClient = useQueryClient();
  const [authorsExpanded, setAuthorsExpanded] = useState(false);
  const [chipAnchorEl, setChipAnchorEl] = useState<HTMLElement | null>(null);

  const handleChipClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setChipAnchorEl(e.currentTarget);
  };

  const {
    data: paperData,
    isPending,
    isError,
  } = useExternalPaperDetailQuery(externalId);
  const { data: relatedData } = useRelatedCorpusPapersQuery(externalId);
  const { data: additionStatus } = useAdditionRequestStatusQuery(externalId);

  const { mutate: requestAddition } = useMutation({
    mutationFn: () =>
      externalPaperApi
        .postAdditionRequest(externalId)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: externalPaperKeys.additionRequest(externalId),
      });
    },
  });

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: "80px",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !paperData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: "80px",
          width: "100%",
        }}
      >
        <Typography>
          논문 정보를 불러오지 못했어요. 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  const authors = paperData.authors ?? [];
  const originUrl = paperData.external_url ?? paperData.pdf_url ?? null;
  const isRequested = additionStatus?.requested ?? false;
  const relatedItems = relatedData?.items ?? [];
  const abstractTitle =
    paperData.enrich_source === "s2_tldr"
      ? "요약 (Semantic Scholar 자동 생성)"
      : "초록";

  const popoverCheckItems: { label: string; available: boolean }[] = [
    { label: "제목 · 저자", available: paperData.title !== null },
    {
      label: "초록",
      available: paperData.enriched && paperData.abstract !== null,
    },
    { label: "인용수 확인", available: paperData.citation_count !== null },
    { label: "북마크 · 읽은 기록 저장", available: false },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        alignSelf: "stretch",
      }}
    >
      {/* 논문 기본 정보 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
        }}
      >
        {/* 배지 행 + 원문 + 북마크 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            rowGap: "12px",
            alignSelf: "stretch",
          }}
        >
          {/* 배지들 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              order: { xs: 2, sm: 1 },
            }}
          >
            {/* 해외논문 칩 */}
            <Box
              onClick={handleChipClick}
              sx={{
                display: "flex",
                padding: "3px 6px 4px 8px",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                borderRadius: "6px",
                backgroundColor: "#EDEFF5",
                cursor: "pointer",
              }}
            >
              <Typography
                sx={{
                  color: "#595B66",
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                해외논문
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  width: "20px",
                  height: "20px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <InfoOutlinedIcon
                  sx={{ width: "20px", height: "20px", color: "#595B66" }}
                />
              </Box>
            </Box>

            {/* 팝오버 */}
            <Popover
              open={chipAnchorEl !== null}
              anchorEl={chipAnchorEl}
              onClose={() => setChipAnchorEl(null)}
              disableRestoreFocus
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    mt: "4px",
                    width: "315px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    borderRadius: "12px",
                    backgroundColor: "#FFF",
                    boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.12)",
                  },
                },
              }}
            >
              {/* 제목 + 설명 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  alignSelf: "stretch",
                }}
              >
                <Typography
                  sx={{
                    alignSelf: "stretch",
                    color: "#1E2026",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "30px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  바이옴 서비스에 없는 외부 논문이에요
                </Typography>
                <Typography
                  sx={{
                    alignSelf: "stretch",
                    color: "#292B33",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    letterSpacing: "-0.28px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {
                    "해외 학술 DB에서 불러온 논문이라\n아직 바이옴 서비스에 저장되어 있지 않아요"
                  }
                </Typography>
              </Box>

              {/* 항목 섹션 */}
              <Box
                sx={{
                  display: "flex",
                  padding: "16px",
                  alignItems: "center",
                  alignSelf: "stretch",
                  borderRadius: "8px",
                  backgroundColor: "#F7F8FA",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "4px",
                  }}
                >
                  {popoverCheckItems.map((item) => (
                    <Box
                      key={item.label}
                      sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      {item.available ? <CheckMark /> : <XMark />}
                      <Typography
                        sx={{
                          color: "#292B33",
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "20px",
                          letterSpacing: "-0.28px",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* 추가 요청 설명 */}
              <Typography
                sx={{
                  alignSelf: "stretch",
                  color: "#292B33",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "20px",
                  letterSpacing: "-0.28px",
                  whiteSpace: "pre-line",
                }}
              >
                {
                  "자주 보는 논문이라면 추가를 요청해 주세요\n서비스에 추가되면 북마크할 수 있어요"
                }
              </Typography>

              {/* 추가 요청하기 / 요청 완료 버튼 */}
              <Box
                onClick={() => {
                  if (!isRequested) requestAddition();
                }}
                sx={{
                  display: "inline-flex",
                  padding: "6px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  borderRadius: "50px",
                  backgroundColor: isRequested ? "#EDEFF5" : "#3BA502",
                  cursor: isRequested ? "default" : "pointer",
                  alignSelf: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    color: isRequested ? "#D8DAE5" : "#FAFAFC",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  {isRequested ? "요청 완료" : "추가 요청하기"}
                </Typography>
              </Box>
            </Popover>

            {/* 논문 유형 */}
            {paperData.paper_type && (
              <PaperTypeBadge paperType={paperData.paper_type} />
            )}

            {/* 인용수 */}
            {paperData.citation_count !== null && (
              <Box
                sx={{
                  display: "inline-flex",
                  padding: "3px 8px 4px 8px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: "label.normal",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                    color: "label.normal",
                  }}
                >
                  인용수 {paperData.citation_count}
                </Typography>
              </Box>
            )}

            {/* KCI */}
            {paperData.kci_registered && (
              <Box
                sx={{
                  display: "inline-flex",
                  padding: "3px 8px 4px 8px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: "secondary.dark",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                    color: "secondary.dark",
                  }}
                >
                  KCI
                </Typography>
              </Box>
            )}
          </Box>

          {/* 원문 + 북마크 + 닫기 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              order: { xs: 1, sm: 2 },
              width: { xs: "100%", sm: "auto" },
              justifyContent: {
                xs: originUrl !== null ? "space-between" : "flex-end",
                sm: "flex-end",
              },
            }}
          >
            {originUrl !== null ? (
              <Box
                onClick={() => window.open(originUrl, "_blank")}
                sx={{
                  display: "inline-flex",
                  padding: "6px 12px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "2px",
                  borderRadius: "24px",
                  backgroundColor: "label.normal",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#FAFAFC",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  논문 원문 보기
                </Typography>
                <ArrowUpRight size={20} color="#FAFAFC" />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "inline-flex",
                  padding: "6px 12px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "2px",
                  borderRadius: "24px",
                  backgroundColor: "#F7F8FA",
                }}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#D8DAE5",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  DOI 미제공
                </Typography>
              </Box>
            )}

            {/* 북마크 + 닫기 묶음 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* 북마크 비활성 */}
              <Tooltip
                title={
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      letterSpacing: "-0.28px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {
                      "해외 논문은 서비스 내에\n수록되지 않아 북마크 할 수 없어요"
                    }
                  </Typography>
                }
                placement="bottom"
                slotProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "#292B33",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    height: "36px",
                    padding: "6px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "2px",
                    borderRadius: "24px",
                    backgroundColor: "background.paper",
                    cursor: "default",
                  }}
                >
                  <BookmarkBorderIcon
                    sx={{ width: "20px", height: "20px", color: "#D8DAE5" }}
                  />
                </Box>
              </Tooltip>

              {/* 닫기 */}
              {onClose && (
                <Box
                  onClick={onClose}
                  sx={{
                    display: "flex",
                    height: "36px",
                    padding: "6px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "24px",
                    backgroundColor: "background.paper",
                    cursor: "pointer",
                  }}
                >
                  <CloseIcon
                    sx={{
                      width: "20px",
                      height: "20px",
                      color: "label.assistive",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* 제목 + 저널정보 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              alignSelf: "stretch",
              color: "label.normal",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.42px",
            }}
          >
            {paperData.title ?? paperData.title_en ?? "제목 없음"}
          </Typography>
          {(paperData.pub_year !== null || paperData.journal_name) && (
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "label.alternative",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.336px",
              }}
            >
              {[paperData.pub_year, paperData.journal_name]
                .filter(Boolean)
                .join(" ")}
            </Typography>
          )}
        </Box>

        {/* 저자 */}
        {authors.length > 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: authors.length > 1 ? "pointer" : "default",
              }}
              onClick={() =>
                authors.length > 1 && setAuthorsExpanded((prev) => !prev)
              }
            >
              <Typography
                sx={{
                  color: "#1B1C23",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                }}
              >
                {authors.length > 1
                  ? `${authors[0]} 외 ${authors.length - 1}인`
                  : authors[0]}
              </Typography>
              {authors.length > 1 && (
                <IconButton
                  sx={{
                    width: "20px",
                    height: "20px",
                    padding: "5px",
                    borderRadius: "12px",
                  }}
                >
                  {authorsExpanded ? (
                    <KeyboardArrowUpIcon sx={{ fontSize: 10 }} />
                  ) : (
                    <KeyboardArrowDownIcon sx={{ fontSize: 10 }} />
                  )}
                </IconButton>
              )}
            </Box>
            {authorsExpanded && (
              <Typography
                sx={{
                  color: "label.assistive",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                  mt: "4px",
                }}
              >
                {authors.join(", ")}
              </Typography>
            )}
          </Box>
        )}

        {/* 키워드 */}
        {paperData.enriched &&
          paperData.keywords &&
          paperData.keywords.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {paperData.keywords.map((kw, index) => (
                <Box
                  key={`${kw}-${index}`}
                  sx={{
                    display: "flex",
                    padding: "3px 8px 4px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "6px",
                    backgroundColor: "background.paper",
                  }}
                >
                  <Typography
                    sx={{
                      color: "label.normal",
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

      {/* 초록 */}
      {paperData.enriched && paperData.abstract && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          <SectionHeader title={abstractTitle} />
          <Box
            sx={{
              display: "flex",
              padding: "0 12px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              alignSelf: "stretch",
            }}
          >
            <Typography
              sx={{
                flex: "1 0 0",
                color: "label.normal",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "27px",
                letterSpacing: "-0.336px",
              }}
            >
              {paperData.abstract}
            </Typography>
          </Box>
        </Box>
      )}

      {/* 연관된 논문 */}
      {relatedItems.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          <SectionHeader title="연관된 논문" />
          <Box
            sx={
              isDesktop
                ? {
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    overflowX: "auto",
                    alignSelf: "stretch",
                    pb: "4px",
                  }
                : {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "12px",
                    alignSelf: "stretch",
                  }
            }
          >
            {relatedItems.map((paper) => (
              <RelatedCorpusPaperCard
                key={paper.paper_id}
                paper={paper}
                isDesktop={isDesktop}
                onClick={() => onRelatedPaperClick?.(paper.paper_id)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OverseasPaperDetailContent;
