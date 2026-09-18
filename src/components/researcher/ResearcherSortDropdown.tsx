import { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { type ResearcherSortType } from "../../types/researcher";

interface ResearcherSortDropdownProps {
  value: ResearcherSortType;
  onChange: (value: ResearcherSortType) => void;
  size?: "default" | "small";
}

const SORT_OPTIONS: { label: string; value: ResearcherSortType }[] = [
  { label: "관련도순", value: "relevance" },
  { label: "논문 개수 순", value: "paper_count" },
];

const ResearcherSortDropdown = ({
  value,
  onChange,
  size = "default",
}: ResearcherSortDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    SORT_OPTIONS.find((o) => o.value === value)?.label ?? "관련도순";

  const isSmall = size === "small";

  const triggerSx: SxProps<Theme> = {
    display: "flex",
    width: isSmall ? "auto" : "164px",
    height: isSmall ? "36px" : "42px",
    padding: isSmall ? "0 8px 0 16px" : "8px 8px 8px 16px",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "216px",
    backgroundColor: isSmall ? "background.paper" : "background.default",
    cursor: "pointer",
  };

  const iconButtonSx: SxProps<Theme> = {
    display: "flex",
    width: isSmall ? "auto" : "40px",
    height: isSmall ? "auto" : "40px",
    padding: isSmall ? "7px 8px 9px 8px" : "9px 10px 11px 10px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "24px",
    flexShrink: 0,
  };

  const dropdownSx: SxProps<Theme> = {
    display: "flex",
    padding: "8px",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: "28px",
    border: "1px solid",
    borderColor: "label.alternative",
    backgroundColor: "background.default",
    position: "absolute",
    top: "calc(100% + 4px)",
    right: 0,
    zIndex: 10,
    minWidth: isSmall ? "109px" : "164px",
  };

  const getOptionSx: SxProps<Theme> = {
    display: "flex",
    height: "42px",
    padding: "8px",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "16px",
    alignSelf: "stretch",
    borderRadius: "216px",
    backgroundColor: "background.default",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "background.paper",
    },
  };

  return (
    <Box ref={ref} sx={{ position: "relative", display: "inline-flex" }}>
      <Box sx={triggerSx} onClick={() => setOpen((prev) => !prev)}>
        <Typography
          variant={isSmall ? "caption" : "body1"}
          sx={{ color: "label.alternative" }}
        >
          {selectedLabel}
        </Typography>
        <Box sx={iconButtonSx}>
          <KeyboardArrowDownIcon
            sx={{
              width: "20px",
              height: "20px",
              flexShrink: 0,
              color: "label.alternative",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </Box>
      </Box>
      {open && (
        <Box sx={dropdownSx}>
          {SORT_OPTIONS.map((option) => (
            <Box
              key={option.value}
              sx={getOptionSx}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <Typography variant="body1" sx={{ color: "label.normal" }}>
                {option.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ResearcherSortDropdown;
