import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Box, Typography } from "@mui/material";
import type { CitationDirection } from "../../types/citation";

export interface CitationNodeData {
  title: string | null;
  title_en: string | null;
  pubyear: number | null;
  in_service: boolean;
  has_more: boolean;
  direction: CitationDirection;
  isCenter: boolean;
  isSelected: boolean;
}

const CitationNode = ({ data }: NodeProps<CitationNodeData>) => {
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
            }}
          >
            현재 논문
          </Typography>
        </Box>
      </>
    );
  }

  const isReference = data.direction === "reference";
  const borderColor = isReference ? "#3BA502" : "#029B56";

  return (
    <>
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
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        style={{ opacity: 0 }}
      />
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
          border: data.isSelected ? "2px solid" : "1px solid",
          borderColor: borderColor,
          outline: data.isSelected ? `2px solid ${borderColor}` : "none",
          outlineOffset: "2px",
          background: "#FFF",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
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
          {data.pubyear ?? ""}
        </Typography>
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
    </>
  );
};

export default memo(CitationNode);
