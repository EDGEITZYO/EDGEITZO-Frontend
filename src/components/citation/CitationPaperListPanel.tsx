import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { type PaperType } from "../../types/paper";
import type { CitationPaperCard } from "../../types/citation";
import CitationPaperCardComponent from "./CitationPaperCard";
import PaperDetailContent from "../common/PaperDetailContent";
import { bookmarkApi } from "../../api/bookmark";
import BookmarkFolderSelectDialog from "../common/BookmarkFolderSelectDialog";
import { bookmarkKeys } from "../../queries/keys";

// ─── 타입 ─────────────────────────────────────────────────

type PanelView = "list" | "detail";

interface CitationPaperListPanelProps {
  papers: CitationPaperCard[];
  selectedNodeKey: string | null;
  onDetailViewChange: (isDetail: boolean) => void;
  onClose: () => void;
}

// ─── 필터 옵션 ────────────────────────────────────────────

type SortType = "relevance" | "latest" | "oldest" | "citation";

const SORT_OPTIONS: { label: string; value: SortType }[] = [
  { label: "관련도순", value: "relevance" },
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
  { label: "인용높은순", value: "citation" },
];

const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const year = 2026 - i;
  return { label: `${year}년`, value: year };
});

const PAPER_TYPE_OPTIONS: { label: string; value: PaperType }[] = [
  { label: "학술 저널", value: "학술 저널" },
  { label: "박사학위 논문", value: "박사학위 논문" },
  { label: "석사학위 논문", value: "석사학위 논문" },
];

// ─── DropdownFilter ───────────────────────────────────────

interface DropdownFilterProps {
  label: string;
  options: { label: string; value: string | number }[];
  selectedValue: string | number | null;
  onSelect: (value: string | number) => void;
  isMobile: boolean;
  clearable?: boolean;
}

