import { Box, Typography, Button } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { type KeywordNodeData } from "../../types/keywordMap";

interface NodeTooltipProps {
  nodeId: string;
  data: KeywordNodeData;
  onSearchKeyword: (keyword: string) => void;
  onExpandNode: (nodeId: string) => void;
}

const tooltipSx: SxProps<Theme> = {
  width: "285px",
  borderRadius: "7px",
  padding: "11px 8px",
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  backgroundColor: "background.default",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
};

const actionButtonSx: SxProps<Theme> = {
  width: "100%",
  height: "53px",
  borderRadius: "7px",
  backgroundColor: "background.paper",
  color: "label.neutral",
  fontSize: "17px",
  fontWeight: 600,
  letterSpacing: "-0.34px",
  boxShadow: "none",
  border: "1px solid",
  borderColor: "line.neutral",
  "&:hover": {
    backgroundColor: "fill.normal",
    boxShadow: "none",
  },
};

const NodeTooltip = ({
  nodeId,
  data,
  onSearchKeyword,
  onExpandNode,
}: NodeTooltipProps) => {
  const canExpand = !data.isExpanded && data.depth < 4;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.label);
  };

  return (
    <Box sx={tooltipSx}>
      {/* 제목 + 복사 버튼 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 12px",
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontSize: "18px",
            fontWeight: 600,
            color: "label.strong",
            letterSpacing: "-0.36px",
          }}
        >
          {data.label}
        </Typography>
        <ContentCopyIcon
          onClick={handleCopy}
          sx={{
            fontSize: "20px",
            color: "label.alternative",
            cursor: "pointer",
            "&:hover": { color: "label.normal" },
          }}
        />
      </Box>

      {/* 구분선 */}
      <Box
        sx={{
          width: "100%",
          height: "1px",
          backgroundColor: "line.normal",
        }}
      />

      {/* 설명 */}
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 400,
          color: "label.strong",
          lineHeight: "26px",
          letterSpacing: "-0.32px",
          padding: "0 12px",
        }}
      >
        {data.definition ?? "키워드 설명이 없어요."}
      </Typography>

      {/* 버튼 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "7px",
          mt: "4px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => onSearchKeyword(data.label)}
          sx={actionButtonSx}
        >
          해당 키워드로 검색하기
        </Button>
        {canExpand && (
          <Button
            variant="contained"
            onClick={() => onExpandNode(nodeId)}
            sx={actionButtonSx}
          >
            하위 키워드 생성
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NodeTooltip;
