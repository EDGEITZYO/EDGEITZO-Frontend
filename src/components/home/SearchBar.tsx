import { useRef, useState } from "react";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SearchMode = "AI" | "키워드";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("AI");
  const inputRef = useRef<HTMLInputElement>(null);

  const canSubmit = query.trim() !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (mode === "AI") {
      navigate("/search", {
        state: { query: query.trim(), title: query.trim() },
      });
    } else {
      navigate(`/keyword-map?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  // ─── 토글 컴포넌트 ───────────────────────────────────────

  const Toggle = (
    <Box
      sx={{
        display: "flex",
        padding: "4px",
        alignItems: "center",
        gap: "8px",
        borderRadius: "43.478px",
        backgroundColor: "#D8DAE5",
        flexShrink: 0,
      }}
    >
      {(["AI", "키워드"] as SearchMode[]).map((m) => (
        <Box
          key={m}
          onClick={() => setMode(m)}
          sx={{
            display: "flex",
            width: "57px",
            padding: "4px 8px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "43.478px",
            backgroundColor: mode === m ? "#FFF" : "transparent",
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
      onClick={handleSubmit}
      disabled={!canSubmit}
      sx={{
        width: "42px",
        height: "40px",
        borderRadius: "24px",
        backgroundColor: canSubmit ? "#1E2026" : "#D8DAE5",
        flexShrink: 0,
        "&:hover": {
          backgroundColor: canSubmit ? "#292B33" : "#D8DAE5",
        },
        "&.Mui-disabled": {
          backgroundColor: "#D8DAE5",
        },
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
            "& input::placeholder": {
              color: "#73757F",
              opacity: 1,
            },
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
              "& textarea::placeholder": {
                color: "#73757F",
                opacity: 1,
              },
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
    </Box>
  );
};

export default SearchBar;
