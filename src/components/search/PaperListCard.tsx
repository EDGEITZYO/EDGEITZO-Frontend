import { useState } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SearchPaper, type FeedbackType } from "../../types/search";
import PaperTypeBadge from "../common/PaperTypeBadge";

interface PaperListCardProps {
  paper: SearchPaper;
  isBookmarked: boolean;
  feedback?: FeedbackType;
  onClick: () => void;
  onBookmark: () => void;
  onFeedback: (paperId: string, feedback: FeedbackType) => void;
}

const PaperListCard = ({
  paper,
  isBookmarked,
  onClick,
  onBookmark,
}: PaperListCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);

  const journalInfo = [paper.year, paper.journal_name]
    .filter(Boolean)
    .join(" · ");
  const authors = paper.authors.map((a) => a.name);

  if (isMobile) {
    return (
      <Box
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

        {/* 초록 */}
        {paper.abstract && (
          <Box
            sx={{
              display: "flex",
              padding: "8px 10px",
              flexDirection: "column",
              alignSelf: "stretch",
              borderRadius: "6px",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                color: "label.alternative",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: "-0.26px",
              }}
            >
              {paper.abstract}
            </Typography>
          </Box>
        )}

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

      {paper.abstract && (
        <Box
          sx={{
            display: "flex",
            padding: "10px 12px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2px",
            alignSelf: "stretch",
            borderRadius: "6px",
            backgroundColor: "background.paper",
          }}
        >
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 5,
              alignSelf: "stretch",
              overflow: "hidden",
              color: "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "27px",
              letterSpacing: "-0.336px",
            }}
          >
            {paper.abstract}
          </Typography>
        </Box>
      )}

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
