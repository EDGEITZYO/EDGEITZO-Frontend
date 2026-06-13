import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useKeywordMapStore, {
  useKeywordMapActions,
  useSelectedPaperId,
  usePaperPanel,
} from "../../stores/keywordMapStore";
import PaperDetailContent from "../common/PaperDetailContent";

interface PaperDetailPanelProps {
  onClose: () => void;
}

const PaperDetailPanel = ({ onClose }: PaperDetailPanelProps) => {
  const selectedPaperId = useSelectedPaperId();
  const { panelKeyword } = usePaperPanel();
  const { selectPaper } = useKeywordMapActions();
  const searchId = useKeywordMapStore((state) => state.searchId) ?? undefined;

  if (!selectedPaperId) return null;

  const handleClose = () => {
    selectPaper(null);
    onClose();
  };

  const handleRelatedPaperClick = (paperId: string) => {
    selectPaper(paperId);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        right: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        borderRadius: "11px 0 0 11px",
        boxShadow: "0 0 9px 0 rgba(0, 0, 0, 0.29)",
        zIndex: 11,
        overflowY: "auto",
      }}
    >
      {/* 패널 헤더 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 10px 10px 25px",
          borderBottom: "1px solid",
          borderColor: "line.normal",
          backgroundColor: "background.paper",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: 600,
            color: "label.strong",
            letterSpacing: "-0.34px",
          }}
        >
          {panelKeyword ?? "검색 결과"}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: "24px", color: "label.strong" }} />
        </IconButton>
      </Box>

      {/* 콘텐츠 */}
      <Box sx={{ padding: "0 31px 40px 31px" }}>
        <PaperDetailContent
          paperId={selectedPaperId}
          searchId={searchId}
          onRelatedPaperClick={handleRelatedPaperClick}
        />
      </Box>
    </Box>
  );
};

export default PaperDetailPanel;
