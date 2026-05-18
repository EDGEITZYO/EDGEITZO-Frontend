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
} from "../../types/search";

interface SearchChatPanelProps {
  initialQuery: string;
}

const MOCK_CHOICES: ChatChoice[] = [
  { id: "1", label: "연구 주제 탐색 (아직 방향을 잡는 단계)" },
  { id: "2", label: "논문 작성 참고 (선행연구로 인용할 논문)" },
  { id: "3", label: "랩미팅/발표 준비 (최근 주요 연구 위주)" },
  { id: "4", label: "최신 트렌드 파악 (리뷰/메타분석 위주)" },
  { id: "5", label: "기타", isEtc: true },
];

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

const SearchChatPanel = ({ initialQuery }: SearchChatPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      role: "user",
      content: initialQuery,
    },
    {
      id: "2",
      role: "ai",
      content: `안녕하세요, "${initialQuery}" 관련 논문 찾는 걸 도와드릴게요.\n찾으시는 논문을 어떤 용도로 활용하실 계획인가요?\n목적에 따라 추천 논문의 유형이 달라져요.`,
      choices: MOCK_CHOICES,
    },
  ]);

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [etcInput, setEtcInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [showEtcInput, setShowEtcInput] = useState(false);
  const [mockStep, setMockStep] = useState(0);

  const isEtcSelected = !!messages
    .flatMap((m) => m.choices ?? [])
    .find((c) => c.id === selectedChoiceId)?.isEtc;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChoiceClick = (choice: ChatChoice) => {
    // setSelectedChoiceId(choice.id);
    // if (choice.id === "5") {
    //   setShowEtcInput(true);
    // } else {
    //   setShowEtcInput(false);
    //   addUserMessage(choice.label);
    // }
    if (choice.isRefresh) {
      // TODO: API 연동 시 키워드 새로고침 API 호출로 교체
      return;
    }
    setSelectedChoiceId(choice.id);
    if (choice.isEtc) {
      setShowEtcInput(true);
    } else {
      setShowEtcInput(false);
      addUserMessage(choice.label);
    }
  };

  const handleEtcSubmit = (value: string) => {
    setShowEtcInput(false);
    addUserMessage(value);
  };

  const handleChatSubmit = (value: string) => {
    setChatInput("");
    addUserMessage(value);
  };

  const addUserMessage = (content: string) => {
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    const loadingMsg: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: "",
      isLoading: true,
    };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    // TODO: API 연동 시 아래 mock 응답 전체 제거하고 실제 API 호출로 교체
    // API 응답으로 받아야 할 것: content, choices, specificity, currentStep
    setTimeout(() => {
      const mockResponses: ChatMessageType[] = [
        {
          id: "",
          role: "ai",
          content:
            "연구주제 탐색을 기반으로 논문 탐색을 도와드릴게요.\n어떤 범위의 논문을 탐색할까요? 범위에 따라 검색하는 논문 종류가 달라져요.",
          choices: [
            { id: "1", label: "KCI (국내 등재 학술지)" },
            { id: "2", label: "SCI/SSCI/A&HCI (국제 등재 학술지)" },
            { id: "3", label: "둘 다 포함" },
            { id: "4", label: "상관없음" },
          ],
        },
        {
          id: "",
          role: "ai",
          content:
            "국내와 국제 등재 학술지 모두를 검색할게요.\n논문의 발행 시기 범위도 설정하시겠어요?\n최신 연구만 필요하시면 범위를 좁혀드릴게요.",
          choices: [
            { id: "1", label: "최근 3년 (2023~현재)" },
            { id: "2", label: "최근 5년 (2021~현재)" },
            { id: "3", label: "최근 10년 (2016~현재)" },
            { id: "4", label: "전체" },
            { id: "5", label: "건너뛰기" },
          ],
        },
        {
          id: "",
          role: "ai",
          content:
            "발행 연도를 기반으로 범위를 좀 더 좁혔어요.\n마지막 단계입니다. 입력하신 내용을 학술 키워드로 분해해 봤어요.\n관련 있는 키워드를 선택해 주세요. (복수선택 가능)",
          choices: [
            { id: "1", label: "충동구매(Impulsive Buying)" },
            { id: "2", label: "스트레스 대처(Stress Coping)" },
            { id: "3", label: "감정 소비(Emotional Consumption)" },
            { id: "4", label: "자기조절(Self-Regulation)" },
            { id: "5", label: "보상 심리(Reward Seeking)" },
            { id: "6", label: "키워드 새로고침", isRefresh: true },
          ],
        },
        {
          id: "",
          role: "ai",
          content:
            "이제 검색을 시작할 수 있어요.\n더 자세한 탐색을 원하시나요?",
          choices: [
            { id: "1", label: "검색 조건 더 구체화 하기" },
            { id: "2", label: "바로 검색하기" },
            { id: "3", label: "탐색 종료하기" },
          ],
          isFinal: true,
        },
      ];

      const nextStep =
        mockStep < mockResponses.length ? mockStep : mockResponses.length - 1;
      const mockResponse: ChatMessageType = {
        ...mockResponses[nextStep],
        id: (Date.now() + 2).toString(),
      };

      setMessages((prev) => prev.map((m) => (m.isLoading ? mockResponse : m)));

      // TODO: API 연동 시 isFinal 판단을 백엔드 응답 기준으로 교체
      if (mockResponse.isFinal) return;

      // TODO: API 연동 시 selectedChoiceId 초기화 타이밍 백 응답 기준으로 맞출 것
      setMockStep((prev) => Math.min(prev + 1, mockResponses.length - 1));
      setSelectedChoiceId(null);
    }, 1000);
  };

  const lastMessage = messages[messages.length - 1];
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
                        selected={selectedChoiceId === choice.id}
                        onClick={handleChoiceClick}
                      />
                      {choice.id === "5" && isEtcSelected && showEtcInput && (
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
