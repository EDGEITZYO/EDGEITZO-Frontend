import { useState, useEffect, useRef, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { type SxProps, type Theme } from "@mui/material/styles";
import SearchHeader from "../components/search/SearchHeader";
import ExitConfirmDialog from "../components/search/ExitConfirmDialog";
import SearchChatPanel from "../components/search/SearchChatPanel";
import SearchProgressPanel from "../components/search/SearchProgressPanel";
import PaperListPanel from "../components/search/PaperListPanel";
import PaperDetailContent from "../components/common/PaperDetailContent";
import {
  searchChatStream,
  searchExecute,
  searchPapers,
  postFeedback,
} from "../api/search";
import {
  type SearchView,
  type ChatMessage,
  type ChatOption,
  type SearchStage,
  type FinalSearchParams,
  type SearchPaper,
  type SearchExecuteResult,
  type FeedbackType,
  type SortOrder,
} from "../types/search";
import { type PaperType } from "../types/paper";

// ─── Location State ───────────────────────────────────────

interface LocationState {
  query: string;
  title: string;
  directSearch?: boolean;
}

// ─── Styles ───────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const query = state?.query ?? "";
  const title = state?.title ?? "검색";
  const directSearch = state?.directSearch ?? false;
  const queryClient = useQueryClient();

  // ─── 뷰 상태 ───────────────────────────────────────────
  const [view, setView] = useState<SearchView>(directSearch ? "list" : "chat");
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  // ─── 세션/스트리밍 상태 ────────────────────────────────
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const initSentRef = useRef(false);

  // ─── 대화 상태 ─────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [options, setOptions] = useState<ChatOption[]>([]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  // ─── 우측 패널 상태 ────────────────────────────────────
  const [completenessPct, setCompletenessPct] = useState(0);
  const [searchStage, setSearchStage] = useState<SearchStage>("none");
  const [interimPapers, setInterimPapers] = useState<SearchPaper[]>([]);

  // ─── 검색 실행 상태 ────────────────────────────────────
  const [finalSearchParams, setFinalSearchParams] =
    useState<FinalSearchParams | null>(null);
  const [executeResult, setExecuteResult] =
    useState<SearchExecuteResult | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackType>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  // ─── 필터/정렬 상태 ────────────────────────────────────
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevance");
  const [filterPaperType, setFilterPaperType] = useState<PaperType | null>(
    null,
  );

  // ─── 검색 실행 ─────────────────────────────────────────

  const handleExecute = useCallback(
    async (
      currentSessionId: string,
      params: FinalSearchParams,
      sort: SortOrder,
      paperType: PaperType | null,
    ) => {
      setIsExecuting(true);
      try {
        const result = await searchExecute({
          session_id: currentSessionId,
          search_params: params,
          filter_paper_type: paperType,
          sort_order: sort,
        });
        setExecuteResult(result);
        queryClient.invalidateQueries({ queryKey: ["home"] });
        setView("list");
      } catch {
        // 에러 처리
      } finally {
        setIsExecuting(false);
      }
    },
    [queryClient],
  );

  // ─── SSE 스트리밍 핸들러 ───────────────────────────────

  const handleSend = useCallback(
    async (message: string, selectedOptions: string[], forceStart = false) => {
      // 이전 스트림 중단
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 사용자 메시지 추가
      if (message) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "user", content: message },
        ]);
      }

      // AI 로딩 메시지 추가
      const loadingId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: loadingId, role: "ai", content: "", isLoading: true },
      ]);

      setIsStreaming(true);
      let streamingText = "";

      try {
        await searchChatStream({
          body: {
            session_id: sessionId,
            message,
            selected_options: selectedOptions,
            force_start: forceStart,
          },
          callbacks: {
            onSlotUpdate: () => {
              // 슬롯 업데이트 — 현재는 별도 UI 처리 없음
            },
            onCompleteness: (pct, stage) => {
              setCompletenessPct(pct);
              setSearchStage(stage);
            },
            onKeywordProgress: (stage, keywords) => {
              if (stage === "completed" && keywords) {
                setInterimPapers([]);
                // interim_papers는 done 이벤트에서 처리
              }
            },
            onToken: (text) => {
              streamingText += text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === loadingId
                    ? { ...m, content: streamingText, isLoading: false }
                    : m,
                ),
              );
            },
            onDone: async (event) => {
              setSessionId(event.session_id);
              setOptions(event.options);
              setAllowMultiple(event.allow_multiple);
              setCompletenessPct(event.completeness_pct);
              setSearchStage(event.search_stage);

              if (event.interim_papers && event.interim_papers.length > 0) {
                setInterimPapers(event.interim_papers);
              }

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === loadingId
                    ? {
                        ...m,
                        content: event.ai_message,
                        isLoading: false,
                        options: event.options,
                        allowMultiple: event.allow_multiple,
                      }
                    : m,
                ),
              );

              setFinalSearchParams(event.final_search_params);

              if (
                event.search_ready &&
                event.final_search_params &&
                selectedOptions.includes("start_search")
              ) {
                await handleExecute(
                  event.session_id,
                  event.final_search_params,
                  sortOrder,
                  filterPaperType,
                );
              }
            },
            onError: (errorMessage) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === loadingId
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
    [sessionId, sortOrder, filterPaperType, handleExecute],
  );

  // ─── 필터/정렬 변경 시 재검색 ──────────────────────────

  const handleSortChange = useCallback(
    async (sort: SortOrder) => {
      setSortOrder(sort);
      if (finalSearchParams && sessionId) {
        await handleExecute(
          sessionId,
          finalSearchParams,
          sort,
          filterPaperType,
        );
      }
    },
    [finalSearchParams, sessionId, filterPaperType, handleExecute],
  );

  const handleFilterChange = useCallback(
    async (paperType: PaperType | null) => {
      setFilterPaperType(paperType);
      if (finalSearchParams && sessionId) {
        await handleExecute(sessionId, finalSearchParams, sortOrder, paperType);
      }
    },
    [finalSearchParams, sessionId, sortOrder, handleExecute],
  );

  // ─── directSearch 진입 처리 ────────────────────────────

  useEffect(() => {
    if (!directSearch || !query) return;

    const fetchDirectSearch = async () => {
      try {
        const papers = await searchPapers({
          query,
          paper_scope: "ANY",
          time_range: "SKIP",
          keywords: [],
          page: 1,
          size: 20,
        });
        setExecuteResult({ papers, total: papers.length, search_id: "" });
      } catch {
        // 에러 처리
      }
    };

    fetchDirectSearch();
  }, []);

  // ─── AI 탐색 첫 턴 자동 전송 ──────────────────────────

  useEffect(() => {
    if (directSearch || !query || initSentRef.current) return;
    initSentRef.current = true;

    handleSend(query, []);
  }, []);

  // ─── 언마운트 시 스트림 정리 ───────────────────────────

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

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

  // ─── 북마크 ────────────────────────────────────────────

  const handleBookmark = useCallback((paperId: string) => {
    // TODO: 북마크 API 연동
    setBookmarks((prev) => ({ ...prev, [paperId]: !prev[paperId] }));
  }, []);

  // ─── 네비게이션 ────────────────────────────────────────

  const handleBackClick = () => {
    if (view === "detail") {
      setView("list");
      return;
    }
    setExitDialogOpen(true);
  };
  const handleExitConfirm = () => {
    setExitDialogOpen(false);
    navigate("/home");
  };
  const handleExitCancel = () => setExitDialogOpen(false);
  const handleSearchStart = async () => {
    if (finalSearchParams && sessionId) {
      await handleExecute(
        sessionId,
        finalSearchParams,
        sortOrder,
        filterPaperType,
      );
    }
  };
  const handleResetCondition = () => setView("chat");

  // ─── Render ────────────────────────────────────────────

  return (
    <Box sx={pageContainerSx}>
      <SearchHeader title={title} onBack={handleBackClick} />
      <Box sx={contentAreaSx}>
        {view === "chat" ? (
          <>
            <Box sx={chatPanelSx}>
              <SearchChatPanel
                messages={messages}
                options={options}
                allowMultiple={allowMultiple}
                isStreaming={isStreaming}
                onSend={handleSend}
              />
            </Box>
            <Box sx={progressPanelSx}>
              <SearchProgressPanel
                completenessPct={completenessPct}
                searchStage={searchStage}
                interimPapers={interimPapers}
                isStreaming={isStreaming}
                onSearchStart={handleSearchStart}
                onFeedback={handleFeedback}
                feedbacks={feedbacks}
              />
            </Box>
          </>
        ) : view === "list" ? (
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <PaperListPanel
              papers={executeResult?.papers ?? []}
              totalCount={executeResult?.total ?? 0}
              sortOrder={sortOrder}
              filterPaperType={filterPaperType}
              bookmarks={bookmarks}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onResetCondition={handleResetCondition}
              onBookmark={handleBookmark}
              onPaperClick={(paperId) => {
                setSelectedPaperId(paperId);
                setView("detail");
              }}
            />
          </Box>
        ) : view === "detail" && selectedPaperId ? (
          <Box sx={{ flex: 1, overflow: "auto", px: "63px", py: "29px" }}>
            <PaperDetailContent
              paperId={selectedPaperId}
              searchId={executeResult?.search_id || undefined}
              onRelatedPaperClick={(paperId) => {
                setSelectedPaperId(paperId);
              }}
            />
          </Box>
        ) : null}
      </Box>
      {isExecuting && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
          <Typography
            sx={{ fontSize: "18px", fontWeight: 500, color: "label.normal" }}
          >
            논문을 탐색중입니다
          </Typography>
        </Box>
      )}
      <ExitConfirmDialog
        open={exitDialogOpen}
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
      />
    </Box>
  );
};

export default SearchPage;
