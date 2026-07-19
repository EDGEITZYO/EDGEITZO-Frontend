import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChatMessage from "./ChatMessage";
import ChatInputBar from "./ChatInputBar";
import {
  type ChatMessage as ChatMessageType,
  type ChipType,
} from "../../types/search";

interface SearchChatAreaProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  isPanelOpen: boolean;
  onSend: (message: string) => void;
  onChipClick: (chipId: string, chipType: ChipType, label: string) => void;
  onPanelOpen: () => void;
  onRetry: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onStop: () => void;
}

const chatAreaSx = (isPanelOpen: boolean): SxProps<Theme> => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flex: 1,
  alignSelf: "stretch",
  overflow: "hidden",
  ...(!isPanelOpen && { maxWidth: "912px" }),
});

const messagesWrapperSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "24px",
  alignSelf: "stretch",
  flex: 1,
  overflowY: "auto",
  pb: "24px",
};

const SearchChatArea = ({
  messages,
  isStreaming,
  isPanelOpen,
  onSend,
  onChipClick,
  onPanelOpen,
  onRetry,
  onEdit,
  onStop,
}: SearchChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={chatAreaSx(isPanelOpen)}>
      <Box ref={scrollRef} sx={messagesWrapperSx}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onChipClick={onChipClick}
            onPanelOpen={onPanelOpen}
            onRetry={onRetry}
            onEdit={onEdit}
          />
        ))}
      </Box>
      <ChatInputBar
        isStreaming={isStreaming}
        onSend={onSend}
        onStop={onStop}
      />
    </Box>
  );
};

export default SearchChatArea;
