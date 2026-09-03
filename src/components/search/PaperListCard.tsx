import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  type SearchPaper,
  type FeedbackType,
  type SelectionReasonState,
} from "../../types/search";
import PaperTypeBadge from "../common/PaperTypeBadge";

interface PaperListCardProps {
  paper: SearchPaper;
  isBookmarked: boolean;
  feedback?: FeedbackType;
  selectionReason?: SelectionReasonState;
  onClick: () => void;
  onBookmark: () => void;
  onFeedback: (paperId: string, feedback: FeedbackType) => void;
  onVisible: (paperId: string) => void;
}

interface SelectionReasonBoxProps {
  reasonContent: "skeleton" | "no_reason" | string | null;
  highlightStart: number | null;
  highlightEnd: number | null;
  isMobileBox: boolean;
}

const renderReasonText = (
  text: string,
  highlightStart: number | null,
  highlightEnd: number | null,
) => {
  if (
    highlightStart === null ||
    highlightEnd === null ||
    highlightStart >= highlightEnd ||
    highlightStart >= text.length
  ) {
    return <>{text}</>;
  }
  const before = text.slice(0, highlightStart);
  const highlight = text.slice(highlightStart, highlightEnd);
  const after = text.slice(highlightEnd);
  return (
    <>
      {before}
      <Box component="span" sx={{ color: "#029B56" }}>
        {highlight}
      </Box>
      {after}
    </>
  );
};
const SelectionReasonBox = ({
  reasonContent,
  highlightStart,
  highlightEnd,
  isMobileBox,
}: SelectionReasonBoxProps) => {
  if (reasonContent === null) {
    return (
      <Box
        sx={{
          display: "flex",
          padding: "10px 12px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
          borderRadius: "6px",
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            color: "label.alternative",
            textOverflow: "ellipsis",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: "-0.26px",
          }}
        >
          해당 논문은 초록을 제공하지 않아요.
        </Typography>
      </Box>
    );
  }
  if (reasonContent === "no_reason") {
    return (
      <Box
        sx={{
          display: "flex",
          padding: "10px 12px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
          borderRadius: "6px",
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            color: "label.alternative",
            textOverflow: "ellipsis",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: "-0.26px",
          }}
        >
          선정 사유를 불러오지 못했어요.
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        padding: "10px 12px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        alignSelf: "stretch",
        borderRadius: "6px",
        backgroundColor: "background.paper",
      }}
    >
      {/* 헤더 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <Box
          component="img"
          src="/ai_icon.svg"
          alt="AI"
          sx={{ width: "24px", height: "24px", flexShrink: 0 }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "label.strong",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "-0.336px",
          }}
        >
          논문 선정 사유
        </Typography>
      </Box>
      {/* 본문 */}
      {reasonContent === "skeleton" ? (
        <Skeleton
          variant="rounded"
          width="100%"
          height={isMobileBox ? 66 : 88}
        />
      ) : (
        <Typography
          sx={{
            alignSelf: "stretch",
            color: "label.alternative",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: "-0.26px",
          }}
        >
          {renderReasonText(reasonContent, highlightStart, highlightEnd)}
        </Typography>
      )}
    </Box>
  );
};

