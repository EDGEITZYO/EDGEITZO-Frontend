import { useEffect } from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@mui/material/styles";
import { ReactFlowProvider } from "reactflow";
import { useNavigate, useSearchParams } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import TopNavBar from "../components/layout/TopNavBar";
import KeywordMapGraph from "../components/keyword-map/KeywordMapGraph";
import PaperListPanel from "../components/keyword-map/PaperListPanel";
import {
  useKeywordMapActions,
  useBreadcrumbs,
  usePaperPanel,
} from "../stores/keywordMapStore";
import { homeKeys } from "../queries/keys";

const KeywordMapPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const breadcrumbs = useBreadcrumbs();
  const { isPaperPanelOpen } = usePaperPanel();
  const { reset, closePaperPanel, popBreadcrumbTo } = useKeywordMapActions();

  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      reset();
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
    };
  }, [reset, queryClient]);

  useEffect(() => {
    if (!keyword) {
      navigate("/home", { replace: true });
    }
  }, [keyword, navigate]);

  const handleBack = () => {
    if (isMobile && isPaperPanelOpen) {
      closePaperPanel();
      return;
    }
    navigate(-1);
  };

  const handleBreadcrumbClick = (nodeKey: string) => {
    popBreadcrumbTo(nodeKey);
    window.dispatchEvent(
      new CustomEvent("recenterNode", { detail: { nodeKey } }),
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#EDEFF5",
      }}
    >
      {/* 데스크탑/태블릿 TopNavBar */}
      {!isMobile && (
        <TopNavBar
          onBack={handleBack}
          keywordMapConfig={{
            breadcrumbs,
            onBreadcrumbClick: handleBreadcrumbClick,
          }}
        />
      )}

      {/* 모바일 헤더 */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            padding: "16px",
            alignItems: "center",
            gap: "8px",
            alignSelf: "stretch",
            backgroundColor: "#ffffff",
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{ p: 0, width: "28px", height: "28px", flexShrink: 0 }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 16, color: "label.normal" }} />
          </IconButton>
          {breadcrumbs.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  padding: "3px 8px 3px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "6px",
                  backgroundColor: "#EDFAE6",
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    color: "#3BA502",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  키워드
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  overflow: "hidden",
                }}
              >
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <Box
                      key={crumb.nodeKey}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        flexShrink: 0,
                      }}
                    >
                      {index > 0 && (
                        <Box
                          sx={{
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: "4px",
                              height: "4px",
                              borderRadius: "4px",
                              backgroundColor: "label.normal",
                            }}
                          />
                        </Box>
                      )}
                      <Typography
                        onClick={
                          !isLast
                            ? () => handleBreadcrumbClick(crumb.nodeKey)
                            : undefined
                        }
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: isLast ? "#3BA502" : "label.normal",
                          fontSize: "20px",
                          fontWeight: 600,
                          lineHeight: "30px",
                          letterSpacing: "-0.42px",
                          cursor: isLast ? "default" : "pointer",
                          flexShrink: 0,
                        }}
                      >
                        {crumb.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* 그래프 영역 */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          mt: isMobile ? 0 : "76px",
          backgroundColor: "#EDEFF5",
        }}
      >
        <ReactFlowProvider>
          <KeywordMapGraph keyword={keyword} />
        </ReactFlowProvider>
        <PaperListPanel />
      </Box>
    </Box>
  );
};

export default KeywordMapPage;
