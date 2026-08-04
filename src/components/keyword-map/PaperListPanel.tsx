import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { type PaperType } from "../../types/paper";
import { type KMPaperSortType, type KMPaperType } from "../../types/keywordMap";
import KMPaperCard from "./KMPaperCard";
import PaperDetailContent from "../common/PaperDetailContent";
import { bookmarkApi } from "../../api/bookmark";
import BookmarkFolderSelectDialog from "../common/BookmarkFolderSelectDialog";
import {
  usePaperPanel,
  useKeywordMapActions,
} from "../../stores/keywordMapStore";
import { useNodePapersQuery } from "../../queries/useNodePapersQuery";
import { keywordMapKeys, bookmarkKeys } from "../../queries/keys";

// ─── 타입 ─────────────────────────────────────────────────

type PanelView = "list" | "detail";

// ─── 필터 옵션 ────────────────────────────────────────────

const SORT_OPTIONS: { label: string; value: KMPaperSortType }[] = [
  { label: "관련도순", value: "relevance" },
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
  { label: "인용높은순", value: "citation" },
];

const YEAR_OPTIONS: { label: string; value: number }[] = Array.from(
  { length: 11 },
  (_, i) => {
    const year = 2026 - i;
    return { label: `${year}년`, value: year };
  },
);

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
              sx={{
                width: 20,
                height: 20,
                color: "#FFF",
                cursor: "pointer",
              }}
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
              "&.Mui-selected": {
                backgroundColor: "background.paper",
              },
              "&:hover": {
                backgroundColor: "background.paper",
              },
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

// ─── PaperListPanel ───────────────────────────────────────

const PaperListPanel = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  const { isPaperPanelOpen, panelNodeKey, panelKeyword, paperFilter } =
    usePaperPanel();
  const { closePaperPanel, setPaperFilter } = useKeywordMapActions();

  const [panelView, setPanelView] = useState<PanelView>("list");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [bookmarkDialogPaperId, setBookmarkDialogPaperId] = useState<
    string | null
  >(null);

  const { data, isPending, isError } = useNodePapersQuery({
    nodeKey: panelNodeKey,
    filter: paperFilter,
    enabled: isPaperPanelOpen,
  });

  if (!isPaperPanelOpen) return null;

  const papers = data?.papers ?? [];
  const keyword = panelKeyword ?? "";

  // ─── 북마크 ─────────────────────────────────────────────

  const handleBookmark = (paperId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
      bookmarkApi
        .removeBookmark(paperId)
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: keywordMapKeys.papers(panelNodeKey ?? "", paperFilter),
          });
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
    queryClient.invalidateQueries({
      queryKey: keywordMapKeys.papers(panelNodeKey ?? "", paperFilter),
    });
    queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedList() });
    queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedFolders() });
    queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders() });
    setBookmarkDialogPaperId(null);
  };

  // ─── 논문 클릭 ──────────────────────────────────────────

  const handlePaperClick = (paperId: string) => {
    setSelectedPaperId(paperId);
    setPanelView("detail");
  };

  // ─── 닫기 ───────────────────────────────────────────────

  const handleClose = () => {
    if (panelView === "detail") {
      setPanelView("list");
      setSelectedPaperId(null);
    } else {
      closePaperPanel();
    }
  };

  // ─── 필터 ───────────────────────────────────────────────

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
        selectedValue={paperFilter.sort}
        onSelect={(value) => {
          if (value === "__clear__") return;
          setPaperFilter({ sort: value as KMPaperSortType });
        }}
        isMobile={isMobileFilter}
      />
      <DropdownFilter
        label="발행연도"
        clearable
        options={YEAR_OPTIONS}
        selectedValue={paperFilter.year ?? null}
        onSelect={(value) => {
          if (value === "__clear__") {
            setPaperFilter({ year: undefined });
            return;
          }
          setPaperFilter({ year: value as number });
        }}
        isMobile={isMobileFilter}
      />
      <DropdownFilter
        label="논문 유형"
        clearable
        options={PAPER_TYPE_OPTIONS}
        selectedValue={paperFilter.paper_type ?? null}
        onSelect={(value) => {
          if (value === "__clear__") {
            setPaperFilter({ paper_type: undefined });
            return;
          }
          setPaperFilter({ paper_type: value as KMPaperType });
        }}
        isMobile={isMobileFilter}
      />
      <ToggleFilter
        label="KCI 등재"
        active={paperFilter.kci === true}
        onToggle={() =>
          setPaperFilter({ kci: paperFilter.kci === true ? undefined : true })
        }
        isMobile={isMobileFilter}
      />
      <ToggleFilter
        label="SCI 등재"
        active={paperFilter.sci === true}
        onToggle={() =>
          setPaperFilter({ sci: paperFilter.sci === true ? undefined : true })
        }
        isMobile={isMobileFilter}
      />
    </Box>
  );

  // ─── 논문 목록 ──────────────────────────────────────────

  const paperList = (isMobileList: boolean) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isPending ? "center" : "flex-start",
        justifyContent: isPending ? "center" : "flex-start",
        gap: isMobileList ? "16px" : "8px",
        flex: "1 0 0",
        alignSelf: "stretch",
        overflowY: "auto",
        ...(isMobileList && {
          padding: "0 16px 16px 16px",
          borderRadius: "12px",
          backgroundColor: "background.default",
          backdropFilter: "blur(2.9px)",
        }),
      }}
    >
      {isPending ? (
        <CircularProgress />
      ) : isError ? (
        <Box
          sx={{
            display: "flex",
            flex: "1 0 0",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            논문을 불러오지 못했어요. 다시 시도해주세요.
          </Typography>
        </Box>
      ) : papers.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flex: "1 0 0",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            탐색 결과에 맞는 논문이 없어요.
          </Typography>
        </Box>
      ) : (
        papers.map((paper) => (
          <KMPaperCard
            key={paper.paper_id}
            paper={paper}
            onClick={() => handlePaperClick(paper.paper_id)}
            onBookmark={() =>
              handleBookmark(paper.paper_id, paper.is_bookmarked)
            }
          />
        ))
      )}
    </Box>
  );

  // ─── 패널 위치/크기 ──────────────────────────────────────

  const panelPositionSx = isMobile
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
      }
    : {
        position: "absolute" as const,
        top: "12px",
        right: "12px",
        bottom: "12px",
        zIndex: 20,
        ...(panelView === "detail"
          ? { left: "12px" }
          : isDesktop
            ? { width: "calc((100% - 12px) * 734 / (930 + 734))" }
            : { left: "12px" }),
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
              <Box component="span" sx={{ color: "#3BA502" }}>
                {keyword}
              </Box>
              <Box component="span" sx={{ color: "label.normal" }}>
                {" "}
                검색 결과
              </Box>
            </Typography>
          </Box>
        )}

        {/* 데스크탑/태블릿 list */}
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
                <Box component="span" sx={{ color: "#3BA502" }}>
                  {keyword}
                </Box>
                <Box component="span" sx={{ color: "label.normal" }}>
                  {" "}
                  검색 결과
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
            {paperList(false)}
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
              borderRadius: "12px",
              backgroundColor: "background.default",
              backdropFilter: "blur(2.9px)",
              overflow: "hidden",
            }}
          >
            {filterBar(true)}
            <Box
              sx={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {paperList(true)}
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
              }}
              onBookmarkChange={() => {
                queryClient.invalidateQueries({
                  queryKey: keywordMapKeys.papers(
                    panelNodeKey ?? "",
                    paperFilter,
                  ),
                });
              }}
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

export default PaperListPanel;