const DropdownFilter = ({
  label,
  options,
  selectedValue,
  onSelect,
  isMobile,
  clearable = false,
}: DropdownFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isSelected = clearable && selectedValue !== null;
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label ?? label;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected) return;
    setAnchorEl(e.currentTarget);
  };

  const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onSelect("__clear__");
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          height: isMobile ? "36px" : "42px",
          padding: isMobile ? "0 8px 0 16px" : "8px 8px 8px 16px",
          alignItems: "center",
          gap: isMobile ? "4px" : "16px",
          borderRadius: "216px",
          backgroundColor: isSelected ? "#1E2026" : "fill.normal",
          cursor: isSelected ? "default" : "pointer",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            color: isSelected
              ? "#FFF"
              : isMobile
                ? "label.neutral"
                : "label.alternative",
            fontSize: isMobile ? "13px" : "16px",
            fontWeight: 400,
            lineHeight: isMobile ? "22px" : "24px",
            letterSpacing: isMobile ? "-0.26px" : "-0.336px",
          }}
        >
          {selectedLabel}
        </Typography>
        <Box
          sx={{
            display: "flex",
            padding: isMobile ? "7px 8px 9px 8px" : "9px 10px 11px 10px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "24px",
          }}
        >
          {isSelected ? (
            <CloseIcon
              onClick={handleClear}
              sx={{ width: 20, height: 20, color: "#FFF", cursor: "pointer" }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{
                width: 20,
                height: 20,
                transform: anchorEl ? "rotate(180deg)" : "none",
              }}
            />
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "28px",
              border: "1px solid",
              borderColor: "label.alternative",
              boxShadow: "none",
              padding: "8px",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === selectedValue}
            onClick={() => {
              onSelect(option.value);
              setAnchorEl(null);
            }}
            sx={{
              borderRadius: "216px",
              fontSize: isMobile ? "13px" : "16px",
              fontWeight: 400,
              lineHeight: isMobile ? "22px" : "24px",
              letterSpacing: isMobile ? "-0.26px" : "-0.336px",
              color: "label.normal",
              justifyContent: "center",
              "&.Mui-selected": { backgroundColor: "background.paper" },
              "&:hover": { backgroundColor: "background.paper" },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// ─── ToggleFilter ─────────────────────────────────────────

interface ToggleFilterProps {
  label: string;
  active: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const ToggleFilter = ({
  label,
  active,
  onToggle,
  isMobile,
}: ToggleFilterProps) => (
  <Box
    onClick={onToggle}
    sx={{
      display: "flex",
      height: isMobile ? "36px" : "auto",
      padding: isMobile ? "0 16px" : "8px 13px",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: isMobile ? "216px" : "24px",
      backgroundColor: active
        ? "label.normal"
        : isMobile
          ? "background.paper"
          : "fill.normal",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    <Typography
      sx={{
        color: active
          ? "#FAFAFC"
          : isMobile
            ? "label.neutral"
            : "label.alternative",
        fontSize: isMobile ? "13px" : "16px",
        fontWeight: 400,
        lineHeight: isMobile ? "22px" : "24px",
        letterSpacing: isMobile ? "-0.26px" : "-0.336px",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// ─── CitationPaperListPanel ───────────────────────────────

const CitationPaperListPanel = ({
  papers,
  selectedNodeKey,
  onDetailViewChange,
  onClose,
}: CitationPaperListPanelProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  const [panelView, setPanelView] = useState<PanelView>("list");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [bookmarkDialogPaperId, setBookmarkDialogPaperId] = useState<
    string | null
  >(null);

  // 필터 상태
  const [sort, setSort] = useState<SortType>("relevance");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterPaperType, setFilterPaperType] = useState<PaperType | null>(
    null,
  );
  const [filterKci, setFilterKci] = useState(false);
  const [filterSci, setFilterSci] = useState(false);

  // 선택된 노드 카드로 스크롤
  const selectedCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (selectedNodeKey && panelView === "list") {
      setTimeout(() => {
        selectedCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [selectedNodeKey, panelView]);

  // 클라이언트 사이드 필터링
  const filteredPapers = papers
    .filter((p) => {
      if (filterYear && p.pub_year !== filterYear) return false;
      if (filterPaperType && p.paper_type !== filterPaperType) return false;
      if (filterKci && !p.kci_registered) return false;
      if (filterSci && !p.sci_indexed) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "latest") return (b.pub_year ?? 0) - (a.pub_year ?? 0);
      if (sort === "oldest") return (a.pub_year ?? 0) - (b.pub_year ?? 0);
      if (sort === "citation")
        return (b.citation_count ?? 0) - (a.citation_count ?? 0);
      return 0;
    });

  // 북마크
  const handleBookmark = (paperId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
      bookmarkApi
        .removeBookmark(paperId)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedList() });
          queryClient.invalidateQueries({
            queryKey: bookmarkKeys.savedFolders(),
          });
          queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders() });
        })
        .catch(() => {});
    } else {
      setBookmarkDialogPaperId(paperId);
    }
  };

  const handleBookmarkAdded = () => {
    queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedList() });
    queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedFolders() });
    queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders() });
    setBookmarkDialogPaperId(null);
  };

  const handlePaperClick = (paperId: string) => {
    setSelectedPaperId(paperId);
    setPanelView("detail");
    onDetailViewChange(true);
  };

  const handleClose = () => {
    if (panelView === "detail") {
      setPanelView("list");
      setSelectedPaperId(null);
      onDetailViewChange(false);
    } else {
      onClose();
    }
  };

  // 필터 바
  const filterBar = (isMobileFilter: boolean) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: isMobileFilter ? "4px" : "8px",
        ...(isMobileFilter && {
          padding: "0 16px",
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }),
        ...(!isMobileFilter && { flexWrap: "wrap" }),
      }}
    >
      <DropdownFilter
        label="관련도순"
        options={SORT_OPTIONS}
        selectedValue={sort}
        onSelect={(v) => {
          if (v !== "__clear__") setSort(v as SortType);
        }}
        isMobile={isMobileFilter}
      />
      <DropdownFilter
        label="발행연도"
        clearable
        options={YEAR_OPTIONS}
        selectedValue={filterYear}
        onSelect={(v) => {
          if (v === "__clear__") {
            setFilterYear(null);
            return;
          }
          setFilterYear(v as number);
        }}
        isMobile={isMobileFilter}
      />
      <DropdownFilter
        label="논문 유형"
        clearable
        options={PAPER_TYPE_OPTIONS}
        selectedValue={filterPaperType}
        onSelect={(v) => {
          if (v === "__clear__") {
            setFilterPaperType(null);
            return;
          }
          setFilterPaperType(v as PaperType);
        }}
        isMobile={isMobileFilter}
      />
      <ToggleFilter
        label="KCI 등재"
        active={filterKci}
        onToggle={() => setFilterKci((prev) => !prev)}
        isMobile={isMobileFilter}
      />
      <ToggleFilter
        label="SCI 등재"
        active={filterSci}
        onToggle={() => setFilterSci((prev) => !prev)}
        isMobile={isMobileFilter}
      />
    </Box>
  );

  // 패널 위치/크기
  const panelPositionSx = isMobile
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1500,
      }
    : {
        width:
          panelView === "detail"
            ? "100%"
            : "calc((100% - 12px) * 734 / (930 + 734))",
        flexShrink: 0,
      };

  return (
    <>
      <Box
        sx={{
          ...panelPositionSx,
          display: "flex",
          flexDirection: "column",
          borderRadius: isMobile ? "0" : "8px",
          backgroundColor: "background.default",
          overflow: "hidden",
        }}
      >
        {/* 모바일 헤더 */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              padding: "16px",
              alignItems: "center",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{ p: 0, width: "28px", height: "28px", flexShrink: 0 }}
            >
              {panelView === "detail" ? (
                <ArrowBackIosNewIcon
                  sx={{ fontSize: 16, color: "label.normal" }}
                />
              ) : (
                <CloseIcon sx={{ fontSize: 24, color: "label.normal" }} />
              )}
            </IconButton>
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "29px",
                letterSpacing: "-0.378px",
              }}
            >
              <Box component="span" sx={{ color: "label.normal" }}>
                논문 리스트{" "}
              </Box>
              <Box component="span" sx={{ color: "primary.main" }}>
                {filteredPapers.length}건
              </Box>
            </Typography>
          </Box>
        )}

        {/* 데스크탑/태블릿 list 헤더 */}
        {!isMobile && panelView === "list" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "16px",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  fontSize: "24px",
                  fontWeight: 600,
                  lineHeight: "36px",
                  letterSpacing: "-0.528px",
                }}
              >
                <Box component="span" sx={{ color: "label.normal" }}>
                  논문 리스트{" "}
                </Box>
                <Box component="span" sx={{ color: "primary.main" }}>
                  {filteredPapers.length}건
                </Box>
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{ width: "36px", height: "36px", padding: "8px" }}
              >
                <CloseIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Box>
            {filterBar(false)}
          </Box>
        )}

        {/* list — 데스크탑/태블릿 */}
        {panelView === "list" && !isMobile && (
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              padding: "0 16px 16px 16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flex: "1 0 0",
                alignSelf: "stretch",
                overflowY: "auto",
              }}
            >
              {filteredPapers.map((paper) => (
                <Box
                  key={paper.key}
                  ref={paper.key === selectedNodeKey ? selectedCardRef : null}
                >
                  <CitationPaperCardComponent
                    paper={paper}
                    isSelected={paper.key === selectedNodeKey}
                    onClick={() => {
                      if (paper.in_service && paper.paper_id) {
                        handlePaperClick(paper.paper_id);
                      }
                    }}
                    onBookmark={
                      paper.in_service
                        ? () =>
                            handleBookmark(
                              paper.paper_id!,
                              paper.is_bookmarked ?? false,
                            )
                        : undefined
                    }
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* list — 모바일 */}
        {panelView === "list" && isMobile && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              overflow: "hidden",
            }}
          >
            {filterBar(true)}
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "0 16px 16px 16px",
              }}
            >
              {filteredPapers.map((paper) => (
                <Box
                  key={paper.key}
                  ref={paper.key === selectedNodeKey ? selectedCardRef : null}
                >
                  <CitationPaperCardComponent
                    paper={paper}
                    isSelected={paper.key === selectedNodeKey}
                    onClick={() => {
                      if (paper.in_service && paper.paper_id) {
                        handlePaperClick(paper.paper_id);
                      }
                    }}
                    onBookmark={
                      paper.in_service
                        ? () =>
                            handleBookmark(
                              paper.paper_id!,
                              paper.is_bookmarked ?? false,
                            )
                        : undefined
                    }
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* detail */}
        {panelView === "detail" && selectedPaperId && (
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              alignSelf: "stretch",
              padding: isMobile ? "16px" : "32px",
            }}
          >
            <PaperDetailContent
              paperId={selectedPaperId}
              onRelatedPaperClick={(paperId) => setSelectedPaperId(paperId)}
              onClose={() => {
                setPanelView("list");
                setSelectedPaperId(null);
                onDetailViewChange(false);
              }}
              onBookmarkChange={() => {
                queryClient.invalidateQueries({
                  queryKey: bookmarkKeys.savedList(),
                });
              }}
              showCitationGraph={false}
            />
          </Box>
        )}
      </Box>

      <BookmarkFolderSelectDialog
        open={bookmarkDialogPaperId !== null}
        onClose={() => setBookmarkDialogPaperId(null)}
        paperId={bookmarkDialogPaperId ?? ""}
        onBookmarkAdded={handleBookmarkAdded}
      />
    </>
  );
};

export default CitationPaperListPanel;
