import { useState, useRef, useEffect } from "react";
import { Box, Typography, Menu, MenuItem, Slider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { type CoauthoredPaperRoleFilter } from "../../types/researcher";
import { type GetCoauthoredPapersParams } from "../../api/researcher";

// ─── 타입 ─────────────────────────────────────────────────

type PaperTypeFilter = "학술 저널" | "박사학위 논문" | "석사학위 논문";

type AuthorType = "researcher" | "coauthor";

type SelectedAuthorRole =
  | { authorType: AuthorType; role: CoauthoredPaperRoleFilter }
  | undefined;

// ─── 옵션 상수 ────────────────────────────────────────────

const AUTHOR_ROLE_OPTIONS: {
  label: string;
  value: CoauthoredPaperRoleFilter;
}[] = [
  { label: "제1저자", value: "first" },
  { label: "교신저자", value: "corresponding" },
  { label: "공동저자", value: "participant" },
];

const PAPER_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "학술 저널", value: "학술 저널" },
  { label: "박사학위 논문", value: "박사학위 논문" },
  { label: "석사학위 논문", value: "석사학위 논문" },
];

// ─── DropdownFilter ───────────────────────────────────────

interface DropdownFilterProps {
  label: string;
  options: { label: string; value: string }[];
  selectedValue: string | null;
  onSelect: (value: string | "__clear__") => void;
  isMobile: boolean;
  clearable?: boolean;
  disabled?: boolean;
}

const DropdownFilter = ({
  label,
  options,
  selectedValue,
  onSelect,
  isMobile,
  clearable = false,
  disabled = false,
}: DropdownFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isSelected = clearable && selectedValue !== null;
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label ?? label;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected || disabled) return;
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
          cursor: disabled ? "not-allowed" : isSelected ? "default" : "pointer",
          flexShrink: 0,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            color: isSelected ? "#FFF" : "label.alternative",
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
                transform: anchorEl !== null ? "rotate(180deg)" : "none",
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
        color: active ? "#FAFAFC" : "label.alternative",
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

// ─── AuthorRoleDropdown ───────────────────────────────────

// 변경 후
interface AuthorRoleDropdownProps {
  researcherName: string;
  coauthorName: string;
  selectedAuthorRole: SelectedAuthorRole;
  isMobile: boolean;
  onChange: (selected: SelectedAuthorRole) => void;
  onClear: () => void;
}

