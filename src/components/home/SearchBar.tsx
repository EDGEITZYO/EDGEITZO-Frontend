import { useRef, useState } from "react";
import { Box, IconButton, InputBase, Tooltip, Typography } from "@mui/material";
import { ArrowRight, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";

// TODO: API 연동 시 실제 추천 검색어 데이터로 교체
const MOCK_RECOMMENDED: string[] = [
  "세포 노화와 미토콘드리아 기능 저하",
  "SASP 분비 기전",
  "분자생물학 노화 최신 연구",
  "분자생물학 노화 최신 연구",
];

interface SearchBarProps {
  onKeywordMapClick: () => void;
}

const SearchBar = ({ onKeywordMapClick }: SearchBarProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate("/search", {
        state: {
          query: query.trim(),
          title: query.trim(),
        },
      });
    }
  };

  const handleSubmit = () => {
    if (query.trim() !== "") {
      navigate("/search", {
        state: {
          query: query.trim(),
          title: query.trim(),
        },
      });
    }
  };

  const handleRecommendedClick = (keyword: string) => {
    navigate("/search", {
      state: {
        query: keyword,
        title: keyword,
        directSearch: true,
      },
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "23px",
      }}
    >
      {/* 검색창 + 키워드맵 버튼 */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "23px",
        }}
      >
        {/* 검색 입력창 */}
        <Box
          sx={{
            flex: 1,
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pl: "24px",
            pr: "8px",
            borderRadius: "216px",
            border: "1px solid",
            borderColor: "line.normal",
            backgroundColor: "background.default",
          }}
        >
          <InputBase
            inputRef={inputRef}
            placeholder="어떤 연구를 탐색하고 싶으세요?"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            onKeyDown={handleKeyDown}
            sx={{
              flex: 1,
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: "label.normal",
              "& input::placeholder": {
                color: "label.alternative",
                opacity: 1,
              },
            }}
          />
          {/* 화살표 버튼 */}
          <IconButton
            onClick={handleSubmit}
            sx={{
              width: "42px",
              height: "40px",
              borderRadius: "24px",
              backgroundColor: query.trim() ? "#1E2026" : "#D8DAE5",
              flexShrink: 0,
              "&:hover": {
                backgroundColor: query.trim() ? "#292B33" : "#C8CAD5",
              },
            }}
          >
            <ArrowRight size={24} color="#FAFAFC" />
          </IconButton>
        </Box>

        {/* 키워드맵 버튼 — 데스크탑: 텍스트+아이콘, 태블릿: 아이콘만, 모바일: 없음 */}
        {/* 데스크탑 버튼 */}
        <Box
          onClick={onKeywordMapClick}
          sx={{
            display: { xs: "none", lg: "inline-flex" },
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "line.normal",
            backgroundColor: "background.default",
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { backgroundColor: "fill.normal" },
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "30px",
              letterSpacing: "-0.378px",
              color: "label.normal",
              whiteSpace: "nowrap",
            }}
          >
            키워드맵으로 검색
          </Typography>
          <Network size={20} color="#1E2026" />
        </Box>

        {/* 태블릿 버튼 */}
        <Tooltip title="키워드맵으로 검색" placement="bottom">
          <Box
            onClick={onKeywordMapClick}
            sx={{
              display: { xs: "none", sm: "inline-flex", lg: "none" },
              alignItems: "center",
              justifyContent: "center",
              width: "54px",
              height: "54px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "line.normal",
              backgroundColor: "background.default",
              cursor: "pointer",
              flexShrink: 0,
              "&:hover": { backgroundColor: "fill.normal" },
            }}
          >
            <Network size={20} color="#1E2026" />
          </Box>
        </Tooltip>
      </Box>

      {/* 검색 추천 — 데스크탑/태블릿만 */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "flex-start",
          gap: "8px",
          paddingLeft: "8px",
        }}
      >
        {/* 검색 추천 라벨 */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
            padding: "8px 13px",
            borderRadius: "24px",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: "label.alternative",
              whiteSpace: "nowrap",
            }}
          >
            검색 추천
          </Typography>
          <Tooltip title="AI가 추천하는 검색어예요" placement="top">
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
                color: "label.alternative",
              }}
            >
              {/* lucide info icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                  stroke="#73757F"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 14.4001V12.0001M12 9.6001V9.60012"
                  stroke="#73757F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
          </Tooltip>
        </Box>

        {/* 추천 검색어 칩 목록 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: { sm: "wrap", lg: "nowrap" },
            gap: "8px",
            flex: 1,
          }}
        >
          {MOCK_RECOMMENDED.map((keyword, index) => (
            <Box
              key={index}
              onClick={() => handleRecommendedClick(keyword)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 13px",
                borderRadius: "24px",
                backgroundColor: "fill.normal",
                cursor: "pointer",
                flexShrink: { lg: 0 },
                "&:hover": { backgroundColor: "fill.strong" },
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                  color: "label.alternative",
                  whiteSpace: "nowrap",
                }}
              >
                {keyword}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBar;
