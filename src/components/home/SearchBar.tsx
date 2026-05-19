import { useState, useRef } from "react";
import {
  Box,
  InputBase,
  Button,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import { Search, ListTree } from "lucide-react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";

// TODO: API 연동 시 실제 최근 검색어 데이터로 교체
const MOCK_RECENT_SEARCHES: string[] = [
  "재생 에너지 관련 논문",
  "그래프 신경망",
  "자연어 처리 최신 연구",
  "기후 변화 대응 기술",
  "딥러닝 기반 이미지 인식",
];

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // TODO: API 연동 시 실제 최근 검색어 API 호출로 교체
  const recentSearches = MOCK_RECENT_SEARCHES;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate("/search", {
        state: {
          query: query.trim(),
          title: query.trim(),
        },
      });
      setIsFocused(false);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    // TODO: API 연동 시 해당 키워드로 논문 검색 API 호출 후 결과와 함께 이동
    navigate("/search", {
      state: {
        query: search,
        title: search,
        directSearch: true,
      },
    });
    setIsFocused(false);
  };

  const showDropdown = isFocused;

  return (
    <ClickAwayListener onClickAway={() => setIsFocused(false)}>
      <Box
        sx={{
          width: "100%",
          px: "14.79%",
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 300, position: "relative" }}>
          {/* 검색창 */}
          <Box
            sx={{
              height: "62px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
              px: "27px",
              backgroundColor: "background.default",
              borderRadius:
                showDropdown && recentSearches.length > 0
                  ? "20px 20px 0 0"
                  : "114px",
              transition: "border-radius 0.1s",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Search size={20} color="#A4A7B2" />
            <InputBase
              inputRef={inputRef}
              placeholder="어떤 주제를 탐색하고 싶으세요?"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              sx={{
                flex: 1,
                fontSize: "17px",
                fontWeight: 600,
                lineHeight: "29px",
                letterSpacing: "-0.34px",
                "& input::placeholder": {
                  color: "label.assistive",
                  opacity: 1,
                },
              }}
            />
          </Box>
          {/* 최근 검색어 드롭다운 */}
          {showDropdown && (
            <Box
              sx={{
                position: "absolute",
                top: "62px",
                left: 0,
                right: 0,
                backgroundColor: "background.default",
                borderRadius: "0 0 20px 20px",
                zIndex: 1,
                py: "8px",
              }}
            >
              {recentSearches.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "label.assistive",
                    px: "27px",
                    py: "12px",
                  }}
                >
                  최근 검색어가 없어요
                </Typography>
              ) : (
                recentSearches.map((search, index) => (
                  <Box
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      px: "27px",
                      py: "10px",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "fill.normal" },
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ fontSize: 16, color: "label.assistive" }}
                    />
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "label.normal",
                        lineHeight: "normal",
                      }}
                    >
                      {search}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<ListTree size={24} />}
          onClick={() => navigate("/keyword-map")}
          sx={{
            height: "62px",
            px: "17px",
            py: "6px",
            borderRadius: "6px",
            backgroundColor: "background.default",
            color: "label.strong",
            whiteSpace: "nowrap",
            boxShadow: "none",
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: "29px",
            letterSpacing: "-0.34px",
            "&:hover": {
              backgroundColor: "fill.normal",
              boxShadow: "none",
            },
          }}
        >
          내 연구분야 키워드맵 탐색
        </Button>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
