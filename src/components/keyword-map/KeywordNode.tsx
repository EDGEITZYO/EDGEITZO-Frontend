import { memo, useState, useCallback } from "react";
import { type NodeProps, Handle, Position } from "reactflow";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  type KeywordNodeData,
  type KMNodeDefinition,
} from "../../types/keywordMap";
import { keywordMapApi } from "../../api/keywordMap";
import { useKeywordMapActions } from "../../stores/keywordMapStore";

const KeywordNode = memo(
  ({ id, data, selected }: NodeProps<KeywordNodeData>) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);
    const [definition, setDefinition] = useState<KMNodeDefinition | null>(null);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    const { openPaperPanel } = useKeywordMapActions();

    const isAnchor = data.side === "anchor";
    const canExpand = data.hasMore;
    const showDefinitionBox = isHovered || selected;

    const handleMouseEnter = useCallback(async () => {
      setIsHovered(true);
      if (definition !== null || isFetchingDetail) return;
      setIsFetchingDetail(true);
      try {
        const res = await keywordMapApi.getNodeDetail(id);
        setDefinition(res.data.data.definition);
      } catch {
        // 조용히 실패
      } finally {
        setIsFetchingDetail(false);
      }
    }, [id, definition, isFetchingDetail]);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);

    const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(data.label);
    }, [data.label]);

    const handleSearch = useCallback(() => {
      openPaperPanel(id, data.label);
    }, [id, data.label, openPaperPanel]);

    // expand 로직은 KeywordMapGraph에서 관리 — 이벤트만 올려줌
    const handleExpand = useCallback(async () => {
      setIsExpanding(true);
      try {
        // KeywordMapGraph의 onExpandNode 이벤트를 트리거하기 위해
        // ReactFlow의 커스텀 이벤트 사용
        const event = new CustomEvent("expandNode", { detail: { nodeId: id } });
        window.dispatchEvent(event);
      } finally {
        setIsExpanding(false);
      }
    }, [id]);

    return (
      <Box
        sx={{ position: "relative" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 클릭 시 추가 테두리 */}
        <Box
          sx={{
            display: "inline-flex",
            padding: "8px",
            borderRadius: "7px",
            border: selected ? "2px solid #3BA502" : "2px solid transparent",
          }}
        >
          {/* 실제 노드 박스 */}
          <Box
            sx={{
              display: "flex",
              width: "360px",
              height: "76px",
              padding: "10px 12px",
              alignItems: "flex-start",
              gap: "2px",
              borderRadius: "6px",
              border: "1px solid #D8DAE5",
              background:
                "linear-gradient(223deg, #FFF 74.02%, #6ED835 454.11%)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {!isAnchor && (
              <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                style={{ opacity: 0 }}
              />
            )}
            {(isAnchor || canExpand) && (
              <Handle
                type="source"
                position={Position.Right}
                id="right"
                style={{ opacity: 0 }}
              />
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "2px",
                flex: "1 0 0",
              }}
            >
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  alignSelf: "stretch",
                  overflow: "hidden",
                  color: "#73757F",
                  textOverflow: "ellipsis",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                {isAnchor ? "검색 키워드" : "키워드"}
              </Typography>
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  alignSelf: "stretch",
                  overflow: "hidden",
                  color: "#1E2026",
                  textOverflow: "ellipsis",
                  fontSize: "18px",
                  fontWeight: 500,
                  lineHeight: "30px",
                  letterSpacing: "-0.378px",
                }}
              >
                {data.label}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 클릭 시 버튼들 */}
        {selected && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              transform: "translateY(-100%) translateY(-8px)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Box
              onClick={handleSearch}
              sx={{
                display: "flex",
                width: "42px",
                height: "40px",
                padding: "8px 9px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "24px",
                background: "#1E2026",
                cursor: "pointer",
              }}
            >
              <SearchIcon
                sx={{ width: "24px", height: "24px", color: "#fff" }}
              />
            </Box>
            {canExpand && (
              <Box
                onClick={handleExpand}
                sx={{
                  display: "flex",
                  width: "42px",
                  height: "40px",
                  padding: "8px 9px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "24px",
                  background: "#3BA502",
                  cursor: "pointer",
                }}
              >
                {isExpanding ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  <ArrowForwardIcon
                    sx={{ width: "24px", height: "24px", color: "#fff" }}
                  />
                )}
              </Box>
            )}
          </Box>
        )}

        {/* 설명 박스 */}
        {showDefinitionBox && (
          <Box
            sx={{
              position: "absolute",
              left: "calc(100% + 16px)",
              top: 0,
              width: "360px",
              zIndex: 10,
              display: "flex",
              padding: "12px 16px 16px 16px",
              flexDirection: "column",
              alignItems: "flex-start",
              borderRadius: "12px",
              background: "rgba(30, 32, 38, 0.90)",
              backdropFilter: "blur(2px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                alignSelf: "stretch",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignSelf: "stretch",
                }}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    color: "#FAFAFC",
                    textOverflow: "ellipsis",
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "29px",
                    letterSpacing: "-0.378px",
                  }}
                >
                  {data.label}
                </Typography>
                <IconButton
                  onClick={handleCopy}
                  sx={{ width: "32px", height: "32px", p: 0 }}
                >
                  <ContentCopyIcon
                    sx={{ width: "20px", height: "20px", color: "#FAFAFC" }}
                  />
                </IconButton>
              </Box>
              {isFetchingDetail ? (
                <CircularProgress size={16} sx={{ color: "#FAFAFC" }} />
              ) : (
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 5,
                    alignSelf: "stretch",
                    overflow: "hidden",
                    color: "#F7F8FA",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  {definition?.definition ?? "키워드 설명이 없어요."}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    );
  },
);

KeywordNode.displayName = "KeywordNode";

export default KeywordNode;
