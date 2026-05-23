import { memo } from "react";
import { type NodeProps, Handle, Position } from "reactflow";
import { Box, Typography } from "@mui/material";
import { type KeywordNodeData } from "../../types/keywordMap";

const KeywordNode = memo(({ data, selected }: NodeProps<KeywordNodeData>) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {/* 단계 표시 */}
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 400,
          color: "label.alternative",
        }}
      >
        {data.depth}st
      </Typography>

      {/* 노드 박스 */}
      <Box
        sx={{
          px: "9px",
          py: "6px",
          border: selected ? "2px solid" : "1px solid",
          borderColor: selected ? "primary.main" : "static.black",
          borderRadius: "7px",
          backgroundColor: "transparent",
          cursor: "pointer",
          minWidth: "60px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Handle
          type="source"
          position={Position.Top}
          id="top"
          style={{ opacity: 0 }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{ opacity: 0 }}
        />
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
          position={Position.Top}
          id="top-target"
          style={{ opacity: 0 }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id="bottom-target"
          style={{ opacity: 0 }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left-target"
          style={{ opacity: 0 }}
        />
        <Handle
          type="target"
          position={Position.Right}
          id="right-target"
          style={{ opacity: 0 }}
        />
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: 600,
            color: "static.black",
            lineHeight: "29px",
            letterSpacing: "-0.34px",
            whiteSpace: "nowrap",
          }}
        >
          {data.label}
        </Typography>
      </Box>
    </Box>
  );
});

KeywordNode.displayName = "KeywordNode";

export default KeywordNode;
