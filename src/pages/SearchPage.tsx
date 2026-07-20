import { useState, useRef, useCallback, useEffect } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import { type SxProps, type Theme, useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import TopNavBar from "../components/layout/TopNavBar";
import ExitConfirmDialog from "../components/search/ExitConfirmDialog";
import SearchChatArea from "../components/search/SearchChatArea";
import SearchResultPanel from "../components/search/SearchResultPanel";
import { searchChatStream, postFeedback } from "../api/search";
import {
  type SearchView,
  type ChatMessage,
  type ChatResponse,
  type SortOrder,
  type FeedbackType,
  type ChipType,
} from "../types/search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloseIcon from "@mui/icons-material/Close";

// ─── Location State ───────────────────────────────────────

interface LocationState {
  query: string;
}

// ─── Styles ───────────────────────────────────────────────

const pageSx = (isMobile: boolean): SxProps<Theme> => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  height: "100vh",
  overflow: "hidden",
  backgroundColor: isMobile ? "background.default" : "background.paper",
});

const contentAreaSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
  mt: { xs: 0, sm: "80px" },
  flex: 1,
  overflow: "hidden",
  px: { xs: "16px", sm: "64px", lg: "12px" },
  py: "12px",
  position: "relative",
};

// ─── Component ────────────────────────────────────────────

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const state = location.state as LocationState | null;
  const query = state?.query ?? "";
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ─── 뷰 상태 ───────────────────────────────────────────
  const [view, setView] = useState<SearchView>("chat");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [isPanelDetail, setIsPanelDetail] = useState(false);

  // ─── 대화 상태 ─────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const initSentRef = useRef(false);

  // ─── 검색 결과 상태 ────────────────────────────────────
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevance");
  const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackType>>({});

  // ─── SSE 핸들러 ────────────────────────────────────────

  const handleSend = useCallback(
    async (
      message: string,
      chipId: string | null = null,
      chipType: ChipType | null = null,
    ) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMessageId = Date.now().toString();
      const aiMessageId = (Date.now() + 1).toString();

      if (message) {
        setMessages((prev) => [
          ...prev,
          { id: userMessageId, role: "user", content: message },
        ]);
      }

      setMessages((prev) => [
        ...prev,
        { id: aiMessageId, role: "ai", content: "", isLoading: true },
      ]);

      setIsStreaming(true);
      let streamingText = "";

      try {
        await searchChatStream({
          body: {
            session_id: sessionId,
            message,
            chip_id: chipId,
            chip_type: chipType,
            sort_order: sortOrder,
          },
          callbacks: {
            onSearchStarted: () => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMessageId
                    ? { ...m, content: "탐색 시작할게요.", isLoading: false }
                    : m,
                ),
              );
            },
            onSearching: () => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMessageId
                    ? {
                        ...m,
                        blocks: [{ type: "status", status: "searching" }],
                      }
                    : m,
                ),
              );
            },
            onPapersFound: (count) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMessageId
                    ? {
                        ...m,
                        blocks: [
                          {
                            type: "status",
                            status: "searching",
                            paperCount: count,
                          },
                        ],
                      }
                    : m,
                ),
              );
            },
            onFetching: () => {},
            onToken: (text) => {
              streamingText += text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMessageId
                    ? {
                        ...m,
                        content: streamingText,
                        blocks: [{ type: "status", status: "complete" }],
                      }
                    : m,
                ),
              );
            },
            onDone: (response) => {
              setSessionId(response.session_id);
              setChatResponse(response);
              queryClient.invalidateQueries({ queryKey: ["home"] });
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMessageId
                    ? {
                        ...m,
                        content: streamingText,
                        blocks: [
                          { type: "status", status: "complete" },
                          { type: "text", content: streamingText },
                          ...(response.result_items.length > 0
                            ? [
                                {
                                  type: "result_summary" as const,
                                  total_count: response.total_count,
                                  keywords: response.filters.keywords,
                                },
                              ]
                            : []),
                          ...(response.narrow_chips.length > 0
                            ? [
                                {
                                  type: "narrow_chips" as const,
                                  chips: response.narrow_chips,
                                },
                              ]
                            : []),
                          ...(response.expand_chips.length > 0
                            ? [
                                {
                                  type: "expand_chips" as const,
                                  chips: response.expand_chips,
                                },
                              ]
                            : []),
                        ],
                      }
                    : m,
                ),
              );
              if (response.result_items.length > 0) {
                setView("result");
                setIsPanelOpen(true);
              }
            },
            onError: (errorMessage) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMessageId
                    ? { ...m, content: errorMessage, isLoading: false }
                    : m,
                ),
              );
            },
          },
          signal: controller.signal,
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [sessionId, sortOrder, queryClient],
  );

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages((prev) => {
      const withoutLastAi = prev.filter((m, i) => {
        const isLastAi = m.role === "ai" && i === prev.length - 1;
        return !isLastAi;
      });
      const lastUserIndex = [...withoutLastAi]
        .reverse()
        .findIndex((m) => m.role === "user");
      if (lastUserIndex === -1) return withoutLastAi;
      const actualIndex = withoutLastAi.length - 1 - lastUserIndex;
      return withoutLastAi.map((m, i) =>
        i === actualIndex ? { ...m, isStopped: true } : m,
      );
    });
  }, []);

  // ─── 첫 진입 자동 전송 ─────────────────────────────────

  useEffect(() => {
    if (!query || initSentRef.current) return;
    initSentRef.current = true;
    handleSend(query);
  }, []);

  // ─── 언마운트 시 스트림 정리 ───────────────────────────

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ─── 재검색 ────────────────────────────────────────────

  const handleRetry = useCallback(
    (messageId: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return;
      const targetMessage = messages[messageIndex];
      // 해당 메시지 이후(AI 답변 포함) 전부 제거
      setMessages((prev) => prev.slice(0, messageIndex));
      handleSend(targetMessage.content);
    },
    [messages, handleSend],
  );

  // ─── 수정 ──────────────────────────────────────────────

  const handleEdit = useCallback(
    (messageId: string, newContent: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return;
      // 해당 메시지 이후 전부 제거하고 수정된 내용으로 재전송
      setMessages((prev) => prev.slice(0, messageIndex));
      handleSend(newContent);
    },
    [messages, handleSend],
  );

  // ─── 칩 클릭 ───────────────────────────────────────────

  const handleChipClick = useCallback(
    (chipId: string, chipType: ChipType, label: string) => {
      handleSend(label, chipId, chipType);
    },
    [handleSend],
  );

  // ─── 피드백 ────────────────────────────────────────────

  const handleFeedback = useCallback(
    async (paperId: string, feedback: FeedbackType) => {
      if (!sessionId) return;
      try {
        await postFeedback(sessionId, paperId, feedback);
        setFeedbacks((prev) => ({ ...prev, [paperId]: feedback }));
      } catch {
        // 에러 처리
      }
    },
    [sessionId],
  );

  // ─── 네비게이션 ────────────────────────────────────────

  const handleBackClick = () => {
    setExitDialogOpen(true);
  };

  const handleExitConfirm = () => {
    setExitDialogOpen(false);
    navigate("/home", { replace: true });
  };

  const handleExitCancel = () => setExitDialogOpen(false);

  const handlePanelOpen = useCallback(() => setIsPanelOpen(true), []);
  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false);
    setIsPanelDetail(false);
  }, []);

  // ─── Render ────────────────────────────────────────────

  return (
    <Box sx={pageSx(isMobile)}>
      {!isMobile && (
        <TopNavBar
          onBack={handleBackClick}
          onLogoClick={() => setExitDialogOpen(true)}
          searchConfig={{ query }}
        />
      )}
      {/* 모바일: 별도 헤더 */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            padding: "16px 0",
            alignItems: "center",
            gap: "8px",
            px: "16px",
            alignSelf: "stretch",
          }}
        >
          <IconButton
            onClick={
              isPanelOpen && view === "result"
                ? handlePanelClose
                : handleBackClick
            }
            sx={{ p: 0, width: "28px", height: "28px", flexShrink: 0 }}
          >
            {isPanelOpen && view === "result" ? (
              <CloseIcon sx={{ fontSize: 24, color: "label.normal" }} />
            ) : (
              <ArrowBackIosNewIcon
                sx={{ fontSize: 16, color: "label.normal" }}
              />
            )}
          </IconButton>
          {isPanelOpen && view === "result" ? (
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "29px",
                letterSpacing: "-0.378px",
              }}
            >
              <Box component="span" sx={{ color: "#03C26C" }}>
                {chatResponse?.filters.keywords[0] ?? ""}
              </Box>
              <Box component="span" sx={{ color: "label.normal" }}>
                {" "}
                검색 결과
              </Box>
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  padding: "3px 8px 4px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "6px",
                  backgroundColor: "#E6F9F0",
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    color: "#029B56",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  AI 검색
                </Typography>
              </Box>
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "label.normal",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "30px",
                  letterSpacing: "-0.42px",
                }}
              >
                {query}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <Box sx={contentAreaSx}>
        {(!isPanelDetail || !isDesktop) && (
          <SearchChatArea
            messages={messages}
            isStreaming={isStreaming}
            isPanelOpen={isPanelOpen}
            onSend={(message) => handleSend(message)}
            onChipClick={handleChipClick}
            onPanelOpen={handlePanelOpen}
            onRetry={handleRetry}
            onEdit={handleEdit}
            onStop={handleStop}
          />
        )}
        {/* 데스크탑: 기존대로 직접 렌더링 */}
        {isDesktop ? (
          <>
            {view === "result" && isPanelOpen && (
              <SearchResultPanel
                chatResponse={chatResponse}
                feedbacks={feedbacks}
                onClose={handlePanelClose}
                onFeedback={handleFeedback}
                onSortChange={setSortOrder}
                sortOrder={sortOrder}
                isDesktop={isDesktop}
                onDetailOpen={() => setIsPanelDetail(true)}
                onDetailClose={() => setIsPanelDetail(false)}
              />
            )}
          </>
        ) : (
          /* 태블릿: 감싸는 Box로 오버레이 */
          <Box
            sx={{
              position: "absolute",
              top: { xs: 0, sm: "12px" },
              left: { xs: 0, sm: "64px" },
              right: { xs: 0, sm: "64px" },
              bottom: { xs: 0, sm: "12px" },
              display: "flex",
              pointerEvents: isPanelOpen ? "auto" : "none",
              zIndex: 10,
            }}
          >
            {view === "result" && isPanelOpen && (
              <SearchResultPanel
                chatResponse={chatResponse}
                feedbacks={feedbacks}
                onClose={handlePanelClose}
                onFeedback={handleFeedback}
                onSortChange={setSortOrder}
                sortOrder={sortOrder}
                isDesktop={isDesktop}
                onDetailOpen={() => setIsPanelDetail(true)}
                onDetailClose={() => setIsPanelDetail(false)}
              />
            )}
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
