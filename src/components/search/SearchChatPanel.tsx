import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChatMessage from "./ChatMessage";
import ChoiceButton from "./ChoiceButton";
import EtcInputField from "./EtcInputField";
import ChatInputBar from "./ChatInputBar";
import {
  type ChatMessage as ChatMessageType,
  type ChatChoice,
  type SearchStep,
} from "../../types/search";

interface SearchChatPanelProps {
  initialQuery: string;
  onStepChange: (step: SearchStep, selection: string) => void;
  onSearchStart: () => void;
}

// ─── 프론트 하드코딩 선택지 ───────────────────────────────

const PURPOSE_CHOICES: ChatChoice[] = [
  { id: "1", label: "연구 주제 탐색 (아직 방향을 잡는 단계)" },
  { id: "2", label: "논문 작성 참고 (선행연구로 인용할 논문)" },
  { id: "3", label: "랩미팅/발표 준비 (최근 주요 연구 위주)" },
  { id: "4", label: "최신 트렌드 파악 (리뷰/메타분석 위주)" },
  { id: "5", label: "기타", isEtc: true },
];

const SCOPE_CHOICES: ChatChoice[] = [
  { id: "1", label: "KCI (국내 등재 학술지)" },
  { id: "2", label: "SCI/SSCI/A&HCI (국제 등재 학술지)" },
  { id: "3", label: "둘 다 포함" },
  { id: "4", label: "상관없음" },
];

const PERIOD_CHOICES: ChatChoice[] = [
  { id: "1", label: "최근 3년 (2023~현재)" },
  { id: "2", label: "최근 5년 (2021~현재)" },
  { id: "3", label: "최근 10년 (2016~현재)" },
  { id: "4", label: "전체" },
  { id: "5", label: "건너뛰기", isSkip: true },
];

const FINAL_CHOICES: ChatChoice[] = [
  { id: "1", label: "검색 조건 더 구체화 하기" },
  { id: "2", label: "바로 검색하기" },
  { id: "3", label: "탐색 종료하기" },
];

// ─── 단계 순서 ────────────────────────────────────────────

const STEP_ORDER: SearchStep[] = [
  "purpose",
  "scope",
  "period",
  "narrowDown",
  "final",
];

const getNextStep = (current: SearchStep): SearchStep | null => {
  const idx = STEP_ORDER.indexOf(current);
  if (idx === -1 || idx === STEP_ORDER.length - 1) return null;
  return STEP_ORDER[idx + 1];
};

const getChoicesForStep = (
  step: SearchStep,
  narrowDownChoices: ChatChoice[],
): ChatChoice[] | null => {
  switch (step) {
    case "purpose":
      return PURPOSE_CHOICES;
    case "scope":
      return SCOPE_CHOICES;
    case "period":
      return PERIOD_CHOICES;
    case "narrowDown":
      return narrowDownChoices; // TODO: API 연동 시 백엔드에서 받아올 것
    case "final":
      return FINAL_CHOICES;
    default:
      return null;
  }
};

// ─── 단계별 AI 문구 생성 ──────────────────────────────────

const getAiMessage = (
  step: SearchStep,
  prevSelection: string,
  aiKeyword: string,
): string => {
  switch (step) {
    case "purpose":
      // TODO: API 연동 시 aiKeyword를 백엔드 응답(초기 쿼리 분석 결과)으로 교체
      return `안녕하세요, "${aiKeyword}" 관련 논문 찾는 걸 도와드릴게요.\n찾으시는 논문을 어떤 용도로 활용하실 계획인가요?\n목적에 따라 추천 논문의 유형이 달라져요.`;
    case "scope":
      return `${prevSelection}을 기반으로 논문 탐색을 도와드릴게요.\n어떤 범위의 논문을 탐색할까요? 범위에 따라 검색하는 논문 종류가 달라져요.`;
    case "period":
      return `${prevSelection}을 기반으로 논문을 검색할게요.\n논문의 발행 시기 범위도 설정하시겠어요?\n최신 연구만 필요하시면 범위를 좁혀드릴게요.`;
    case "narrowDown":
      // TODO: API 연동 시 선택지를 백엔드에서 받아올 것
      if (prevSelection === "건너뛰기") {
        return `입력하신 내용을 학술 키워드로 분해해 봤어요.\n관련 있는 키워드를 선택해 주세요. (복수선택 가능)`;
      }
      return `발행 연도를 기반으로 범위를 좀 더 좁혔어요.\n입력하신 내용을 학술 키워드로 분해해 봤어요.\n관련 있는 키워드를 선택해 주세요. (복수선택 가능)`;
    case "final":
      return `충분한 조건이 모였어요! 논문 탐색을 시작할게요.\n결과를 확인한 후에 조건을 수정하실 수 있어요.`;
    default:
      return "";
  }
};

