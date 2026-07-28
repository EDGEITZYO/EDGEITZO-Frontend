import { type EdgeProps, getSmoothStepPath, Position } from "reactflow";

const KeywordEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Right,
    targetX,
    targetY,
    targetPosition: Position.Left,
    borderRadius: 8,
  });

  return (
    <path id={id} d={edgePath} stroke="#D8DAE5" strokeWidth={1} fill="none" />
  );
};

export default KeywordEdge;
