import { useEffect } from "react";
import { Box } from "@mui/material";
import { ReactFlowProvider } from "reactflow";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopNavBar from "../components/layout/TopNavBar";
import KeywordMapGraph from "../components/keyword-map/KeywordMapGraph";
import PaperListPanel from "../components/keyword-map/PaperListPanel";
import {
  useKeywordMapActions,
  useBreadcrumbs,
} from "../stores/keywordMapStore";

const KeywordMapPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const breadcrumbs = useBreadcrumbs();
  const { reset } = useKeywordMapActions();

  useEffect(() => {
    if (!keyword) {
      navigate("/home", { replace: true });
    }
  }, [keyword, navigate]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBreadcrumbClick = (nodeKey: string) => {
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
      <TopNavBar
        onBack={handleBack}
        keywordMapConfig={{
          breadcrumbs,
          onBreadcrumbClick: handleBreadcrumbClick,
        }}
      />
      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          mt: "76px",
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
