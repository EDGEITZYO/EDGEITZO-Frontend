import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Header from "../components/layout/Header";
import { useKeywordMapActions } from "../stores/keywordMapStore";
import { keywordMapApi } from "../api/keywordMap";
import { mypageApi } from "../api/mypage";
import { useMypageQuery } from "../queries/useMypageQuery";
import { mypageKeys } from "../queries/keys";

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "background.paper",
};

const contentSx: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const titleRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  alignSelf: "flex-start",
  mb: "27px",
};

const cardSx: SxProps<Theme> = {
  width: "503px",
  borderRadius: "20px",
  backgroundColor: "background.default",
  padding: "27px",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
};

const inputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 500,
  },
};

const buttonSx: SxProps<Theme> = {
  height: "52px",
  borderRadius: "12px",
  backgroundColor: "primary.main",
  color: "static.white",
  fontSize: "18px",
  fontWeight: 500,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "primary.dark",
    boxShadow: "none",
  },
};

const KeywordMapEditPage = () => {
  const navigate = useNavigate();
  const { setResearchField, setIsGenerating, setGenerateError } =
    useKeywordMapActions();
  const { data: mypageData } = useMypageQuery();
  const userId = mypageData?.profile.id;
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleBack = () => {
    navigate(-1);
  };

  const handleGenerate = async () => {
    if (!inputValue.trim() || !userId) return;

    setIsLoading(true);
    setErrorMessage(null);
    setIsGenerating(true);
    setGenerateError(null);

    try {
      await keywordMapApi.generate(inputValue.trim(), userId);
      await mypageApi.updateResearchField(inputValue.trim());
      queryClient.invalidateQueries({ queryKey: mypageKeys.detail() });
      setResearchField(inputValue.trim());
      navigate("/keyword-map");
    } catch {
      const msg = "키워드맵 생성에 실패했어요. 다시 시도해주세요.";
      setErrorMessage(msg);
      setGenerateError(msg);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={containerSx}>
      <Header isLoggedIn />
      <Box sx={contentSx}>
        <Box sx={{ width: "503px" }}>
          <Box sx={titleRowSx}>
            <ChevronLeftIcon
              onClick={handleBack}
              sx={{ cursor: "pointer", fontSize: "32px" }}
            />
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                letterSpacing: "-0.528px",
                color: "static.black",
              }}
            >
              연구 분야는 어디이신가요?
            </Typography>
          </Box>
          <Box sx={cardSx}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                color: "static.black",
              }}
            >
              간단하게 입력해주세요
            </Typography>
            <TextField
              fullWidth
              placeholder="세포 노화"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") handleGenerate();
              }}
              disabled={isLoading}
              sx={inputSx}
            />
            {errorMessage && (
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "error.main",
                  mt: "-16px",
                }}
              >
                {errorMessage}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerate}
              disabled={!inputValue.trim() || isLoading}
              sx={buttonSx}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "static.white" }} />
              ) : (
                "키워드맵 생성하기"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KeywordMapEditPage;
