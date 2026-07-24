import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChatMessage from "./ChatMessage";
import ChatInputBar from "./ChatInputBar";
import {
  type ChatMessage as ChatMessageType,
  type ChipType,
  type SearchFilters,
  type SearchPaper,
} from "../../types/search";

interface SearchChatAreaProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  isPanelOpen: boolean;
  onSend: (message: string) => void;
  onChipClick: (chipId: string, chipType: ChipType, label: string) => void;
  onPanelOpen: (data: {
    result_items: SearchPaper[];
    filters: SearchFilters;
    total_count: number;
  }) => void;
  onRetry: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onStop: () => void;
}

const chatAreaSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flex: 1,
  alignSelf: "stretch",
  overflow: "hidden",
};

const messagesWrapperSx = (isPanelOpen: boolean): SxProps<Theme> => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "24px",
  alignSelf: "stretch",
  pb: "24px",
  width: "100%",
  ...(!isPanelOpen && { maxWidth: "912px", mx: "auto" }),
});

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
    <Box sx={chatAreaSx}>
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          alignSelf: "stretch",
        }}
      >
        <Box sx={messagesWrapperSx(isPanelOpen)}>
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
      </Box>
      <Box
        sx={{
          alignSelf: "stretch",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            alignSelf: "stretch",
            width: "100%",
            ...(!isPanelOpen && { maxWidth: "912px", mx: "auto" }),
          }}
        >
          <ChatInputBar
            isStreaming={isStreaming}
            onSend={onSend}
            onStop={onStop}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchChatArea;
