import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { BookOpen, ArrowRight } from "lucide-react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import type {
  CitationDirection,
  CitationTab,
  CitationPaperCard,
} from "../../types/citation";

export interface CitationNodeData {
  title: string | null;
  title_en: string | null;
  pubyear: number | null;
  authors: string[] | null;
  in_service: boolean;
  has_more: boolean;
  direction: CitationDirection;
  isCenter: boolean;
  isSelected: boolean;
  isExpanding: boolean;
  isLeft: boolean;
  tier: number;
  tab: CitationTab;
  paper: CitationPaperCard | null;
  isMini: boolean;
}

// ─── 툴팁 (논문 정보 + 버튼) ─────────────────────────────

interface NodeTooltipProps {
  paper: CitationPaperCard;
  hasMore: boolean;
  isExpanding: boolean;
  isLeft: boolean;
  onViewPaper: () => void;
  onExpand: () => void;
}

const NodeTooltip = ({
  paper,
  hasMore,
  isExpanding,
  isLeft,
  onViewPaper,
  onExpand,
}: NodeTooltipProps) => {
  const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);
  const authors = paper.authors ?? [];
  const journalInfo = [paper.pub_year, paper.journal_name]
    .filter(Boolean)
    .join(" · ");
  const citationCount =
    paper.trust_badge?.citation_count ?? paper.citation_count;
  const kciRegistered = paper.trust_badge?.kci ?? paper.kci_registered;

  const handleCopy = () => {
    const text = paper.title ?? paper.title_en ?? "";
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const containerSx = isLeft
    ? {
        position: "absolute" as const,
        right: "calc(100% + 12px)",
        bottom: 0,
        zIndex: 10,
      }
    : {
        position: "absolute" as const,
        left: "calc(100% + 12px)",
        bottom: 0,
        zIndex: 10,
      };

  return (
    <Box sx={{ ...containerSx, width: "360px" }}>
      {/* 버튼 프레임 */}
      <Box
        sx={{
          display: "inline-flex",
          height: "40px",
          alignItems: "center",
          gap: "4px",
          position: "absolute",
          bottom: 0,
          ...(isLeft ? { right: 0 } : { left: 0 }),
        }}
      >
        {/* 논문 보기 버튼 */}
        <Box
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onViewPaper();
          }}
          sx={{
            display: "flex",
            width: "42px",
            height: "40px",
            padding: "8px 9px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "24px",
            backgroundColor: "#1E2026",
            cursor: "pointer",
          }}
        >
          <BookOpen size={24} color="#FFF" />
        </Box>

        {/* 확장 버튼 */}
        {hasMore && paper.in_service && (
          <Box
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (!isExpanding) onExpand();
            }}
            sx={{
              display: "flex",
              width: "42px",
              height: "40px",
              padding: "8px 9px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "24px",
              backgroundColor: "#3BA502",
              cursor: isExpanding ? "default" : "pointer",
              opacity: isExpanding ? 0.7 : 1,
            }}
          >
            {isExpanding ? (
              <CircularProgress size={16} sx={{ color: "#FFF" }} />
            ) : (
              <ArrowRight size={24} color="#FFF" />
            )}
          </Box>
        )}
      </Box>

      {/* 논문 정보 */}
      <Box
        sx={{
          position: "absolute",
          top: "18px",
          ...(isLeft ? { right: 0 } : { left: 0 }),
          display: "flex",
          width: "360px",
          padding: "12px 16px 16px 16px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "54px",
          borderRadius: "12px",
          background: "rgba(30, 32, 38, 0.90)",
          backdropFilter: "blur(2px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
            alignSelf: "stretch",
          }}
        >
          {/* 제목 + 복사 + 저자 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  overflow: "hidden",
                  width: "284px",
                  color: "#F7F8FA",
                  textOverflow: "ellipsis",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                {paper.title ?? paper.title_en ?? "제목 없음"}
              </Typography>
              <Box
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                sx={{
                  display: "flex",
                  width: "32px",
                  height: "32px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <ContentCopyIcon
                  sx={{ width: "20px", height: "20px", color: "#F7F8FA" }}
                />
              </Box>
            </Box>

            {/* 저자 */}
            {authors.length > 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: authors.length > 1 ? "pointer" : "default",
                  }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (authors.length > 1)
                      setIsAuthorExpanded((prev) => !prev);
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                    }}
                  >
                    {authors.length > 1
                      ? `${authors[0]} 외 ${authors.length - 1}인`
                      : authors[0]}
                  </Typography>
                  {authors.length > 1 && (
                    <IconButton
                      sx={{
                        width: "20px",
                        height: "20px",
                        padding: "5px",
                        borderRadius: "12px",
                      }}
                    >
                      {isAuthorExpanded ? (
                        <KeyboardArrowUpIcon
                          sx={{ fontSize: 10, color: "#FFF" }}
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          sx={{ fontSize: 10, color: "#FFF" }}
                        />
                      )}
                    </IconButton>
                  )}
                </Box>
                {isAuthorExpanded && (
                  <Typography
                    sx={{
                      color: "#D8DAE5",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                      mt: "4px",
                    }}
                  >
                    {authors.join(", ")}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* 저널 정보 + 배지 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "5px",
            }}
          >
            {journalInfo && (
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  color: "#D8DAE5",
                  textOverflow: "ellipsis",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                }}
              >
                {journalInfo}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {!paper.in_service ? (
                <Box
                  sx={{
                    display: "flex",
                    padding: "3px 8px 4px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "6px",
                    border: "1px solid #FFF",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                    }}
                  >
                    외부 논문
                  </Typography>
                </Box>
              ) : (
                <>
                  {paper.paper_type && (
                    <Box
                      sx={{
                        display: "flex",
                        padding: "3px 8px 4px 8px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "6px",
                        border: "1px solid #FFF",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#FFF",
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "22px",
                          letterSpacing: "-0.26px",
                        }}
                      >
                        {paper.paper_type}
                      </Typography>
                    </Box>
                  )}
                  {citationCount !== null && citationCount !== undefined && (
                    <Box
                      sx={{
                        display: "flex",
                        padding: "3px 8px 4px 8px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "6px",
                        border: "1px solid #FFF",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#FFF",
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "22px",
                          letterSpacing: "-0.26px",
                        }}
                      >
                        인용수 {citationCount}
                      </Typography>
                    </Box>
                  )}
                  {kciRegistered && (
                    <Box
                      sx={{
                        display: "flex",
                        padding: "3px 8px 4px 8px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "6px",
                        border: "1px solid #3BA502",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#3BA502",
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "22px",
                          letterSpacing: "-0.26px",
                        }}
                      >
                        KCI
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ─── MiniNodeInfo ─────────────────────────────────────────

interface MiniNodeInfoProps {
  paper: CitationPaperCard;
  isLeft: boolean;
}

const MiniNodeInfo = ({ paper, isLeft }: MiniNodeInfoProps) => {
  const authors = paper.authors ?? [];
  const journalInfo = [paper.pub_year, paper.journal_name]
    .filter(Boolean)
    .join(" · ");
  const citationCount =
    paper.trust_badge?.citation_count ?? paper.citation_count;
  const kciRegistered = paper.trust_badge?.kci ?? paper.kci_registered;

  const containerSx = isLeft
    ? {
        position: "absolute" as const,
        right: "calc(100% + 12px)",
        top: 0,
        zIndex: 10,
      }
    : {
        position: "absolute" as const,
        left: "calc(100% + 12px)",
        top: 0,
        zIndex: 10,
      };

  return (
    <Box
      sx={{
        ...containerSx,
        display: "flex",
        width: "360px",
        padding: "12px 16px 16px 16px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        borderRadius: "12px",
        background: "rgba(30, 32, 38, 0.90)",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* 제목 */}
      <Typography
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
          color: "#F7F8FA",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "-0.336px",
        }}
      >
        {paper.title ?? paper.title_en ?? "제목 없음"}
      </Typography>

      {/* 저자 */}
      {authors.length > 0 && (
        <Typography
          sx={{
            color: "#FFF",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: "-0.26px",
          }}
        >
          {authors.length > 1
            ? `${authors[0]} 외 ${authors.length - 1}인`
            : authors[0]}
        </Typography>
      )}

      {/* 저널 + 배지 */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {journalInfo && (
          <Typography
            sx={{
              color: "#D8DAE5",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: "-0.26px",
            }}
          >
            {journalInfo}
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!paper.in_service ? (
            <Box
              sx={{
                display: "flex",
                padding: "3px 8px 4px 8px",
                borderRadius: "6px",
                border: "1px solid #FFF",
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                }}
              >
                외부 논문
              </Typography>
            </Box>
          ) : (
            <>
              {paper.paper_type && (
                <Box
                  sx={{
                    display: "flex",
                    padding: "3px 8px 4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #FFF",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                    }}
                  >
                    {paper.paper_type}
                  </Typography>
                </Box>
              )}
              {citationCount !== null && citationCount !== undefined && (
                <Box
                  sx={{
                    display: "flex",
                    padding: "3px 8px 4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #FFF",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                    }}
                  >
                    인용수 {citationCount}
                  </Typography>
                </Box>
              )}
              {kciRegistered && (
                <Box
                  sx={{
                    display: "flex",
                    padding: "3px 8px 4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #3BA502",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#3BA502",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                    }}
                  >
                    KCI
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// ─── CitationNode ─────────────────────────────────────────

const CitationNode = ({ id, data }: NodeProps<CitationNodeData>) => {
  const handleExpand = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("citationExpandNode", { detail: { nodeId: id } }),
    );
  }, [id]);

  const handleViewPaper = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("citationViewPaper", { detail: { nodeId: id } }),
    );
  }, [id]);

  if (data.isCenter) {
    const isReference = data.direction === "reference";
    return (
      <>
        <Handle
          type="source"
          position={Position.Left}
          id="left"
          style={{ opacity: 0 }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{ opacity: 0 }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="target-left"
          style={{ opacity: 0 }}
        />
        <Handle
          type="target"
          position={Position.Right}
          id="target-right"
          style={{ opacity: 0 }}
        />
        <Box
          sx={{
            display: "flex",
            width: "160px",
            height: "160px",
            padding: "48px 52px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            borderRadius: "200px",
            border: "1px solid",
            borderColor: isReference ? "#3BA502" : "#029B56",
            background: isReference
              ? "linear-gradient(35deg, #EBFFE0 24.82%, #FFF 45.86%)"
              : "linear-gradient(35deg, #E6F9F0 24.82%, #FFF 45.86%)",
            boxShadow: isReference
              ? "0 0 42.7px 0 rgba(76, 231, 37, 0.32) inset"
              : "0 0 42.7px 0 rgba(53, 206, 137, 0.15) inset",
          }}
        >
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "label.normal",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            현재 논문
          </Typography>
        </Box>
      </>
    );
  }

  const getNodeStyle = () => {
    if (data.tab === "reference") {
      return { borderColor: "#3BA502", background: "#FFF" };
    }
    if (data.tier === 1) {
      return { borderColor: "#029B56", background: "#FFF" };
    }
    if (data.tier % 2 === 0) {
      return { borderColor: "#03C26C", background: "#E6F9F0" };
    }
    return { borderColor: "#03C26C", background: "#FFF" };
  };

  const { borderColor, background } = getNodeStyle();

  return (
    <Box sx={{ position: "relative" }}>
      {/* 선택 테두리 */}
      <Box
        sx={{
          display: "inline-flex",
          padding: "8px",
          borderRadius: "7px",
          border: data.isSelected
            ? `2px solid ${borderColor}`
            : "2px solid transparent",
          position: "relative",
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          id="target-left"
          style={{ opacity: 0, left: 8 }}
        />
        <Handle
          type="target"
          position={Position.Right}
          id="target-right"
          style={{ opacity: 0, right: 8 }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="source-left"
          style={{ opacity: 0, left: 8 }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="source-right"
          style={{ opacity: 0, right: 8 }}
        />

        {/* 노드 박스 */}
        <Box
          sx={{
            display: "flex",
            width: "360px",
            height: "76px",
            padding: "10px 12px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2px",
            borderRadius: "6px",
            border: "1px solid",
            borderColor,
            background,
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          {/* 저자 + 발행연도 */}
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              alignSelf: "stretch",
              color: "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            {[
              data.pubyear,
              data.authors && data.authors.length > 0
                ? data.authors.length > 1
                  ? `${data.authors[0]} 외 ${data.authors.length - 1}인`
                  : data.authors[0]
                : null,
            ]
              .filter(Boolean)
              .join(" ")}
          </Typography>
          {/* 제목 */}
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              alignSelf: "stretch",
              color: "label.normal",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "30px",
              letterSpacing: "-0.378px",
            }}
          >
            {data.title ?? data.title_en ?? "제목 없음"}
          </Typography>
        </Box>
        {/* 선택 시 툴팁 */}
        {data.isSelected &&
          data.paper &&
          (data.isMini ? (
            <MiniNodeInfo paper={data.paper} isLeft={data.isLeft} />
          ) : (
            <NodeTooltip
              paper={data.paper}
              hasMore={data.has_more}
              isExpanding={data.isExpanding}
              isLeft={data.isLeft}
              onViewPaper={handleViewPaper}
              onExpand={handleExpand}
            />
          ))}
      </Box>
    </Box>
  );
};

export default memo(CitationNode);
