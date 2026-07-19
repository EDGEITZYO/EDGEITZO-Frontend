import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import {
  type ChatMessage as ChatMessageType,
  type ChipType,
  type NarrowChip,
  type ExpandChip,
} from "../../types/search";

interface ChatMessageProps {
  message: ChatMessageType;
  onChipClick: (chipId: string, chipType: ChipType, label: string) => void;
  onPanelOpen: () => void;
  onRetry: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
}

// ─── 사용자 메시지 ────────────────────────────────────────

const UserMessage = ({
  message,
  onRetry,
  onEdit,
}: {
  message: ChatMessageType;
  onRetry: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  const handleEditSubmit = () => {
    if (!editValue.trim()) return;
    onEdit(message.id, editValue.trim());
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditValue(message.content);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
        alignSelf: "stretch",
      }}
    >
      {/* 대화 박스 */}
      {isEditing ? (
        <Box
          sx={{
            maxWidth: "70%",
            display: "flex",
            padding: "20px 32px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "line.neutral",
            backgroundColor: "background.default",
          }}
        >
          <Box
            component="textarea"
            value={editValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEditValue(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleEditSubmit();
              }
              if (e.key === "Escape") handleEditCancel();
            }}
            sx={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              background: "transparent",
              fontFamily: "Pretendard Variable, sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "30px",
              letterSpacing: "-0.378px",
              color: "label.normal",
              textAlign: "right",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            padding: "20px 32px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "line.neutral",
            backgroundColor: "background.default",
          }}
        >
          <Typography
            sx={{
              color: "label.normal",
              textAlign: "right",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "30px",
              letterSpacing: "-0.378px",
            }}
          >
            {message.content}
          </Typography>
        </Box>
      )}

      {/* 수정/재검색 버튼 */}
      {(isEditing || message.isStopped) && (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          {isEditing ? (
            <>
              {/* 닫기 버튼 */}
              <IconButton onClick={handleEditCancel} sx={actionButtonSx}>
                <CloseIcon sx={actionIconSx} />
              </IconButton>
              {/* 제출 버튼 */}
              <IconButton
                onClick={handleEditSubmit}
                sx={{
                  ...actionButtonSx,
                  backgroundColor: "#000",
                  borderColor: "#000",
                }}
              >
                <ArrowForwardIcon sx={{ ...actionIconSx, color: "#FFF" }} />
              </IconButton>
            </>
          ) : (
            <>
              {/* 수정 버튼 */}
              <IconButton
                onClick={() => setIsEditing(true)}
                sx={actionButtonSx}
              >
                <EditOutlinedIcon sx={actionIconSx} />
              </IconButton>
              {/* 재검색 버튼 */}
              <IconButton
                onClick={() => onRetry(message.id)}
                sx={actionButtonSx}
              >
                <RefreshOutlinedIcon sx={actionIconSx} />
              </IconButton>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

// ─── AI 메시지 ────────────────────────────────────────────

const AiMessage = ({
  message,
  onChipClick,
  onPanelOpen,
}: {
  message: ChatMessageType;
  onChipClick: (chipId: string, chipType: ChipType, label: string) => void;
  onPanelOpen: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const statusBlock = message.blocks?.find((b) => b.type === "status");
  const textBlock = message.blocks?.find((b) => b.type === "text");
  const resultSummaryBlock = message.blocks?.find(
    (b) => b.type === "result_summary",
  );
  const narrowChipsBlock = message.blocks?.find(
    (b) => b.type === "narrow_chips",
  );
  const expandChipsBlock = message.blocks?.find(
    (b) => b.type === "expand_chips",
  );
  const paperCountBlock = message.blocks?.find(
    (b) =>
      b.type === "status" &&
      b.status === "searching" &&
      b.paperCount !== undefined,
  );

  const isComplete =
    statusBlock?.type === "status" && statusBlock.status === "complete";
  const isSearching =
    statusBlock?.type === "status" && statusBlock.status === "searching";

  return (
    <Box
      sx={{
        display: "flex",
        paddingLeft: "12px",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
      }}
    >
      {/* AI 아이콘 */}
      <Box
        sx={{
          display: "flex",
          width: "36px",
          height: "36px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "56.25px",
          backgroundColor: "background.default",
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src="/ai_icon.svg"
          alt="AI"
          sx={{ width: "25px", height: "20px" }}
        />
      </Box>

      {/* AI 답변 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          flex: "1 0 0",
        }}
      >
        {/* 탐색 상태 */}
        {(message.isLoading || statusBlock) && (
          <Box
            sx={{
              display: "flex",
              paddingTop: "4px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography
              sx={{
                color: "label.alternative",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "30px",
                letterSpacing: "-0.378px",
              }}
            >
              {message.isLoading
                ? "탐색 시작할게요."
                : isComplete
                  ? "탐색 완료"
                  : "논문 탐색 중..."}
            </Typography>
            {isComplete && (
              <IconButton
                onClick={() => setIsExpanded((prev) => !prev)}
                sx={{ p: 0, width: 24, height: 24 }}
              >
                {isExpanded ? (
                  <KeyboardArrowUpIcon
                    sx={{ width: 24, height: 24, color: "label.alternative" }}
                  />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ width: 24, height: 24, color: "label.alternative" }}
                  />
                )}
              </IconButton>
            )}
          </Box>
        )}

        {/* 논문 탐색 중 발견한 논문 박스 */}
        {isSearching &&
          paperCountBlock?.type === "status" &&
          paperCountBlock.paperCount !== undefined && (
            <Box
              onClick={onPanelOpen}
              sx={{
                display: "flex",
                padding: "16px 16px 16px 24px",
                alignItems: "center",
                gap: "36px",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "line.normal",
                backgroundColor: "background.default",
                cursor: "pointer",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ArticleOutlinedIcon
                  sx={{ width: 24, height: 24, color: "label.normal" }}
                />
                <Typography
                  sx={{
                    color: "label.normal",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "27px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  발견한 논문 {paperCountBlock.paperCount}개
                </Typography>
              </Box>
              <KeyboardArrowRightIcon
                sx={{
                  width: 24,
                  height: 24,
                  color: "label.normal",
                  transform: "rotate(-90deg)",
                }}
              />
            </Box>
          )}

        {/* 탐색 완료 후 답변 영역 */}
        {isComplete && isExpanded && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
              alignSelf: "stretch",
            }}
          >
            {/* AI 요약 텍스트 */}
            {(textBlock?.type === "text" || message.content) && (
              <Typography
                sx={{
                  color: "label.alternative",
                  fontSize: "18px",
                  fontWeight: 500,
                  lineHeight: "30px",
                  letterSpacing: "-0.378px",
                }}
              >
                {textBlock?.type === "text"
                  ? textBlock.content
                  : message.content}
              </Typography>
            )}

            {/* 결과 박스들 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                alignSelf: "stretch",
              }}
            >
              {/* 탐색 결과 박스 */}
              {resultSummaryBlock?.type === "result_summary" && (
                <ResultSummaryBox
                  totalCount={resultSummaryBlock.total_count}
                  keywords={resultSummaryBlock.keywords}
                  onPanelOpen={onPanelOpen}
                />
              )}

              {/* 칩 섹션 */}
              {(narrowChipsBlock || expandChipsBlock) && (
                <ChipSection
                  narrowChips={
                    narrowChipsBlock?.type === "narrow_chips"
                      ? narrowChipsBlock.chips
                      : []
                  }
                  expandChips={
                    expandChipsBlock?.type === "expand_chips"
                      ? expandChipsBlock.chips
                      : []
                  }
                  onChipClick={onChipClick}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── 탐색 결과 박스 ───────────────────────────────────────

const ResultSummaryBox = ({
  totalCount,
  keywords,
  onPanelOpen,
}: {
  totalCount: number;
  keywords: string[];
  onPanelOpen: () => void;
}) => (
  <Box
    sx={{
      display: "flex",
      maxWidth: "780px",
      padding: "16px 24px",
      justifyContent: "space-between",
      alignItems: "center",
      alignContent: "center",
      rowGap: "12px",
      alignSelf: "stretch",
      flexWrap: "wrap",
      borderRadius: "8px",
      border: "1px solid",
      borderColor: "line.normal",
      backgroundColor: "background.default",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        flex: "1 0 0",
      }}
    >
      <Typography
        sx={{
          color: "label.neutral",
          fontSize: "18px",
          fontWeight: 600,
          lineHeight: "29px",
          letterSpacing: "-0.378px",
        }}
      >
        관련 논문 탐색 결과
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <Typography
          sx={{
            color: "#029B56",
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: "29px",
            letterSpacing: "-0.34px",
          }}
        >
          {totalCount}건
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            gap: "0 4px",
            flex: "1 0 0",
            flexWrap: "wrap",
          }}
        >
          {keywords.map((keyword, index) => (
            <Typography
              key={keyword}
              sx={{
                color: "label.alternative",
                fontSize: "17px",
                fontWeight: 400,
                lineHeight: "29px",
                letterSpacing: "-0.34px",
              }}
            >
              {keyword}
              {index < keywords.length - 1 && (
                <Box component="span" sx={{ mx: "4px" }}>
                  ·
                </Box>
              )}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
    <Box
      onClick={onPanelOpen}
      sx={{
        display: "flex",
        padding: "8px 13px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        borderRadius: "24px",
        backgroundColor: "label.normal",
        cursor: "pointer",
      }}
    >
      <Typography
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          overflow: "hidden",
          color: "#FAFAFC",
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
        }}
      >
        논문 보기
      </Typography>
    </Box>
  </Box>
);

// ─── 칩 섹션 ─────────────────────────────────────────────

const ChipSection = ({
  narrowChips,
  expandChips,
  onChipClick,
}: {
  narrowChips: NarrowChip[];
  expandChips: ExpandChip[];
  onChipClick: (chipId: string, chipType: ChipType, label: string) => void;
}) => {
  const hasNarrow = narrowChips.length > 0;
  const hasExpand = expandChips.length > 0;
  const hasBoth = hasNarrow && hasExpand;

  return (
    <Box
      sx={{
        display: "flex",
        alignSelf: "stretch",
        maxWidth: "780px",
        alignItems: "flex-start",
        alignContent: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {hasNarrow && (
        <ChipBox
          title="더 구체적인 조건으로 탐색할까요?"
          chips={narrowChips.map((c) => ({
            id: c.chip_id,
            type: c.chip_type,
            label: c.label,
          }))}
          onChipClick={onChipClick}
          withBorder={hasBoth}
        />
      )}
      {hasExpand && (
        <ChipBox
          title="이런 방향은 어떠세요?"
          chips={expandChips.map((c) => ({
            id: c.chip_id,
            type: c.chip_type,
            label: c.label,
          }))}
          onChipClick={onChipClick}
          withBorder={hasBoth}
        />
      )}
    </Box>
  );
};

const ChipBox = ({
  title,
  chips,
  onChipClick,
  withBorder = false,
}: {
  title: string;
  chips: { id: string; type: ChipType; label: string }[];
  onChipClick: (chipId: string, chipType: ChipType, label: string) => void;
  withBorder?: boolean;
}) => (
  <Box
    sx={{
      display: "flex",
      minWidth: "382px",
      padding: "20px",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "16px",
      flex: "1 0 0",
      ...(withBorder && {
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "line.normal",
        backgroundColor: "background.default",
      }),
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
      }}
    >
      <Typography
        sx={{
          alignSelf: "stretch",
          color: "label.neutral",
          fontSize: "17px",
          fontWeight: 600,
          lineHeight: "29px",
          letterSpacing: "-0.34px",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        {chips.map((chip) => (
          <Box
            key={chip.id}
            onClick={() => onChipClick(chip.id, chip.type, chip.label)}
            sx={{
              display: "flex",
              padding: "8px 13px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              borderRadius: "24px",
              backgroundColor: "fill.normal",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                color: "label.alternative",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.336px",
              }}
            >
              {chip.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

// ─── 액션 버튼 공통 스타일 ────────────────────────────────

const actionButtonSx: SxProps<Theme> = {
  display: "flex",
  width: "32px",
  height: "32px",
  padding: "6px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: "fill.strong",
  backgroundColor: "fill.normal",
  "&:hover": {
    backgroundColor: "fill.normal",
  },
};

const actionIconSx: SxProps<Theme> = {
  width: "20px",
  height: "20px",
  flexShrink: 0,
  color: "label.alternative",
};

// ─── ChatMessage ──────────────────────────────────────────

const ChatMessage = ({
  message,
  onChipClick,
  onPanelOpen,
  onRetry,
  onEdit,
}: ChatMessageProps) => {
  if (message.role === "user") {
    return <UserMessage message={message} onRetry={onRetry} onEdit={onEdit} />;
  }

  return (
    <AiMessage
      message={message}
      onChipClick={onChipClick}
      onPanelOpen={onPanelOpen}
    />
  );
};

export default ChatMessage;
