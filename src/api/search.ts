import apiClient from "./client";
import { useAuthStore } from "../stores/authStore";
import {
  type SearchChatRequest,
  type ChatResponse,
  type FeedbackType,
  type SearchChatSseEvent,
  type SearchPapersRequest,
  type SearchPaper,
} from "../types/search";

// ─── SSE 콜백 타입 ────────────────────────────────────────

interface SearchChatStreamCallbacks {
  onSearchStarted: () => void;
  onSearching: () => void;
  onPapersFound: (count: number) => void;
  onFetching: () => void;
  onToken: (text: string) => void;
  onDone: (response: ChatResponse) => void;
  onError: (message: string) => void;
}

interface SearchChatStreamParams {
  body: SearchChatRequest;
  callbacks: SearchChatStreamCallbacks;
  signal: AbortSignal;
}

// ─── /search/chat/stream ─────────────────────────────────

export const searchChatStream = async ({
  body,
  callbacks,
  signal,
}: SearchChatStreamParams): Promise<void> => {
  const accessToken = useAuthStore.getState().accessToken;

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/search/chat/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    },
  );

  if (!response.ok) {
    callbacks.onError("서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError("스트림을 읽을 수 없어요.");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;

        let event: SearchChatSseEvent;
        try {
          event = JSON.parse(raw) as SearchChatSseEvent;
        } catch {
          continue;
        }

        switch (event.type) {
          case "search_started":
            callbacks.onSearchStarted();
            break;
          case "searching":
            callbacks.onSearching();
            break;
          case "heartbeat":
            break;
          case "papers_found":
            callbacks.onPapersFound(event.count);
            break;
          case "fetching":
            callbacks.onFetching();
            break;
          case "token":
            callbacks.onToken(event.text);
            break;
          case "done":
            callbacks.onDone(event);
            break;
          case "error":
            callbacks.onError(event.message);
            return;
          default:
            break;
        }
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return;
    callbacks.onError("스트림 처리 중 오류가 발생했어요.");
  } finally {
    reader.releaseLock();
  }
};

// ─── /search/chat ────────────────────────────────────────

export const searchChat = async (
  body: SearchChatRequest,
): Promise<ChatResponse> => {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    data: ChatResponse;
    meta: unknown;
  }>("/search/chat", body);
  return data.data;
};

// ─── /search/feedback ────────────────────────────────────

export const postFeedback = async (
  sessionId: string,
  paperId: string,
  feedback: FeedbackType,
): Promise<void> => {
  await apiClient.post("/search/feedback", {
    session_id: sessionId,
    paper_id: paperId,
    feedback,
  });
};

// ─── /search/papers (directSearch용, 이번 범위 외) ────────

export const searchPapers = async (
  body: SearchPapersRequest,
): Promise<SearchPaper[]> => {
  const { data } = await apiClient.post<{
    success: boolean;
    data: { items: SearchPaper[] };
  }>("/search/papers", body);
  return data.data.items;
};
