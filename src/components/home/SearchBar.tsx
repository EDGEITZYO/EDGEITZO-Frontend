import { useRef, useState } from "react";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import { ArrowRight, CornerDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SearchMode = "AI" | "키워드";

interface RecommendationSet {
  ai: string;
  keyword: string;
}

const RECOMMENDATION_SETS: RecommendationSet[] = [
  {
    ai: "바이오 폴리머로 하천 제방을 보강하는 논문 찾아줘.",
    keyword: "항산화",
  },
  {
    ai: "유전자 알고리즘으로 최적 위치를 선정한 논문 찾아줘.",
    keyword: "바이오 폴리머",
  },
  {
    ai: "천연물 추출물의 항산화 활성에 관한 논문을 찾아줘.",
    keyword: "바이오가스",
  },
  {
    ai: "암세포의 세포사멸(apoptosis)을 유도하는 연구가 궁금해.",
    keyword: "미생물",
  },
];

// ─── 추천 칩 ─────────────────────────────────────────────

interface RecommendationChipProps {
  recMode: SearchMode;
  text: string;
  onClick: (recMode: SearchMode) => void;
}

const RecommendationChip = ({
  recMode,
  text,
  onClick,
}: RecommendationChipProps) => (
  <Box
    onClick={() => onClick(recMode)}
    sx={{
      display: "flex",
      padding: { xs: "12px", sm: "8px 13px" },
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      gap: "12px",
      borderRadius: "24px",
      backgroundColor: "fill.normal",
      cursor: "pointer",
      alignSelf: { xs: "stretch", sm: "auto" },
      "&:hover": { backgroundColor: "fill.strong" },
    }}
  >
    <Box
      sx={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}
    >
      <CornerDownRight size={16} color="#3BA502" />
      <Typography
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
          color: "#3BA502",
        }}
      >
        {recMode === "AI" ? "AI 검색" : "키워드 검색"}
      </Typography>
    </Box>
    <Typography
      sx={{
        alignSelf: { xs: "stretch", sm: "auto" },
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        letterSpacing: "-0.336px",
        color: "#73757F",
      }}
    >
      {text}
    </Typography>
  </Box>
);

// ─── SearchBar ───────────────────────────────────────────

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("AI");
  const inputRef = useRef<HTMLInputElement>(null);

  const [recommendation] = useState<RecommendationSet>(() => {
    const index = Math.floor(Math.random() * RECOMMENDATION_SETS.length);
    return RECOMMENDATION_SETS[index];
  });

  const canSubmit = query.trim() !== "";

  const handleSubmit = (overrideQuery?: string, overrideMode?: SearchMode) => {
    const q = overrideQuery ?? query;
    const m = overrideMode ?? mode;
    if (q.trim() === "") return;
    if (m === "AI") {
      navigate("/search", { state: { query: q.trim(), title: q.trim() } });
    } else {
      navigate(`/keyword-map?keyword=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleRecommendClick = (recMode: SearchMode) => {
    const q = recMode === "AI" ? recommendation.ai : recommendation.keyword;
    handleSubmit(q, recMode);
  };

  // ─── 토글 ────────────────────────────────────────────────

  const Toggle = (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        padding: "4px",
        alignItems: "center",
        borderRadius: "43.478px",
        backgroundColor: "#D8DAE5",
        flexShrink: 0,
      }}
    >
      {/* 슬라이드하는 흰 칩 */}
      <Box
        sx={{
          position: "absolute",
          top: "4px",
          left: "4px",
          width: "57px",
          height: "calc(100% - 8px)",
          borderRadius: "43.478px",
          backgroundColor: "#FFF",
          transform: mode === "AI" ? "translateX(0)" : "translateX(57px)",
          transition: "transform 0.2s ease",
        }}
      />

      {/* 텍스트 버튼들 */}
      {(["AI", "키워드"] as SearchMode[]).map((m) => (
        <Box
          key={m}
          onClick={() => setMode(m)}
          sx={{
            position: "relative", // 흰 칩 위에 올라오게
            zIndex: 1,
            display: "flex",
            width: "57px",
            padding: "4px 8px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "43.478px",
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: mode === m ? "#292B33" : "#73757F",
              transition: "color 0.2s ease",
            }}
          >
            {m}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  // ─── 제출 버튼 ───────────────────────────────────────────

  const SubmitButton = (
    <IconButton
      onClick={() => handleSubmit()}
      disabled={!canSubmit}
      sx={{
        width: "42px",
        height: "40px",
        borderRadius: "24px",
        backgroundColor: canSubmit ? "#1E2026" : "#D8DAE5",
        flexShrink: 0,
        "&:hover": { backgroundColor: canSubmit ? "#292B33" : "#D8DAE5" },
        "&.Mui-disabled": { backgroundColor: "#D8DAE5" },
      }}
    >
      <ArrowRight size={24} color="#FAFAFC" />
    </IconButton>
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "23px",
      }}
    >
      {/* 데스크탑/태블릿 검색창 */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          height: "56px",
          padding: "8px 8px 8px 24px",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "216px",
          border: "1px solid #D8DAE5",
          backgroundColor: "#FFF",
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
            "& input": {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            "& input::placeholder": { color: "#73757F", opacity: 1 },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {Toggle}
          {SubmitButton}
        </Box>
      </Box>

      {/* 모바일 검색창 */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          width: "100%",
          padding: "16px 12px 12px 12px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          borderRadius: "24px",
          border: "1px solid #D8DAE5",
          backgroundColor: "#FFF",
        }}
      >
        {/* 입력 영역 */}
        <Box
          sx={{
            display: "flex",
            padding: "0 8px",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
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
            multiline
            sx={{
              flex: "1 0 0",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: "#73757F",
              "& textarea::placeholder": { color: "#73757F", opacity: 1 },
            }}
          />
        </Box>

        {/* 토글 + 제출버튼 */}
        <Box
          sx={{ display: "flex", width: "100%", flexWrap: "wrap", gap: "8px" }}
        >
          {Toggle}
          <Box sx={{ marginLeft: "auto" }}>{SubmitButton}</Box>
        </Box>
      </Box>

      {/* 추천 검색어 섹션 */}
      <Box
        sx={{
          display: "flex",
          paddingLeft: "8px",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        {/* 검색 추천 + 인포 아이콘 */}
        <Box
          sx={{
            display: "flex",
            padding: "8px 13px",
            justifyContent: "center",
            alignItems: "center",
            gap: "2px",
            borderRadius: "24px",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: "#73757F",
            }}
          >
            검색어 추천
          </Typography>
        </Box>

        {/* 칩 묶음 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "8px",
            alignSelf: { xs: "stretch", sm: "auto" },
          }}
        >
          <RecommendationChip
            recMode="AI"
            text={recommendation.ai}
            onClick={handleRecommendClick}
          />
          <RecommendationChip
            recMode="키워드"
            text={recommendation.keyword}
            onClick={handleRecommendClick}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBar;
