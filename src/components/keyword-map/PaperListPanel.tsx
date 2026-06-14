import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PaperCard from "./PaperCard";
import {
  usePaperPanel,
  useKeywordMapActions,
  useBreadcrumbs,
} from "../../stores/keywordMapStore";
import { keywordMapApi } from "../../api/keywordMap";
import { useAuthStore } from "../../stores/authStore";

const filterChipSx: SxProps<Theme> = {
  px: "13px",
  py: "5px",
  borderRadius: "7px",
  backgroundColor: "background.default",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "3px",
  "&:hover": { backgroundColor: "fill.normal" },
};

interface PaperListPanelProps {
  onFullscreen: () => void;
}

const PaperListPanel = ({ onFullscreen }: PaperListPanelProps) => {
  const {
    isPaperPanelOpen,
    panelNodeId,
    panelKeyword,
    currentPage,
    paperFilter,
  } = usePaperPanel();
  const {
    closePaperPanel,
    selectPaper,
    setCurrentPage,
    setSearchId,
    setPaperFilter,
  } = useKeywordMapActions();
  const breadcrumbs = useBreadcrumbs();

  const userId = useAuthStore((state) => state.userId);
  const queryClient = useQueryClient();
  const PAGE_SIZE = 20;
  const [openFilter, setOpenFilter] = useState<"year" | "type" | null>(null);
  const keywordPath = breadcrumbs.map((b) => b.label).join(",");

  useEffect(() => {
    if (isPaperPanelOpen) {
      queryClient.invalidateQueries({ queryKey: ["home"] });
    }
  }, [isPaperPanelOpen, queryClient]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["km-papers", panelNodeId, paperFilter, currentPage, breadcrumbs],
    queryFn: async () => {
      const res = await keywordMapApi.getNodePapers(panelNodeId!, {
        ...paperFilter,
        page: currentPage,
        size: PAGE_SIZE,
        user_id: userId ?? undefined,
        keyword_path: keywordPath || undefined,
      });
      setSearchId(res.data.data.search_id ?? null);
      return res.data.data;
    },
    enabled: isPaperPanelOpen && panelNodeId !== null,
    staleTime: 1000 * 60 * 3,
  });

  if (!isPaperPanelOpen) return null;

  const papers = data?.papers ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePaperClick = (paperId: string) => {
    selectPaper(paperId);
    onFullscreen();
  };

  return (
    <Box
      sx={{
        width: "762px",
        height: "100%",
        position: "absolute",
        right: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: "11px 0 0 11px",
        backgroundColor: "background.paper",
        boxShadow: "0 0 9px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 10px 9px 25px",
          borderBottom: "1px solid",
          borderColor: "line.normal",
          backgroundColor: "background.paper",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Box
            sx={{
              px: "9px",
              py: "6px",
              borderRadius: "7px",
              backgroundColor: "#CBCDD7",
            }}
          >
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 600,
                color: "#31333F",
                letterSpacing: "-0.34px",
              }}
            >
              {panelKeyword}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "17px",
              fontWeight: 600,
              color: "label.strong",
              letterSpacing: "-0.34px",
            }}
          >
            검색 결과 {totalCount}건
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onFullscreen} size="small">
            <FullscreenIcon sx={{ fontSize: "24px", color: "label.strong" }} />
          </IconButton>
          <IconButton onClick={closePaperPanel} size="small">
            <CloseIcon sx={{ fontSize: "24px", color: "label.strong" }} />
          </IconButton>
        </Box>
      </Box>

      {/* 필터 바 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "9px 10px 9px 25px",
          borderBottom: "1px solid",
          borderColor: "line.normal",
          backgroundColor: "background.paper",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* 발행 연도 드롭다운 */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              ...filterChipSx,
              backgroundColor: paperFilter.year_range
                ? "static.black"
                : "background.default",
            }}
            onClick={() =>
              setOpenFilter((prev) => (prev === "year" ? null : "year"))
            }
          >
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 600,
                color: paperFilter.year_range ? "static.white" : "label.strong",
                letterSpacing: "-0.34px",
              }}
            >
              {paperFilter.year_range === "3y"
                ? "3년"
                : paperFilter.year_range === "5y"
                  ? "5년"
                  : paperFilter.year_range === "10y"
                    ? "10년"
                    : "발행 연도"}
            </Typography>
            <KeyboardArrowRightIcon
              sx={{
                fontSize: "24px",
                color: paperFilter.year_range ? "static.white" : "label.strong",
                transform: "rotate(90deg)",
              }}
            />
          </Box>
          {openFilter === "year" && (
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                zIndex: 100,
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "line.normal",
                backgroundColor: "background.default",
                minWidth: "120px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {([null, "3y", "5y", "10y"] as const).map((val) => (
                <Box
                  key={val ?? "all"}
                  sx={{
                    px: "16px",
                    py: "10px",
                    cursor: "pointer",
                    backgroundColor:
                      paperFilter.year_range === val
                        ? "fill.normal"
                        : "transparent",
                    "&:hover": { backgroundColor: "fill.normal" },
                  }}
                  onClick={() => {
                    setPaperFilter({ year_range: val ?? undefined });
                    setOpenFilter(null);
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: paperFilter.year_range === val ? 600 : 400,
                      color: "label.strong",
                    }}
                  >
                    {val === null
                      ? "전체"
                      : val === "3y"
                        ? "3년"
                        : val === "5y"
                          ? "5년"
                          : "10년"}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* 논문 유형 드롭다운 */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              ...filterChipSx,
              backgroundColor: paperFilter.paper_type
                ? "static.black"
                : "background.default",
            }}
            onClick={() =>
              setOpenFilter((prev) => (prev === "type" ? null : "type"))
            }
          >
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 600,
                color: paperFilter.paper_type ? "static.white" : "label.strong",
                letterSpacing: "-0.34px",
              }}
            >
              {paperFilter.paper_type ?? "논문 유형"}
            </Typography>
            <KeyboardArrowRightIcon
              sx={{
                fontSize: "24px",
                color: paperFilter.paper_type ? "static.white" : "label.strong",
                transform: "rotate(90deg)",
              }}
            />
          </Box>
          {openFilter === "type" && (
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                zIndex: 100,
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "line.normal",
                backgroundColor: "background.default",
                minWidth: "160px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {(
                [null, "학술 저널", "박사학위 논문", "석사학위 논문"] as const
              ).map((val) => (
                <Box
                  key={val ?? "all"}
                  sx={{
                    px: "16px",
                    py: "10px",
                    cursor: "pointer",
                    backgroundColor:
                      paperFilter.paper_type === val
                        ? "fill.normal"
                        : "transparent",
                    "&:hover": { backgroundColor: "fill.normal" },
                  }}
                  onClick={() => {
                    setPaperFilter({ paper_type: val ?? undefined });
                    setOpenFilter(null);
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: paperFilter.paper_type === val ? 600 : 400,
                      color: "label.strong",
                    }}
                  >
                    {val ?? "전체"}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* SCI 등재 */}
        <Box
          sx={{
            ...filterChipSx,
            backgroundColor:
              paperFilter.sci === true ? "static.black" : "background.default",
          }}
          onClick={() => {
            setPaperFilter({
              sci: paperFilter.sci === true ? undefined : true,
            });
            setOpenFilter(null);
          }}
        >
          <Typography
            sx={{
              fontSize: "17px",
              fontWeight: 600,
              color: paperFilter.sci === true ? "static.white" : "label.strong",
              letterSpacing: "-0.34px",
            }}
          >
            SCI 등재
          </Typography>
        </Box>

        {/* KCI 등재 */}
        <Box
          sx={{
            ...filterChipSx,
            backgroundColor:
              paperFilter.kci === true ? "static.black" : "background.default",
          }}
          onClick={() => {
            setPaperFilter({
              kci: paperFilter.kci === true ? undefined : true,
            });
            setOpenFilter(null);
          }}
        >
          <Typography
            sx={{
              fontSize: "17px",
              fontWeight: 600,
              color: paperFilter.kci === true ? "static.white" : "label.strong",
              letterSpacing: "-0.34px",
            }}
          >
            KCI 등재
          </Typography>
        </Box>
      </Box>

      {/* 논문 목록 */}
      <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", padding: "12px" }}>
        {isPending ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography sx={{ fontSize: "16px", color: "label.alternative" }}>
              논문을 불러오지 못했어요. 다시 시도해주세요.
            </Typography>
          </Box>
        ) : papers.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: "static.black",
                letterSpacing: "-0.48px",
              }}
            >
              검색 조건에 맞는 학술 자료가 없어요
            </Typography>
          </Box>
        ) : (
          papers.map((paper) => (
            <PaperCard
              key={paper.paper_id}
              paper={paper}
              onClick={handlePaperClick}
            />
          ))
        )}
      </Box>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            flexShrink: 0,
            borderTop: "1px solid",
            borderColor: "line.normal",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              px: "12px",
              py: "3px",
              borderRadius: "91px",
              backgroundColor: "background.default",
              boxShadow: "0 0 8.9px rgba(0, 0, 0, 0.1)",
            }}
          >
            <KeyboardArrowLeftIcon
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              sx={{
                fontSize: "20px",
                cursor: currentPage > 1 ? "pointer" : "default",
                color: currentPage > 1 ? "label.strong" : "label.disable",
              }}
            />
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.4px",
              }}
            >
              <Box component="span" sx={{ color: "label.strong" }}>
                {currentPage}
              </Box>
              <Box component="span" sx={{ color: "label.assistive" }}>
                /{totalPages}
              </Box>
            </Typography>
            <KeyboardArrowRightIcon
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              sx={{
                fontSize: "20px",
                cursor: currentPage < totalPages ? "pointer" : "default",
                color:
                  currentPage < totalPages ? "label.strong" : "label.disable",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaperListPanel;
