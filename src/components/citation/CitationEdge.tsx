import { type EdgeProps, getSmoothStepPath } from "reactflow";

const CitationEdge = ({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
  markerStart,
  style,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  return (
    <path
      id={id}
      d={edgePath}
      stroke={style?.stroke ?? "#3BA502"}
      strokeWidth={style?.strokeWidth ?? 1}
      fill="none"
      markerEnd={markerEnd}
      markerStart={markerStart}
    />
  );
};

export default CitationEdge;