// 변경 후
const AuthorRoleDropdown = ({
  researcherName,
  coauthorName,
  selectedAuthorRole,
  isMobile,
  onChange,
  onClear,
}: AuthorRoleDropdownProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const isSelected = selectedAuthorRole !== undefined;

  const selectedName = isSelected
    ? selectedAuthorRole.authorType === "researcher"
      ? researcherName
      : coauthorName
    : undefined;

  const selectedRoleLabel = isSelected
    ? AUTHOR_ROLE_OPTIONS.find((o) => o.value === selectedAuthorRole.role)
        ?.label
    : undefined;

  const isRowSelected = (
    authorType: AuthorType,
    role: CoauthoredPaperRoleFilter,
  ) =>
    selectedAuthorRole?.authorType === authorType &&
    selectedAuthorRole?.role === role;

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // 모바일: 스크롤 시 패널 위치 추적
  useEffect(() => {
    if (!open || !isMobile) return;
    const updatePos = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        setPanelPos({ top: rect.bottom + 4, left: 16 });
      }
    };
    window.addEventListener("scroll", updatePos, true);
    return () => window.removeEventListener("scroll", updatePos, true);
  }, [open, isMobile]);

  // 모바일: 바디 스크롤 잠금
  useEffect(() => {
    if (!isMobile || !open) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open, isMobile]);

  const handleTriggerClick = () => {
    if (!open && isMobile) {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        setPanelPos({ top: rect.bottom + 4, left: 16 });
      }
    }
    setOpen((prev) => !prev);
  };

  const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onClear();
    setOpen(false);
  };

  const handleRowClick = (
    authorType: AuthorType,
    role: CoauthoredPaperRoleFilter,
  ) => {
    onChange({ authorType, role });
    setOpen(false);
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative" }}>
      {/* 트리거 버튼 */}
      <Box
        ref={triggerRef}
        onClick={handleTriggerClick}
        sx={{
          display: "flex",
          height: isMobile ? "36px" : "42px",
          width: isMobile ? "auto" : "240px",
          padding: isMobile ? "0 8px 0 16px" : "8px 8px 8px 16px",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "216px",
          backgroundColor: isSelected ? "#1E2026" : "fill.normal",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {isSelected ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                maxWidth: "73px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "#FFF",
                fontSize: isMobile ? "13px" : "16px",
                fontWeight: 400,
                lineHeight: isMobile ? "22px" : "24px",
                letterSpacing: isMobile ? "-0.26px" : "-0.336px",
              }}
            >
              {selectedName}
            </Typography>
            <Typography
              sx={{
                color: "#FFF",
                fontSize: isMobile ? "13px" : "16px",
                fontWeight: 400,
                lineHeight: isMobile ? "22px" : "24px",
                letterSpacing: isMobile ? "-0.26px" : "-0.336px",
                whiteSpace: "nowrap",
              }}
            >
              {selectedRoleLabel}
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{
              color: "label.alternative",
              fontSize: isMobile ? "13px" : "16px",
              fontWeight: 400,
              lineHeight: isMobile ? "22px" : "24px",
              letterSpacing: isMobile ? "-0.26px" : "-0.336px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            저자 역할
          </Typography>
        )}
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
                transform: open ? "rotate(180deg)" : "none",
              }}
            />
          )}
        </Box>
      </Box>

      {/* 데스크탑 패널 (absolute) */}
      {open && !isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            width: "239px",
            padding: "8px",
            gap: "12px",
            borderRadius: "16px",
            border: "1px solid #73757F",
            backgroundColor: "background.default",
          }}
        >
          <Box sx={{ display: "flex", gap: "8px", alignSelf: "stretch" }}>
            {/* 연구자 컬럼 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
                flex: 1,
                minWidth: 0,
              }}
            >
              {AUTHOR_ROLE_OPTIONS.map((opt) => {
                const rowSelected = isRowSelected("researcher", opt.value);
                return (
                  <Box
                    key={`researcher-${opt.value}`}
                    onClick={() => handleRowClick("researcher", opt.value)}
                    sx={{
                      display: "flex",
                      padding: "4px 6px",
                      gap: "4px",
                      alignItems: "center",
                      borderRadius: "7px",
                      backgroundColor: rowSelected ? "#1E2026" : "#F7F8FA",
                      cursor: "pointer",
                      alignSelf: "stretch",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        padding: "1px 6px",
                        alignItems: "center",
                        borderRadius: "6px",
                        backgroundColor: rowSelected
                          ? "rgba(255,255,255,0.15)"
                          : "#E6F9F0",
                        flexShrink: 0,
                        maxWidth: "46px",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        sx={{
                          color: rowSelected ? "#FFF" : "#1E2026",
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "22px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {researcherName}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: rowSelected ? "#FFF" : "label.normal",
                        fontSize: "13px",
                        fontWeight: 400,
                        lineHeight: "22px",
                        letterSpacing: "-0.26px",
                      }}
                    >
                      {opt.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* 공저자 컬럼 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
                flex: 1,
                minWidth: 0,
              }}
            >
              {AUTHOR_ROLE_OPTIONS.map((opt) => {
                const rowSelected = isRowSelected("coauthor", opt.value);
                return (
                  <Box
                    key={`coauthor-${opt.value}`}
                    onClick={() => handleRowClick("coauthor", opt.value)}
                    sx={{
                      display: "flex",
                      padding: "4px 6px",
                      gap: "4px",
                      alignItems: "center",
                      borderRadius: "7px",
                      backgroundColor: rowSelected ? "#1E2026" : "#F7F8FA",
                      cursor: "pointer",
                      alignSelf: "stretch",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        padding: "1px 6px",
                        alignItems: "center",
                        borderRadius: "6px",
                        backgroundColor: rowSelected
                          ? "rgba(255,255,255,0.15)"
                          : "#EDF0FF",
                        flexShrink: 0,
                        maxWidth: "46px",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        sx={{
                          color: rowSelected ? "#FFF" : "#1E2026",
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "22px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {coauthorName}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: rowSelected ? "#FFF" : "label.normal",
                        fontSize: "13px",
                        fontWeight: 400,
                        lineHeight: "22px",
                        letterSpacing: "-0.26px",
                      }}
                    >
                      {opt.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}

      {/* 모바일 패널 (fixed) */}
      {open && isMobile && panelPos && (
        <Box
          sx={{
            position: "fixed",
            top: panelPos.top,
            left: panelPos.left,
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            width: `${window.innerWidth - 32}px`,
            padding: "12px 8px",
            gap: "12px",
            borderRadius: "16px",
            border: "1px solid #73757F",
            backgroundColor: "background.default",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              alignSelf: "stretch",
            }}
          >
            {/* 연구자 역할 행 */}
            {AUTHOR_ROLE_OPTIONS.map((opt) => {
              const rowSelected = isRowSelected("researcher", opt.value);
              return (
                <Box
                  key={`researcher-${opt.value}`}
                  onClick={() => handleRowClick("researcher", opt.value)}
                  sx={{
                    display: "flex",
                    padding: "4px 6px",
                    alignItems: "center",
                    gap: "4px",
                    alignSelf: "stretch",
                    borderRadius: "7px",
                    backgroundColor: rowSelected ? "#1E2026" : "#F7F8FA",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      padding: "1px 6px",
                      alignItems: "center",
                      borderRadius: "6px",
                      backgroundColor: rowSelected
                        ? "rgba(255,255,255,0.15)"
                        : "#E6F9F0",
                      flexShrink: 0,
                      maxWidth: "100px",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        color: rowSelected ? "#FFF" : "#1E2026",
                        fontSize: "11px",
                        fontWeight: 400,
                        lineHeight: "18px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {researcherName}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: rowSelected ? "#FFF" : "label.normal",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                    }}
                  >
                    {opt.label}
                  </Typography>
                </Box>
              );
            })}

            {/* 공저자 역할 행 */}
            {AUTHOR_ROLE_OPTIONS.map((opt) => {
              const rowSelected = isRowSelected("coauthor", opt.value);
              return (
                <Box
                  key={`coauthor-${opt.value}`}
                  onClick={() => handleRowClick("coauthor", opt.value)}
                  sx={{
                    display: "flex",
                    padding: "4px 6px",
                    alignItems: "center",
                    gap: "4px",
                    alignSelf: "stretch",
                    borderRadius: "7px",
                    backgroundColor: rowSelected ? "#1E2026" : "#F7F8FA",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      padding: "1px 6px",
                      alignItems: "center",
                      borderRadius: "6px",
                      backgroundColor: rowSelected
                        ? "rgba(255,255,255,0.15)"
                        : "#EDF0FF",
                      flexShrink: 0,
                      maxWidth: "100px",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        color: rowSelected ? "#FFF" : "#1E2026",
                        fontSize: "11px",
                        fontWeight: 400,
                        lineHeight: "18px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {coauthorName}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: rowSelected ? "#FFF" : "label.normal",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                    }}
                  >
                    {opt.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

// ─── CoauthoredPapersFilter ───────────────────────────────

export interface CoauthoredPapersFilterProps {
  params: GetCoauthoredPapersParams;
  yearMin: number;
  yearMax: number;
  researcherName: string;
  coauthorName: string;
  onParamsChange: (
    updates: Partial<Omit<GetCoauthoredPapersParams, "page" | "size">>,
  ) => void;
}

const CoauthoredPapersFilter = ({
  params,
  yearMin,
  yearMax,
  researcherName,
  coauthorName,
  onParamsChange,
}: CoauthoredPapersFilterProps) => {
  const [yearOpen, setYearOpen] = useState(false);
  const [tempRange, setTempRange] = useState<[number, number]>([
    yearMin,
    yearMax,
  ]);
  const yearRefDesktop = useRef<HTMLDivElement>(null);
  const yearRefMobile = useRef<HTMLDivElement>(null);
  const yearMobileTriggerRef = useRef<HTMLDivElement>(null);
  const [mobilePanelPos, setMobilePanelPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const isYearApplied = params.year_start != null && params.year_end != null;
  const isApplyDisabled = tempRange[0] === yearMin && tempRange[1] === yearMax;

  // 발행연도 외부 클릭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = yearRefDesktop.current?.contains(target) ?? false;
      const insideMobile = yearRefMobile.current?.contains(target) ?? false;
      if (!insideDesktop && !insideMobile) setYearOpen(false);
    };
    if (yearOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [yearOpen]);

  // 발행연도 모바일 스크롤 추적
  useEffect(() => {
    if (!yearOpen) return;
    const updatePosition = () => {
      const rect = yearMobileTriggerRef.current?.getBoundingClientRect();
      if (rect) {
        const panelWidth = 204;
        const left =
          rect.left + panelWidth > window.innerWidth
            ? window.innerWidth - panelWidth - 8
            : rect.left;
        setMobilePanelPos({ top: rect.bottom + 4, left });
      }
    };
    window.addEventListener("scroll", updatePosition, true);
    return () => window.removeEventListener("scroll", updatePosition, true);
  }, [yearOpen]);

  // 발행연도 바디 스크롤 잠금
  useEffect(() => {
    if (yearOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [yearOpen]);

  const handleYearToggle = () => {
    if (!yearOpen) {
      setTempRange([params.year_start ?? yearMin, params.year_end ?? yearMax]);
      const mobileRect = yearMobileTriggerRef.current?.getBoundingClientRect();
      if (mobileRect && mobileRect.width > 0) {
        const panelWidth = 204;
        const left =
          mobileRect.left + panelWidth > window.innerWidth
            ? window.innerWidth - panelWidth - 8
            : mobileRect.left;
        setMobilePanelPos({ top: mobileRect.bottom + 4, left });
      }
    }
    setYearOpen((prev) => !prev);
  };

  const handleYearClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setYearOpen(false);
    onParamsChange({ year_start: null, year_end: null });
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [s, end] = newValue as [number, number];
    setTempRange([s, end]);
  };

  const handleYearApply = () => {
    onParamsChange({ year_start: tempRange[0], year_end: tempRange[1] });
    setYearOpen(false);
  };

  const selectedAuthorRole: SelectedAuthorRole =
    params.researcher_role != null
      ? { authorType: "researcher", role: params.researcher_role }
      : params.coauthor_role != null
        ? { authorType: "coauthor", role: params.coauthor_role }
        : undefined;

  const handleAuthorRoleChange = (selected: SelectedAuthorRole) => {
    if (selected === undefined) {
      onParamsChange({ researcher_role: null, coauthor_role: null });
      return;
    }
    if (selected.authorType === "researcher") {
      onParamsChange({
        researcher_role: selected.role,
        coauthor_role: null,
      });
    } else {
      onParamsChange({
        researcher_role: null,
        coauthor_role: selected.role,
      });
    }
  };

  const handleRoleClear = () => {
    onParamsChange({ researcher_role: null, coauthor_role: null });
  };

  // ─ 발행연도 트리거 공통 UI
  const yearTriggerContent = (mobile: boolean) => (
    <>
      <Typography
        sx={{
          color: isYearApplied ? "#FFF" : "label.alternative",
          fontSize: mobile ? "13px" : "16px",
          fontWeight: 400,
          lineHeight: mobile ? "22px" : "24px",
          letterSpacing: mobile ? "-0.26px" : "-0.336px",
          whiteSpace: mobile ? "nowrap" : undefined,
          flexShrink: mobile ? 0 : undefined,
        }}
      >
        {isYearApplied
          ? `${params.year_start} ~ ${params.year_end}년`
          : "발행연도"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          padding: mobile ? "7px 8px 9px 8px" : "9px 10px 11px 10px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "24px",
        }}
      >
        {isYearApplied ? (
          <CloseIcon
            onClick={handleYearClear}
            sx={{ width: 20, height: 20, color: "#FFF", cursor: "pointer" }}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{
              width: 20,
              height: 20,
              transform: yearOpen ? "rotate(180deg)" : "none",
            }}
          />
        )}
      </Box>
    </>
  );

  // ─ 슬라이더 패널 공통 UI
  const sliderPanel = (mobile: boolean) => (
    <>
      <Box
        sx={{
          display: "flex",
          padding: "0 8px 8px 8px",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "3px",
            flex: "1 0 0",
          }}
        >
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              color: "label.normal",
              fontSize: mobile ? "13px" : "16px",
              fontWeight: 400,
              lineHeight: mobile ? "22px" : "24px",
              letterSpacing: mobile ? "-0.26px" : "-0.336px",
              alignSelf: "stretch",
            }}
          >
            {tempRange[0]} ~ {tempRange[1]}년
          </Typography>
          <Slider
            value={tempRange}
            onChange={handleSliderChange}
            min={yearMin}
            max={yearMax}
            step={1}
            size="small"
            sx={{
              ...(mobile ? { "&&": { padding: "13px 0" } } : {}),
              alignSelf: "stretch",
              color: "#92E268",
              "& .MuiSlider-rail": { backgroundColor: "#E9EAF2", opacity: 1 },
              "& .MuiSlider-thumb": {
                border: "1px solid #73757F",
                backgroundColor: "#F7F8FA",
              },
            }}
          />
        </Box>
      </Box>
      <Box
        onClick={!isApplyDisabled ? handleYearApply : undefined}
        sx={{
          display: "flex",
          width: mobile ? "184px" : "208px",
          padding: "8px 0",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          backgroundColor: isApplyDisabled ? "label.disable" : "label.normal",
          cursor: isApplyDisabled ? "default" : "pointer",
          userSelect: "none",
        }}
      >
        <Typography
          sx={{
            color: "#FAFAFC",
            fontSize: mobile ? "13px" : "16px",
            fontWeight: 400,
            lineHeight: mobile ? "22px" : "24px",
            letterSpacing: mobile ? "-0.26px" : "-0.336px",
          }}
        >
          적용
        </Typography>
      </Box>
    </>
  );

  return (
    <>
      {/* 데스크탑 / 태블릿 narrow */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          justifyContent: "flex-end",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <AuthorRoleDropdown
            researcherName={researcherName}
            coauthorName={coauthorName}
            isMobile={false}
            onClear={handleRoleClear}
            selectedAuthorRole={selectedAuthorRole}
            onChange={handleAuthorRoleChange}
          />

          {/* 발행연도 (데스크탑) */}
          <Box ref={yearRefDesktop} sx={{ position: "relative" }}>
            <Box
              onClick={handleYearToggle}
              sx={{
                display: "flex",
                height: "42px",
                padding: "8px 8px 8px 16px",
                alignItems: "center",
                gap: "16px",
                borderRadius: "216px",
                backgroundColor: isYearApplied ? "#1E2026" : "fill.normal",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {yearTriggerContent(false)}
            </Box>
            {yearOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  zIndex: 100,
                  display: "flex",
                  width: "240px",
                  padding: "16px 8px",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0px",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "label.alternative",
                  backgroundColor: "background.default",
                }}
              >
                {sliderPanel(false)}
              </Box>
            )}
          </Box>

          <DropdownFilter
            label="논문 유형"
            clearable
            options={PAPER_TYPE_OPTIONS}
            selectedValue={params.paper_type ?? null}
            onSelect={(value) => {
              if (value === "__clear__") {
                onParamsChange({ paper_type: null });
                return;
              }
              onParamsChange({ paper_type: value as PaperTypeFilter });
            }}
            isMobile={false}
          />
          <ToggleFilter
            label="KCI 등재"
            active={params.kci ?? false}
            onToggle={() => onParamsChange({ kci: params.kci ? null : true })}
            isMobile={false}
          />
          <ToggleFilter
            label="SCI 등재"
            active={params.sci ?? false}
            onToggle={() => onParamsChange({ sci: params.sci ? null : true })}
            isMobile={false}
          />
        </Box>
      </Box>

      {/* 모바일 */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          gap: "4px",
          overflowX: "auto",
          alignSelf: "stretch",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <AuthorRoleDropdown
          researcherName={researcherName}
          coauthorName={coauthorName}
          isMobile={true}
          onClear={handleRoleClear}
          selectedAuthorRole={selectedAuthorRole}
          onChange={handleAuthorRoleChange}
        />

        {/* 발행연도 (모바일) */}
        <Box ref={yearRefMobile} sx={{ position: "relative" }}>
          <Box
            ref={yearMobileTriggerRef}
            onClick={handleYearToggle}
            sx={{
              display: "flex",
              height: "36px",
              padding: "0 8px 0 16px",
              alignItems: "center",
              gap: "4px",
              borderRadius: "216px",
              backgroundColor: isYearApplied ? "#1E2026" : "fill.normal",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {yearTriggerContent(true)}
          </Box>
          {yearOpen && mobilePanelPos && (
            <Box
              sx={{
                position: "fixed",
                top: mobilePanelPos.top,
                left: mobilePanelPos.left,
                zIndex: 1300,
                display: "flex",
                width: "204px",
                padding: "12px 8px",
                flexDirection: "column",
                alignItems: "center",
                gap: "0px",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "label.alternative",
                backgroundColor: "background.default",
              }}
            >
              {sliderPanel(true)}
            </Box>
          )}
        </Box>

        <DropdownFilter
          label="논문 유형"
          clearable
          options={PAPER_TYPE_OPTIONS}
          selectedValue={params.paper_type ?? null}
          onSelect={(value) => {
            if (value === "__clear__") {
              onParamsChange({ paper_type: null });
              return;
            }
            onParamsChange({ paper_type: value as PaperTypeFilter });
          }}
          isMobile={true}
        />
        <ToggleFilter
          label="KCI 등재"
          active={params.kci ?? false}
          onToggle={() => onParamsChange({ kci: params.kci ? null : true })}
          isMobile={true}
        />
        <ToggleFilter
          label="SCI 등재"
          active={params.sci ?? false}
          onToggle={() => onParamsChange({ sci: params.sci ? null : true })}
          isMobile={true}
        />
      </Box>
    </>
  );
};

export default CoauthoredPapersFilter;
