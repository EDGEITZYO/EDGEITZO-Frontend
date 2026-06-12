import { useRef, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChatMessage from "./ChatMessage";
import ChoiceButton from "./ChoiceButton";
import EtcInputField from "./EtcInputField";
import ChatInputBar from "./ChatInputBar";
import {
  type ChatMessage as ChatMessageType,
  type ChatOption,
} from "../../types/search";

interface SearchChatPanelProps {
  messages: ChatMessageType[];
  options: ChatOption[];
  allowMultiple: boolean;
  isStreaming: boolean;
  onSend: (
    message: string,
    selectedOptions: string[],
    forceStart?: boolean,
  ) => void;
}

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

const SearchChatPanel = ({
  messages,
  options,
  allowMultiple,
  isStreaming,
  onSend,
}: SearchChatPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedOptionValues, setSelectedOptionValues] = useState<string[]>(
    [],
  );
  const [showEtcInput, setShowEtcInput] = useState(false);
  const [etcInput, setEtcInput] = useState("");
  const [chatInput, setChatInput] = useState("");

  // 새 메시지 올 때마다 스크롤 아래로
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 새 턴 시작 시 선택 상태 초기화
  const handleSendWithReset = (
    message: string,
    selectedOptions: string[],
    forceStart?: boolean,
  ) => {
    setSelectedOptionValues([]);
    setShowEtcInput(false);
    setEtcInput("");
    onSend(message, selectedOptions, forceStart);
  };

  const lastAiMessageId = [...messages]
    .reverse()
    .find((m) => m.role === "ai")?.id;

  const handleOptionClick = (option: ChatOption) => {
    if (isStreaming) return;

    if (allowMultiple) {
      setSelectedOptionValues((prev) =>
        prev.includes(option.value)
          ? prev.filter((v) => v !== option.value)
          : [...prev, option.value],
      );
      return;
    }

    // 단일 선택 — etc 처리
    if (option.value === "etc") {
      setSelectedOptionValues([option.value]);
      setShowEtcInput(true);
      return;
    }

    setSelectedOptionValues([option.value]);
    setShowEtcInput(false);
    handleSendWithReset(option.label, [option.value]);
  };

  const handleEtcSubmit = (value: string) => {
    setShowEtcInput(false);
    handleSendWithReset(value, ["etc"]);
  };

  const handleMultipleComplete = () => {
    if (selectedOptionValues.length === 0) return;
    const selectedLabels = options
      .filter((o) => selectedOptionValues.includes(o.value))
      .map((o) => o.label)
      .join(", ");
    handleSendWithReset(selectedLabels, selectedOptionValues);
  };

  const handleChatSubmit = (value: string) => {
    if (!value.trim() || isStreaming) return;
    setChatInput("");
    handleSendWithReset(value, []);
  };
  // TODO: response_type이 'confirm'일 때 버튼 스타일 디자인 확인 필요
  // 현재는 'options'와 동일하게 ChoiceButton으로 렌더링

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box ref={scrollRef} sx={scrollAreaSx}>
        {messages.map((message) => (
          <Box key={message.id}>
            <ChatMessage message={message} />
            {/* 스트리밍 중 — done 이벤트 대기 로딩 */}
            {message.role === "ai" &&
              !message.isLoading &&
              message.id === lastAiMessageId &&
              isStreaming && (
                <Box sx={{ pl: "76px", mt: "8px" }}>
                  <CircularProgress
                    size={20}
                    sx={{ color: "label.assistive" }}
                  />
                </Box>
              )}
            {message.role === "ai" &&
              !message.isLoading &&
              message.options &&
              message.options.length > 0 &&
              message.id === lastAiMessageId &&
              !isStreaming && (
                <Box sx={choiceListSx}>
                  {message.options.map((option) => (
                    <Box key={option.value}>
                      <ChoiceButton
                        option={option}
                        selected={selectedOptionValues.includes(option.value)}
                        onClick={handleOptionClick}
                      />
                      {option.value === "etc" &&
                        selectedOptionValues.includes("etc") &&
                        showEtcInput && (
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
                  {allowMultiple && (
                    <Box
                      onClick={handleMultipleComplete}
                      sx={{
                        display: "inline-flex",
                        mt: "8px",
                        padding: "10px 32px",
                        borderRadius: "50px",
                        backgroundColor:
                          selectedOptionValues.length > 0
                            ? "#31333F"
                            : "#CBCDD7",
                        color: "#FFF",
                        fontSize: "18px",
                        fontWeight: 600,
                        cursor:
                          selectedOptionValues.length > 0
                            ? "pointer"
                            : "default",
                        alignSelf: "flex-start",
                        pointerEvents:
                          selectedOptionValues.length > 0 ? "auto" : "none",
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