// ─── 스타일 ───────────────────────────────────────────────

const scrollAreaSx: SxProps<Theme> = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  px: "20px",
  py: "24px",
};

const choiceListSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  pl: "76px",
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const SearchChatPanel = ({
  initialQuery,
  onStepChange,
  onSearchStart,
}: SearchChatPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // TODO: API 연동 시 aiKeyword를 백엔드 응답(초기 쿼리 분석 결과)으로 교체
  const aiKeyword = initialQuery;

  const [currentStep, setCurrentStep] = useState<SearchStep>("purpose");
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      role: "user",
      content: initialQuery,
    },
    {
      id: "2",
      role: "ai",
      content: getAiMessage("purpose", "", aiKeyword),
      choices: PURPOSE_CHOICES,
    },
  ]);

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [etcInput, setEtcInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [showEtcInput, setShowEtcInput] = useState(false);
  const [selectedMultipleIds, setSelectedMultipleIds] = useState<string[]>([]);

  // TODO: API 연동 시 백엔드에서 받은 키워드로 교체
  const [narrowDownChoices] = useState<ChatChoice[]>([
    { id: "1", label: "세포 노화(Cellular Senescence)", isMultiple: true },
    { id: "2", label: "미토콘드리아(Mitochondria)", isMultiple: true },
    { id: "3", label: "활성산소종(Reactive Oxygen Species)", isMultiple: true },
    { id: "4", label: "노화 관련 분비 표현형(SASP)", isMultiple: true },
    { id: "5", label: "자가포식(Autophagy)", isMultiple: true },
  ]);

  // TODO: API 연동 시 백엔드에서 받은 추가 키워드로 교체
  const [refineChoices] = useState<ChatChoice[]>([
    { id: "1", label: "미토콘드리아 막전위" },
    { id: "2", label: "ROS 산화 스트레스" },
    { id: "3", label: "p53·p21 신호 경로" },
    { id: "4", label: "텔로미어 단축" },
    { id: "5", label: "염증성 사이토카인" },
    { id: "6", label: "DNA 손상 반응" },
  ]);

  const [isRefining, setIsRefining] = useState(false);

  const isEtcSelected = !!messages
    .flatMap((m) => m.choices ?? [])
    .find((c) => c.id === selectedChoiceId)?.isEtc;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isMultipleStep = currentStep === "narrowDown" && !isRefining;

  const handleChoiceClick = (choice: ChatChoice) => {
    if (isMultipleStep) {
      // 복수 선택 처리
      setSelectedMultipleIds((prev) =>
        prev.includes(choice.id)
          ? prev.filter((id) => id !== choice.id)
          : [...prev, choice.id],
      );
      return;
    }
    setSelectedChoiceId(choice.id);
    if (choice.isEtc) {
      setShowEtcInput(true);
    } else {
      setShowEtcInput(false);
      handleSelection(choice.label);
    }
  };

  const handleEtcSubmit = (value: string) => {
    setShowEtcInput(false);
    handleSelection(value);
  };

  const handleChatSubmit = (value: string) => {
    setChatInput("");
    handleSelection(value);
  };

  const handleMultipleComplete = () => {
    if (selectedMultipleIds.length === 0) return;
    const selectedLabels = narrowDownChoices
      .filter((c) => selectedMultipleIds.includes(c.id))
      .map((c) => c.label)
      .join(", ");
    setSelectedMultipleIds([]);
    handleSelection(selectedLabels);
  };

  const handleSelection = (selection: string) => {
    // ─── final 단계 특수 처리 ─────────────────────────────
    if (currentStep === "final") {
      if (selection === "바로 검색하기") {
        onSearchStart();
        return;
      }
      if (selection === "탐색 종료하기") {
        const userMsg: ChatMessageType = {
          id: Date.now().toString(),
          role: "user",
          content: selection,
        };
        const endMsg: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "탐색을 종료합니다. 다음에 또 찾아주세요!",
        };
        setMessages((prev) => [...prev, userMsg, endMsg]);
        return;
      }
      if (selection === "검색 조건 더 구체화 하기") {
        onStepChange("final", selection);
        setIsRefining(true);
        const userMsg: ChatMessageType = {
          id: Date.now().toString(),
          role: "user",
          content: selection,
        };
        const aiMsg: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "구체적으로 어떤 관련한 논문 수집을 원하시나요?",
          choices: refineChoices,
        };
        setMessages((prev) => [...prev, userMsg, aiMsg]);
        setSelectedChoiceId(null);
        setSelectedMultipleIds([]);
        return;
      }
      // refineChoices에서 선택한 경우 → 일반 단계 처리로 넘어감
      if (isRefining) {
        const userMsg: ChatMessageType = {
          id: Date.now().toString(),
          role: "user",
          content: selection,
        };
        const aiMsg: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `충분한 조건이 모였어요! 논문 탐색을 시작할게요.\n결과를 확인한 후에 조건을 수정하실 수 있어요.`,
          choices: FINAL_CHOICES,
          isFinal: true,
        };
        // TODO: API 연동 시 onStepChange 콜백으로 백엔드에 선택값 전송 및 검색결과 업데이트
        onStepChange("narrowDown", selection);
        setMessages((prev) => [...prev, userMsg, aiMsg]);
        setSelectedChoiceId(null);
        setIsRefining(false);
        return;
      }
    }

    // ─── 일반 단계 처리 ───────────────────────────────────
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: selection,
    };

    const nextStep = getNextStep(currentStep);

    // TODO: API 연동 시 onStepChange 콜백으로 백엔드에 선택값 전송 및 검색결과 업데이트
    onStepChange(currentStep, selection);

    if (nextStep === null) {
      setMessages((prev) => [...prev, userMsg]);
      setSelectedChoiceId(null);
      return;
    }

    const choices = getChoicesForStep(nextStep, narrowDownChoices);

    const aiMsg: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: getAiMessage(nextStep, selection, aiKeyword),
      choices: choices ?? undefined,
      isFinal: nextStep === "final",
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setCurrentStep(nextStep);
    setIsRefining(false);
    setSelectedChoiceId(null);
    setShowEtcInput(false);
  };

  const lastAiMessage = [...messages]
    .reverse()
    .find((m) => m.role === "ai" && !m.isLoading);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box ref={scrollRef} sx={scrollAreaSx}>
        {messages.map((message) => (
          <Box key={message.id}>
            <ChatMessage message={message} />
            {message.role === "ai" &&
              !message.isLoading &&
              message.choices &&
              message === lastAiMessage && (
                <Box sx={choiceListSx}>
                  {message.choices.map((choice) => (
                    <Box key={choice.id}>
                      <ChoiceButton
                        choice={choice}
                        selected={
                          isMultipleStep
                            ? selectedMultipleIds.includes(choice.id)
                            : selectedChoiceId === choice.id
                        }
                        onClick={handleChoiceClick}
                      />
                      {choice.isEtc && isEtcSelected && showEtcInput && (
                        <Box sx={{ mt: "7px" }}>
                          <EtcInputField
                            value={etcInput}
                            onChange={setEtcInput}
                            onSubmit={handleEtcSubmit}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                  {/* 복수 선택 완료 버튼 */}
                  {isMultipleStep && (
                    <Box
                      onClick={handleMultipleComplete}
                      sx={{
                        display: "inline-flex",
                        mt: "8px",
                        padding: "10px 32px",
                        borderRadius: "50px",
                        backgroundColor:
                          selectedMultipleIds.length > 0
                            ? "#31333F"
                            : "#CBCDD7",
                        color: "#FFF",
                        fontSize: "18px",
                        fontWeight: 600,
                        cursor:
                          selectedMultipleIds.length > 0
                            ? "pointer"
                            : "default",
                        alignSelf: "flex-start",
                        pointerEvents:
                          selectedMultipleIds.length > 0 ? "auto" : "none",
                      }}
                    >
                      선택 완료
                    </Box>
                  )}
                </Box>
              )}
          </Box>
        ))}
      </Box>
      <ChatInputBar
        value={chatInput}
        onChange={setChatInput}
        onSubmit={handleChatSubmit}
      />
    </Box>
  );
};

export default SearchChatPanel;
