import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import TopNavBar from "../components/layout/TopNavBar";
import ResearcherCard from "../components/researcher/ResearcherCard";
import ResearcherSortDropdown from "../components/researcher/ResearcherSortDropdown";
import {
  useResearcherSearchQuery,
  useSaveRecentResearcherSearchMutation,
} from "../queries/useResearcherQuery";
import { type ResearcherSortType } from "../types/researcher";

// ─── 페이지네이션 유틸 ───────────────────────────────────

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): (number | "...")[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "...")[] = [];

  if (currentPage <= 5) {
    for (let i = 1; i <= Math.min(5, totalPages); i++) items.push(i);
    if (totalPages > 5) {
      items.push("...");
      items.push(totalPages);
    }
  } else if (currentPage >= totalPages - 4) {
    items.push(1);
    items.push("...");
    for (let i = totalPages - 4; i <= totalPages; i++) items.push(i);
  } else {
    items.push(1);
    items.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
    items.push("...");
    items.push(totalPages);
  }

  return items;
};

// ─── 스타일 ─────────────────────────────────────────────

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
  alignItems: "center",
  width: "100%",
};

const desktopContentSx: SxProps<Theme> = {
  display: { xs: "none", lg: "flex" },
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "169px",
  paddingX: "144px",
  paddingBottom: "60px",
  gap: "24px",
  width: "100%",
};

const tabletContentSx: SxProps<Theme> = {
  display: { xs: "none", sm: "flex", lg: "none" },
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "166px",
  paddingX: "64px",
  paddingBottom: "96px",
  gap: "24px",
  width: "100%",
};

const mobileContentSx: SxProps<Theme> = {
  display: { xs: "flex", sm: "none" },
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  overflow: "hidden",
};

const mobileHeaderSx: SxProps<Theme> = {
  display: "flex",
  padding: "16px",
  alignItems: "center",
  gap: "8px",
  alignSelf: "stretch",
};

const innerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "24px",
  width: { sm: "100%", lg: "912px" },
};

const countRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  alignSelf: "stretch",
};

const listSx: SxProps<Theme> = {
  display: "flex",
  width: "100%",
  padding: "16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "#FAFAFC",
  backgroundColor: "static.white",
  backdropFilter: "blur(2.9px)",
};

const mobileFilterSx: SxProps<Theme> = {
  display: "flex",
  padding: "0 16px",
  alignItems: "center",
  gap: "4px",
  alignSelf: "stretch",
};

const mobileListSx: SxProps<Theme> = {
  display: "flex",
  width: "100%",
  padding: "16px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
  borderRadius: "12px",
  backgroundColor: "static.white",
  backdropFilter: "blur(2.9px)",
};

const paginationSx: SxProps<Theme> = {
  display: "flex",
  padding: "0 16px",
  alignItems: "center",
  gap: "2px",
};

const pageNumSx = (isActive: boolean): SxProps<Theme> => ({
  display: "flex",
  width: "24px",
  height: "24px",
  flexDirection: "column",
  justifyContent: "center",
  color: isActive ? "primary.light" : "label.alternative",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
  cursor: "pointer",
});

const pageArrowSx = (enabled: boolean): SxProps<Theme> => ({
  display: "flex",
  width: "24px",
  height: "24px",
  padding: "4px 6px",
  justifyContent: "center",
  alignItems: "center",
  cursor: enabled ? "pointer" : "default",
  color: enabled ? "label.alternative" : "line.normal",
});

// ─── 컴포넌트 ────────────────────────────────────────────

const ResearcherSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") ?? "relevance") as ResearcherSortType;
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isFetching } = useResearcherSearchQuery(query, page, sort);
  const { mutate: saveRecentSearch } = useSaveRecentResearcherSearchMutation();

  const totalPages = data ? Math.ceil(data.total / 6) : 0;
  const paginationItems = getPaginationItems(page, totalPages);

  const handleSortChange = (newSort: ResearcherSortType) => {
    setSearchParams({ q: query, sort: newSort, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, sort, page: String(newPage) });
  };

  const handleCardClick = (researcherId: string) => {
    navigate(`/researcher/${researcherId}`);
  };

  const hasSaved = useRef(false);

  useEffect(() => {
    if (data && data.search_type && !hasSaved.current) {
      hasSaved.current = true;
      saveRecentSearch({ query, search_type: data.search_type });
    }
  }, [data, query, saveRecentSearch]);

  const researchers = data?.items ?? [];

  const renderList = (isMobile: boolean) => (
    <Box sx={isMobile ? mobileListSx : listSx}>
      {researchers.map((researcher) => (
        <ResearcherCard
          key={researcher.researcher_id}
          researcher={researcher}
          onClick={() => handleCardClick(researcher.researcher_id)}
        />
      ))}
    </Box>
  );

  const renderPagination = () =>
    totalPages > 1 && (
      <Box sx={{ ...paginationSx, justifyContent: "center", width: "100%" }}>
        <Box
          sx={pageArrowSx(page > 1)}
          onClick={() => page > 1 && handlePageChange(page - 1)}
        >
          <ChevronLeftIcon sx={{ fontSize: 16 }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {paginationItems.map((item, i) =>
            item === "..." ? (
              <Typography key={`ellipsis-${i}`} sx={pageNumSx(false)}>
                ...
              </Typography>
            ) : (
              <Typography
                key={item}
                sx={pageNumSx(page === item)}
                onClick={() => handlePageChange(item as number)}
              >
                {item}
              </Typography>
            ),
          )}
        </Box>
        <Box
          sx={pageArrowSx(page < totalPages)}
          onClick={() => page < totalPages && handlePageChange(page + 1)}
        >
          <ChevronRightIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>
    );

  if (!query) {
    navigate("/researcher");
    return null;
  }

  return (
    <Box sx={pageSx}>
      {/* 데스크탑/태블릿 TopNavBar */}
      <Box sx={{ display: { xs: "none", sm: "block" }, width: "100%" }}>
        <TopNavBar
          onBack={() => navigate("/researcher")}
          researcherConfig={{ query }}
        />
      </Box>

      <Box sx={contentSx}>
        {/* 데스크탑 */}
        <Box sx={desktopContentSx}>
          <Box sx={innerSx}>
            <Box sx={countRowSx}>
              <Box
                sx={{
                  display: "flex",
                  padding: "0 4px",
                  alignItems: "center",
                  gap: "8px",
                  flex: "1 0 0",
                }}
              >
                <Typography variant="h3" sx={{ color: "label.normal" }}>
                  {isFetching ? "검색 중..." : `연구자 ${data?.total ?? 0}명`}
                </Typography>
              </Box>
              <ResearcherSortDropdown
                value={sort}
                onChange={handleSortChange}
              />
            </Box>
            {researchers.length === 0 && !isFetching ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "80px 0",
                  width: "100%",
                }}
              >
                <Typography variant="body1" sx={{ color: "label.alternative" }}>
                  {data?.search_type === "name"
                    ? "일치하는 연구자를 찾을 수 없습니다"
                    : "해당 분야의 연구자를 찾을 수 없습니다"}
                </Typography>
              </Box>
            ) : (
              <>
                {renderList(false)}
                {renderPagination()}
              </>
            )}
          </Box>
        </Box>

        {/* 태블릿 */}
        <Box sx={tabletContentSx}>
          <Box sx={innerSx}>
            <Box sx={countRowSx}>
              <Box
                sx={{
                  display: "flex",
                  padding: "0 4px",
                  alignItems: "center",
                  gap: "8px",
                  flex: "1 0 0",
                }}
              >
                <Typography variant="h3" sx={{ color: "label.normal" }}>
                  {isFetching ? "검색 중..." : `연구자 ${data?.total ?? 0}명`}
                </Typography>
              </Box>
              <ResearcherSortDropdown
                value={sort}
                onChange={handleSortChange}
              />
            </Box>
            {researchers.length === 0 && !isFetching ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "80px 0",
                  width: "100%",
                }}
              >
                <Typography variant="body1" sx={{ color: "label.alternative" }}>
                  {data?.search_type === "name"
                    ? "일치하는 연구자를 찾을 수 없습니다"
                    : "해당 분야의 연구자를 찾을 수 없습니다"}
                </Typography>
              </Box>
            ) : (
              <>
                {renderList(false)}
                {renderPagination()}
              </>
            )}
          </Box>
        </Box>

        {/* 모바일 */}
        <Box sx={mobileContentSx}>
          <Box sx={mobileHeaderSx}>
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
              onClick={() => navigate("/researcher")}
            >
              <CloseIcon
                sx={{ width: "23px", height: "23px", color: "label.normal" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Typography variant="h5" sx={{ color: "secondary.dark" }}>
                {query}
              </Typography>
              <Typography variant="h5" sx={{ color: "label.normal" }}>
                검색 결과
              </Typography>
            </Box>
          </Box>
          <Box sx={mobileFilterSx}>
            <ResearcherSortDropdown
              value={sort}
              onChange={handleSortChange}
              size="small"
            />
          </Box>
          {researchers.length === 0 && !isFetching ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "80px 16px",
                width: "100%",
              }}
            >
              <Typography variant="body1" sx={{ color: "label.alternative" }}>
                {data?.search_type === "name"
                  ? "일치하는 연구자를 찾을 수 없습니다"
                  : "해당 분야의 연구자를 찾을 수 없습니다"}
              </Typography>
            </Box>
          ) : (
            <>
              {renderList(true)}
              {renderPagination()}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ResearcherSearchPage;