const PaperListCard = ({
  paper,
  isBookmarked,
  onClick,
  onBookmark,
  selectionReason,
  onVisible,
}: PaperListCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // 선정 이유 콘텐츠 결정
  const reasonContent = (() => {
    if (selectionReason === null) return "skeleton" as const;
    if (selectionReason === undefined) return "skeleton" as const;
    if (selectionReason.reason === null && paper.abstract === null) return null;
    if (selectionReason.reason === null) return "no_reason" as const;
    return selectionReason.reason;
  })();

  const highlightStart = selectionReason?.highlight_start ?? null;
  const highlightEnd = selectionReason?.highlight_end ?? null;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (selectionReason !== undefined) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(paper.paper_id);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [paper.paper_id, selectionReason, onVisible]);
  const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);

  const journalInfo = [paper.year, paper.journal_name]
    .filter(Boolean)
    .join(" · ");
  const authors = paper.authors.map((a) => a.name);

  if (isMobile) {
    return (
      <Box
        ref={cardRef}
        onClick={onClick}
        sx={{
          display: "flex",
          padding: "16px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "line.neutral",
          backgroundColor: "background.default",
          cursor: "pointer",
        }}
      >
        {/* 배지 + 북마크 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {paper.paper_type && (
              <PaperTypeBadge paperType={paper.paper_type} />
            )}
            {paper.credibility.citation_count !== null && (
              <Box
                sx={{
                  display: "inline-flex",
                  padding: "3px 8px 4px 8px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: "label.normal",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "label.normal",
                  }}
                >
                  인용수 {paper.credibility.citation_count}
                </Typography>
              </Box>
            )}
            {paper.credibility.kci_registered && (
              <Box
                sx={{
                  display: "inline-flex",
                  padding: "3px 8px 4px 8px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: "secondary.dark",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "secondary.dark",
                  }}
                >
                  KCI
                </Typography>
              </Box>
            )}
            {paper.credibility.sci_indexed && (
              <Box
                sx={{
                  display: "inline-flex",
                  padding: "3px 8px 4px 8px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: "secondary.dark",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "secondary.dark",
                  }}
                >
                  SCI
                </Typography>
              </Box>
            )}
          </Box>
          <IconButton
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onBookmark();
            }}
            sx={{ p: "4px" }}
          >
            {isBookmarked ? (
              <BookmarkIcon
                sx={{ width: 20, height: 20, color: "primary.dark" }}
              />
            ) : (
              <BookmarkBorderIcon
                sx={{ width: 20, height: 20, color: "label.assistive" }}
              />
            )}
          </IconButton>
        </Box>

        {/* 저널 정보 */}
        {journalInfo && (
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              color: "label.alternative",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: "-0.26px",
            }}
          >
            {journalInfo}
          </Typography>
        )}

        {/* 제목 */}
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            alignSelf: "stretch",
            color: "label.normal",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "23px",
            letterSpacing: "-0.315px",
          }}
        >
          {paper.title}
        </Typography>

        {/* 저자 */}
        <Box
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: authors.length > 1 ? "pointer" : "default",
            }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              if (authors.length > 1) setIsAuthorExpanded((prev) => !prev);
            }}
          >
            <Typography
              sx={{
                color: "#1B1C23",
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
                  p: "5px",
                  borderRadius: "12px",
                }}
              >
                {isAuthorExpanded ? (
                  <KeyboardArrowUpIcon sx={{ fontSize: 10 }} />
                ) : (
                  <KeyboardArrowDownIcon sx={{ fontSize: 10 }} />
                )}
              </IconButton>
            )}
          </Box>
          {isAuthorExpanded && (
            <Typography
              sx={{
                color: "label.assistive",
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

        <SelectionReasonBox
          reasonContent={reasonContent}
          highlightStart={highlightStart}
          highlightEnd={highlightEnd}
          isMobileBox={true}
        />

        {/* 키워드 */}
        {paper.keywords.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              flexWrap: "wrap",
              alignSelf: "stretch",
            }}
          >
            {paper.keywords.map((keyword) => (
              <Box
                key={keyword}
                sx={{
                  display: "flex",
                  padding: "3px 8px 4px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "6px",
                  backgroundColor: "background.paper",
                }}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    color: "label.normal",
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: "22px",
                    letterSpacing: "-0.26px",
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  // 데스크탑/태블릿
  return (
    <Box
      ref={cardRef}
      onClick={onClick}
      sx={{
        display: "flex",
        padding: "16px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "line.neutral",
        backgroundColor: "background.default",
        cursor: "pointer",
        "&:hover": { backgroundColor: "fill.normal" },
      }}
    >
      {/* 배지, 저널, 북마크 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "12px",
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {paper.paper_type && (
                  <PaperTypeBadge paperType={paper.paper_type} />
                )}
                {paper.credibility.citation_count !== null && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      padding: "3px 8px 4px 8px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: "label.normal",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "label.normal",
                        whiteSpace: "nowrap",
                      }}
                    >
                      인용수 {paper.credibility.citation_count}
                    </Typography>
                  </Box>
                )}
                {paper.credibility.kci_registered && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      padding: "3px 8px 4px 8px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: "secondary.dark",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "secondary.dark",
                      }}
                    >
                      KCI
                    </Typography>
                  </Box>
                )}
                {paper.credibility.sci_indexed && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      padding: "3px 8px 4px 8px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: "secondary.dark",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "secondary.dark",
                      }}
                    >
                      SCI
                    </Typography>
                  </Box>
                )}
              </Box>
              {journalInfo && (
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    color: "label.alternative",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  {journalInfo}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onBookmark();
              }}
              sx={{ display: "flex", padding: "8px", borderRadius: "8px" }}
            >
              {isBookmarked ? (
                <BookmarkIcon
                  sx={{ width: 20, height: 20, color: "primary.dark" }}
                />
              ) : (
                <BookmarkBorderIcon
                  sx={{ width: 20, height: 20, color: "label.alternative" }}
                />
              )}
            </IconButton>
          </Box>

          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              alignSelf: "stretch",
              overflow: "hidden",
              color: "label.normal",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "30px",
              letterSpacing: "-0.42px",
            }}
          >
            {paper.title}
          </Typography>
        </Box>

        <Box
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: authors.length > 1 ? "pointer" : "default",
            }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              if (authors.length > 1) setIsAuthorExpanded((prev) => !prev);
            }}
          >
            <Typography
              sx={{
                color: "#1B1C23",
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
                  p: "5px",
                  borderRadius: "12px",
                }}
              >
                {isAuthorExpanded ? (
                  <KeyboardArrowUpIcon sx={{ fontSize: 10 }} />
                ) : (
                  <KeyboardArrowDownIcon sx={{ fontSize: 10 }} />
                )}
              </IconButton>
            )}
          </Box>
          {isAuthorExpanded && (
            <Typography
              sx={{
                color: "label.assistive",
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
      </Box>

      <SelectionReasonBox
        reasonContent={reasonContent}
        highlightStart={highlightStart}
        highlightEnd={highlightEnd}
        isMobileBox={false}
      />

      {paper.keywords.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {paper.keywords.map((keyword) => (
              <Box
                key={keyword}
                sx={{
                  display: "flex",
                  padding: "3px 8px 4px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "6px",
                  backgroundColor: "background.paper",
                }}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    color: "label.normal",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaperListCard;
