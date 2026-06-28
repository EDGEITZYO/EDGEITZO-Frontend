import { useState } from "react";
import { Box, Typography } from "@mui/material";
import RecentSearchCard from "./RecentSearchCard";
import { type RecentSearch, type SearchType } from "../../types/home";

type TabType = "all" | SearchType;

const TABS: { label: string; value: TabType }[] = [
  { label: "전체", value: "all" },
  { label: "AI 검색", value: "ai" },
  { label: "키워드", value: "keyword" },
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 헤더: 타이틀 + 탭 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "16px",
        }}
      >
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: "36px",
            letterSpacing: "-0.576px",
            color: "label.normal",
          }}
        >
          최근 탐색 이어하기
        </Typography>

        {/* 탭 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {TABS.map((tab) => (
            <Box
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 13px",
                borderRadius: "24px",
                backgroundColor:
                  activeTab === tab.value ? "label.normal" : "fill.normal",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    activeTab === tab.value ? "label.neutral" : "fill.strong",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                  color:
                    activeTab === tab.value
                      ? "static.white"
                      : "label.alternative",
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 카드 리스트 or 빈 상태 */}
      {filtered.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: "48px",
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "background.default",
            alignSelf: "stretch",
          }}
        >
          {filtered.map((search) => (
            <RecentSearchCard key={search.id} data={search} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentSearchSection;
