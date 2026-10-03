import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import TopNavBar from "../components/layout/TopNavBar";
import ResearchFlowTab from "../components/researcher/ResearchFlowTab";
import { type PaperFilter } from "../components/researcher/ResearcherPapersTab";
import {
  useResearcherProfileQuery,
  useResearcherPapersQuery,
  useCoauthorsQuery,
  useResearchFlowQuery,
} from "../queries/useResearcherQuery";
import { bookmarkApi } from "../api/bookmark";
import { researcherKeys, bookmarkKeys } from "../queries/keys";
import { type GetResearcherPapersParams } from "../api/researcher";
import { type ResearcherPaperItem } from "../types/researcher";
import BookmarkFolderSelectDialog from "../components/common/BookmarkFolderSelectDialog";
import CoauthorSection from "../components/researcher/CoauthorSection";
import ResearcherProfile from "../components/researcher/ResearcherProfile";
import ResearcherStatsBox from "../components/researcher/ResearcherStatsBox";

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
  paddingTop: { xs: "72px", sm: "90px" },
  paddingX: { xs: "16px", sm: "12px" },
  paddingBottom: { xs: "80px", sm: "12px", lg: "44px" },
};

const innerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "32px",
  width: "100%",
  padding: "32px",
  backgroundColor: "background.default",
  borderRadius: "8px",
};

// ─── 상수 ─────────────────────────────────────────────────

const DEFAULT_PAPER_PARAMS: GetResearcherPapersParams = {
  sort: "recent",
  page: 1,
};

// ─── ResearcherDetailPage ─────────────────────────────────

const ResearcherDetailPage = () => {
  const navigate = useNavigate();
  const { id: researcherId = "" } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const queryClient = useQueryClient();

  const [paperParams, setPaperParams] =
    useState<GetResearcherPapersParams>(DEFAULT_PAPER_PARAMS);

  const { data: profile, isPending: profilePending } =
    useResearcherProfileQuery(researcherId);
  const { data: papersData } = useResearcherPapersQuery(
    researcherId,
    paperParams,
  );
  const { data: coauthorsData } = useCoauthorsQuery(researcherId);
  const {
    data: researchFlow,
    isPending: isResearchFlowPending,
    isError: isResearchFlowError,
  } = useResearchFlowQuery(researcherId);

  const researcherName = profile?.name_kor ?? profile?.name_eng ?? "연구자";
  const coauthors = coauthorsData?.items ?? [];
  const papers = papersData?.items ?? [];

  const [bookmarkDialogPaperId, setBookmarkDialogPaperId] = useState<
    string | null
  >(null);

  // ─── 핸들러 ───────────────────────────────────────────

  const handleFilterChange = (filter: PaperFilter) => {
    setPaperParams({
      sort: filter.sort,
      page: 1,
      ...(filter.year !== null && { year: filter.year }),
      ...(filter.paper_type !== null && { paper_type: filter.paper_type }),
      ...(filter.kci ? { kci: true } : {}),
      ...(filter.sci ? { sci: true } : {}),
    });
  };

  const handlePageChange = (newPage: number) => {
    setPaperParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePaperClick = (paper: ResearcherPaperItem) => {
    if (paper.can_open_detail && paper.detail_id !== null) {
      navigate(`/papers/${paper.detail_id}`);
    } else if (paper.external_url !== null) {
      window.open(paper.external_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleBookmarkToggle = (paper: ResearcherPaperItem) => {
    if (paper.paper_id === null) return;

    if (paper.is_bookmarked) {
      bookmarkApi
        .removeBookmark(paper.paper_id)
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: researcherKeys.papers(researcherId, paperParams),
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
      queryKey: researcherKeys.papers(researcherId, paperParams),
    });
    void queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedList() });
    void queryClient.invalidateQueries({
      queryKey: bookmarkKeys.savedFolders(),
    });
    void queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders() });
    setBookmarkDialogPaperId(null);
  };

  // ─── 로딩 ─────────────────────────────────────────────

  if (profilePending) {
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

  return (
    <Box sx={pageSx}>
      {/* TopNavBar (sm+) */}
      {/* NOTE: researcherConfig prop은 TopNavBar 코드 확인 후 조정 필요 */}
      <Box sx={{ display: { xs: "none", sm: "block" }, width: "100%" }}>
        <TopNavBar
          onBack={() => navigate(-1)}
          researcherConfig={{ query: q.length > 0 ? q : researcherName }}
        />
      </Box>

      <Box sx={contentSx}>
        <Box sx={innerSx}>
          {/* ── 프로필 ── */}
          {profile !== undefined && <ResearcherProfile profile={profile} />}

          {/* ── Stats ── */}
          {profile !== undefined && (
            <ResearcherStatsBox
              total_papers={profile.total_papers}
              total_citations={profile.total_citations}
            />
          )}

          {/* ── 공저자 ── */}
          <CoauthorSection coauthors={coauthors} />

          {/* ── 진행한 연구 ── */}
          <ResearchFlowTab
            researcherName={researcherName}
            researchFlow={researchFlow}
            isResearchFlowPending={isResearchFlowPending}
            isResearchFlowError={isResearchFlowError}
            papers={papers}
            total={papersData?.total ?? 0}
            page={papersData?.page ?? 1}
            citationSortAvailable={papersData?.citation_sort_available ?? false}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onPaperClick={handlePaperClick}
            onBookmarkToggle={handleBookmarkToggle}
          />
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

export default ResearcherDetailPage;
