import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { FileX } from "lucide-react";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import TopNavBar from "../components/layout/TopNavBar";
import {
  useCoauthorPairSummaryQuery,
  useCoauthoredPapersQuery,
} from "../queries/useResearcherQuery";
import { bookmarkApi } from "../api/bookmark";
import { researcherKeys, bookmarkKeys } from "../queries/keys";
import { type GetCoauthoredPapersParams } from "../api/researcher";
import { type CoauthoredPaperItem } from "../types/researcher";
import BookmarkFolderSelectDialog from "../components/common/BookmarkFolderSelectDialog";
import CoauthorSummarySection from "../components/coauthored-papers/CoauthorSummarySection";
import CoauthoredPapersFilter from "../components/coauthored-papers/CoauthoredPapersFilter";
import CoauthoredPapersList from "../components/coauthored-papers/CoauthoredPapersList";
import Pagination from "../components/common/Pagination";

// ─── 스타일 ───────────────────────────────────────────────

const pageSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: { xs: "background.default", sm: "background.paper" },
};

const contentSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  paddingTop: { xs: "0px", sm: "90px" },
  paddingX: { xs: "0px", sm: "12px" },
  paddingBottom: { xs: "0px", sm: "12px", lg: "44px" },
  flexGrow: 1,
};

const innerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "32px",
  width: "100%",
  padding: { xs: "32px 16px 64px 16px", sm: "32px 32px 64px 32px" },
  backgroundColor: "background.default",
  borderRadius: "8px",
  flexGrow: 1,
};

const filterListWrapperSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  alignSelf: "stretch",
};

const papersLoadingBoxSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignSelf: "stretch",
  py: "32px",
};

const papersEmptyBoxSx: SxProps<Theme> = {
  display: "flex",
  height: "624px",
  padding: "16px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
  gap: "8px",
  alignSelf: "stretch",
  flexWrap: "wrap",
  borderRadius: "12px",
  border: "1px solid #FAFAFC",
  backdropFilter: "blur(2.9px)",
};

const papersEmptyInnerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "4px",
};

const papersEmptyTextSx: SxProps<Theme> = {
  color: "#73757F",
  fontFamily: '"Pretendard Variable"',
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "27px",
  letterSpacing: "-0.336px",
};

// ─── 상수 ─────────────────────────────────────────────────

const DEFAULT_PARAMS: GetCoauthoredPapersParams = {
  sort: "recent",
  page: 1,
  size: 10,
};

// ─── CoauthoredPapersPage ─────────────────────────────────

