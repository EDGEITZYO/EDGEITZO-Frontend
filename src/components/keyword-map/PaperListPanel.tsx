import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useQuery } from "@tanstack/react-query";
import PaperCard from "./PaperCard";
import {
  usePaperPanel,
  useKeywordMapActions,
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
  const { closePaperPanel, selectPaper, setCurrentPage } =
    useKeywordMapActions();

  const userId = useAuthStore((state) => state.userId);
  const PAGE_SIZE = 20;

  const { data, isPending, isError } = useQuery({
    queryKey: ["km-papers", panelNodeId, paperFilter, currentPage],
    queryFn: async () => {
      const res = await keywordMapApi.getNodePapers(panelNodeId!, {
        ...paperFilter,
        page: currentPage,
        size: PAGE_SIZE,
        user_id: userId ?? undefined,
      });
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
              backgroundColor: "fill.strong",
            }}
          >
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 600,
                color: "static.white",
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
        }}
      >
        {["발행 연도", "논문 유형"].map((filter) => (
          <Box key={filter} sx={filterChipSx}>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 600,
                color: "label.strong",
                letterSpacing: "-0.34px",
              }}
            >
              {filter}
            </Typography>
            <KeyboardArrowRightIcon
              sx={{
                fontSize: "24px",
                color: "label.strong",
                transform: "rotate(90deg)",
              }}
            />
          </Box>
        ))}
        {["SCI 등재", "KCI 등재"].map((filter) => (
          <Box key={filter} sx={filterChipSx}>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 600,
                color: "label.strong",
                letterSpacing: "-0.34px",
              }}
            >
              {filter}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 논문 목록 */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
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
