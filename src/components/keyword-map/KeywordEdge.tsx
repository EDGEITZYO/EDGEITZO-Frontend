import {
  type EdgeProps,
  getSmoothStepPath,
  Position,
  EdgeLabelRenderer,
} from "reactflow";
import { Box, Typography } from "@mui/material";
import { type EdgeAxisLabel } from "../../types/keywordMap";

interface KeywordEdgeData {
  axisLabel: EdgeAxisLabel | null;
}

const handleToPosition = (handle: string | null | undefined): Position => {
  switch (handle) {
    case "top":
      return Position.Top;
    case "bottom":
      return Position.Bottom;
    case "left":
      return Position.Left;
    case "right":
      return Position.Right;
    default:
      return Position.Right;
  }
};

const KeywordEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceHandleId,
  targetHandleId,
  data,
}: EdgeProps<KeywordEdgeData>) => {
  const sourcePosition = handleToPosition(sourceHandleId);
  const targetPosition = handleToPosition(
    targetHandleId?.replace("-target", ""),
  );

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  return (
    <>
      <path id={id} d={edgePath} stroke="#000000" strokeWidth={1} fill="none" />

      {/* 🌟 foreignObject 대신 EdgeLabelRenderer를 사용합니다 */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            // labelX, labelY 위치로 이동시킨 뒤 가운데 정렬합니다.
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            // 라벨 위에서 스크롤/드래그 등의 이벤트가 캔버스로 통과되도록 설정 (옵션)
            pointerEvents: "none",
            // zIndex를 높여 모든 엣지 선(SVG)보다 항상 위에 오도록 만듭니다.
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                px: "9px",
                py: "6px",
                border: "1px solid",
                borderColor: "static.black",
                borderRadius: "7px",
                // 💡 이 배경색 덕분에 라벨 뒤로 지나가는 선이 완벽하게 가려집니다.
                backgroundColor: "background.paper",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "static.black",
                  whiteSpace: "nowrap",
                }}
              >
                {data?.axisLabel}
              </Typography>
            </Box>
          </Box>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default KeywordEdge;