const CoauthoredPapersPage = () => {
  const navigate = useNavigate();
  const { researcherId = "", coauthorId = "" } = useParams<{
    researcherId: string;
    coauthorId: string;
  }>();
  const queryClient = useQueryClient();

  const [paperParams, setPaperParams] =
    useState<GetCoauthoredPapersParams>(DEFAULT_PARAMS);
  const [bookmarkDialogPaperId, setBookmarkDialogPaperId] = useState<
    string | null
  >(null);

  const { data: summary, isPending: isSummaryPending } =
    useCoauthorPairSummaryQuery(researcherId, coauthorId);

  const { data: papersData, isPending: isPapersPending } =
    useCoauthoredPapersQuery(researcherId, coauthorId, paperParams);

  const papers = papersData?.items ?? [];

  // ─── 핸들러 ───────────────────────────────────────────

  const handleParamsChange = (
    updates: Partial<Omit<GetCoauthoredPapersParams, "page" | "size">>,
  ) => {
    setPaperParams((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPaperParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePaperClick = (paper: CoauthoredPaperItem) => {
    if (paper.can_open_detail && paper.detail_id !== null) {
      navigate(`/papers/${paper.detail_id}`);
    } else if (paper.external_url !== null) {
      window.open(paper.external_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleBookmarkToggle = (paper: CoauthoredPaperItem) => {
    if (paper.paper_id === null) return;

    if (paper.is_bookmarked) {
      bookmarkApi
        .removeBookmark(paper.paper_id)
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: researcherKeys.coauthoredPapers(
              researcherId,
              coauthorId,
              paperParams,
            ),
          });
          void queryClient.invalidateQueries({
            queryKey: bookmarkKeys.savedList(),
          });
          void queryClient.invalidateQueries({
            queryKey: bookmarkKeys.savedFolders(),
          });
          void queryClient.invalidateQueries({
            queryKey: bookmarkKeys.folders(),
          });
        })
        .catch(() => {});
    } else {
      setBookmarkDialogPaperId(paper.paper_id);
    }
  };

  const handleBookmarkAdded = () => {
    void queryClient.invalidateQueries({
      queryKey: researcherKeys.coauthoredPapers(
        researcherId,
        coauthorId,
        paperParams,
      ),
    });
    void queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedList() });
    void queryClient.invalidateQueries({
      queryKey: bookmarkKeys.savedFolders(),
    });
    void queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders() });
    setBookmarkDialogPaperId(null);
  };

  // ─── 로딩 ─────────────────────────────────────────────

  if (isSummaryPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const researcherName = summary?.researcher.name ?? "연구자";
  const coauthorName = summary?.coauthor.name ?? "공저자";
  const yearMin = summary?.period_start_year ?? 1990;
  const yearMax = summary?.period_end_year ?? new Date().getFullYear();

  return (
    <Box sx={pageSx}>
      {/* TopNavBar (sm+) */}
      <Box sx={{ display: { xs: "none", sm: "block" }, width: "100%" }}>
        <TopNavBar
          onBack={() => navigate(-1)}
          coauthoredPapersConfig={{
            researcherName,
            coauthorName,
          }}
        />
      </Box>

      {/* 모바일 헤더 */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          padding: "16px",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "28px",
            height: "28px",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          <CloseIcon
            sx={{ width: "23px", height: "23px", color: "label.normal" }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Typography variant="h5" sx={{ color: "secondary.dark" }}>
            {researcherName} · {coauthorName}
          </Typography>
          <Typography variant="h5" sx={{ color: "label.normal" }}>
            함께 작성한 논문
          </Typography>
        </Box>
      </Box>

      <Box sx={contentSx}>
        <Box sx={innerSx}>
          {summary !== undefined && (
            <CoauthorSummarySection summary={summary} />
          )}

          <Box sx={filterListWrapperSx}>
            <CoauthoredPapersFilter
              params={paperParams}
              yearMin={yearMin}
              yearMax={yearMax}
              researcherName={researcherName}
              coauthorName={coauthorName}
              onParamsChange={handleParamsChange}
            />

            {/* ── 논문 목록 ── */}
            {isPapersPending ? (
              <Box sx={papersLoadingBoxSx}>
                <CircularProgress size={24} />
              </Box>
            ) : papers.length > 0 ? (
              <CoauthoredPapersList
                papers={papers}
                onPaperClick={handlePaperClick}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ) : (
              <Box sx={papersEmptyBoxSx}>
                <Box sx={papersEmptyInnerSx}>
                  <FileX size={20} color="#73757F" />
                  <Typography sx={papersEmptyTextSx}>
                    검색 조건과 일치하는 논문이 없어요.
                  </Typography>
                </Box>
              </Box>
            )}

            {/* ── 페이지네이션 ── */}
            {papersData !== undefined && papersData.total > 0 && (
              <Pagination
                total={papersData.total}
                page={paperParams.page ?? 1}
                size={paperParams.size ?? 6}
                onPageChange={handlePageChange}
              />
            )}
          </Box>
        </Box>
      </Box>

      <BookmarkFolderSelectDialog
        open={bookmarkDialogPaperId !== null}
        onClose={() => setBookmarkDialogPaperId(null)}
        paperId={bookmarkDialogPaperId ?? ""}
        onBookmarkAdded={handleBookmarkAdded}
      />
    </Box>
  );
};

export default CoauthoredPapersPage;
