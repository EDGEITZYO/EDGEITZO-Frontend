import apiClient from "./client";
import { useAuthStore } from "../stores/authStore";
import {
  type SearchChatRequest,
  type SearchChatDoneEvent,
  type SearchExecuteRequest,
  type SearchExecuteResult,
  type SearchPapersRequest,
  type SearchPaper,
  type FeedbackType,
  type SlotType,
  type SearchStage,
} from "../types/search";

// ─── SSE 콜백 타입 ────────────────────────────────────────

interface SearchChatStreamCallbacks {
  onSlotUpdate: (slot: SlotType, value: string) => void;
  onCompleteness: (pct: number, stage: SearchStage) => void;
  onKeywordProgress: (
    stage: "started" | "completed",
    keywords?: string[],
  ) => void;
  onToken: (text: string) => void;
  onDone: (event: SearchChatDoneEvent) => void;
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
    callbacks.onError(`서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError(`스트림을 읽을 수 없어요.`);
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

        let event: { type: string } & Record<string, unknown>;
        try {
          event = JSON.parse(raw) as { type: string } & Record<string, unknown>;
        } catch {
          continue;
        }

        switch (event.type) {
          case "slot_update":
            callbacks.onSlotUpdate(
              event.slot as SlotType,
              event.value as string,
            );
            break;
          case "completeness":
            callbacks.onCompleteness(
              event.pct as number,
              event.stage as SearchStage,
            );
            break;
          case "keyword_progress":
            callbacks.onKeywordProgress(
              event.stage as "started" | "completed",
              event.keywords as string[] | undefined,
            );
            break;
          case "token":
            callbacks.onToken(event.text as string);
            break;
          case "done":
            callbacks.onDone(event as unknown as SearchChatDoneEvent);
            break;
          case "error":
            callbacks.onError(event.message as string);
            return;
          default:
            break;
        }
      }
    }
  } catch (err) {
    // AbortError는 정상 종료 (언마운트 시)
    if (err instanceof Error && err.name === "AbortError") return;
    callbacks.onError(`스트림 처리 중 오류가 발생했어요.`);
  } finally {
    reader.releaseLock();
  }
};

// ─── /search/execute ─────────────────────────────────────

export const searchExecute = async (
  body: Omit<SearchExecuteRequest, "user_id">,
  userId: string,
): Promise<SearchExecuteResult> => {
  const { data } = await apiClient.post<{
    success: boolean;
    data: SearchExecuteResult;
  }>("/search/execute", { ...body, user_id: userId });
  return data.data;
};

// ─── /search/papers ──────────────────────────────────────

export const searchPapers = async (
  body: SearchPapersRequest,
): Promise<SearchPaper[]> => {
  const { data } = await apiClient.post<{
    success: boolean;
    data: { items: SearchPaper[] };
  }>("/search/papers", body);
  return data.data.items;
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
