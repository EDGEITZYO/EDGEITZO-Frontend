import { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { type SxProps, type Theme } from "@mui/material/styles";
import SearchHeader from "../components/search/SearchHeader";
import ExitConfirmDialog from "../components/search/ExitConfirmDialog";
import { type SearchView, type SearchStep } from "../types/search";
import SearchChatPanel from "../components/search/SearchChatPanel";
import SearchProgressPanel from "../components/search/SearchProgressPanel";

interface LocationState {
  query: string;
  title: string;
}

const pageContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "background.default",
  minWidth: 1200,
};

const contentAreaSx: SxProps<Theme> = {
  display: "flex",
  flex: 1,
  overflow: "hidden",
};

const chatPanelSx: SxProps<Theme> = {
  width: "50%",
  borderRight: "1px solid",
  borderColor: "line.normal",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const progressPanelSx: SxProps<Theme> = {
  width: "50%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const query = state?.query ?? "";
  const [title, setTitle] = useState(state?.title ?? "검색");

  const [view, setView] = useState<SearchView>("chat");
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const handleBackClick = () => {
    setExitDialogOpen(true);
  };

  const handleExitConfirm = () => {
    setExitDialogOpen(false);
    navigate("/home");
  };

  const handleExitCancel = () => {
    setExitDialogOpen(false);
  };

  const handleStepChange = (step: SearchStep, selection: string) => {
    // TODO: API 연동 시 단계별 백엔드 호출 및 SearchProgressPanel 상태 업데이트
    console.log("step:", step, "selection:", selection);
  };

  const handleSearchStart = () => {
    setView("list");
  };

  const handleResetCondition = () => {
    setView("chat");
  };

  return (
    <Box sx={pageContainerSx}>
      <SearchHeader title={title} onBack={handleBackClick} />
      <Box sx={contentAreaSx}>
        {view === "chat" ? (
          <>
            {/* 좌측 대화 패널 */}
            <Box sx={chatPanelSx}>
              <SearchChatPanel
                initialQuery={query}
                onStepChange={handleStepChange}
                onSearchStart={handleSearchStart}
              />
            </Box>
            {/* 우측 진행 결과 패널 */}
            <Box sx={progressPanelSx}>
              <SearchProgressPanel onSearchStart={handleSearchStart} />
            </Box>
          </>
        ) : (
          /* 전체화면 논문 리스트 */
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            {/* TODO: PaperListPage */}
          </Box>
        )}
      </Box>
      <ExitConfirmDialog
        open={exitDialogOpen}
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
      />
    </Box>
  );
};

export default SearchPage;
