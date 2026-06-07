import { useState } from "react";
import { Box, Typography } from "@mui/material";
import RecentSearchCard from "./RecentSearchCard";
import { type RecentSearch, type SearchType } from "../../types/home";

type TabType = "all" | SearchType;

const TABS: { label: string; value: TabType }[] = [
  { label: "전체", value: "all" },
  { label: "키워드 검색", value: "keyword" },
  { label: "AI 검색", value: "ai" },
];

interface RecentSearchSectionProps {
  searches: RecentSearch[];
}

const RecentSearchSection = ({ searches }: RecentSearchSectionProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const filtered = searches
    .filter((s) => activeTab === "all" || s.type === activeTab)
    .slice(0, 2);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: "11px", flex: 1 }}
    >
      {/* 타이틀 */}
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 600,
          lineHeight: "30px",
          letterSpacing: "-0.36px",
          color: "label.strong",
        }}
      >
        최근 탐색 이어하기
      </Typography>

      {/* 탭 */}
      <Box sx={{ display: "flex", gap: "6px" }}>
        {TABS.map((tab) => (
          <Box
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: activeTab === tab.value ? "13px" : "16px",
              py: "5px",
              borderRadius: "7px",
              backgroundColor:
                activeTab === tab.value ? "label.neutral" : "transparent",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: 600,
                lineHeight: "29px",
                letterSpacing: "-0.34px",
                color:
                  activeTab === tab.value ? "static.white" : "label.strong",
              }}
            >
              {tab.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 카드 리스트 or 빈 상태 */}
      {filtered.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              color: "label.assistive",
            }}
          >
            최근 탐색 이력이 없어요
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "11px" }}>
          {filtered.map((search) => (
            <RecentSearchCard key={search.id} data={search} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentSearchSection;
