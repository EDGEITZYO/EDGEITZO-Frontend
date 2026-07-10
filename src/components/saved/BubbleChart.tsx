import { useMemo, useRef } from "react";
import { Box } from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { type RecentPaperChartItem } from "../../types/saved";

// ─── 타입 ─────────────────────────────────────────────────

interface BubbleChartProps {
  papers: RecentPaperChartItem[];
  selectedPaperIds: string[] | null;
  onDotClick: (paperIds: string[]) => void;
  onBackgroundClick: () => void;
}

interface ChartDot {
  x: number;
  y: number;
  paperIds: string[];
  isCluster: boolean;
  clusterCount: number;
}

// ─── 상수 ─────────────────────────────────────────────────

const DOT_RADIUS = 16;
const DOT_COLOR = "#92E268";
const DOT_CLUSTER_COLOR = "#03C26C";
const DOT_SELECTED_COLOR = "#029B56";
const DOT_DIMMED_COLOR = "#D1D5DB";

// ─── 클러스터링 로직 ──────────────────────────────────────

const clusterPapers = (papers: RecentPaperChartItem[]): ChartDot[] => {
  const dots: ChartDot[] = [];
  const used = new Set<string>();

  papers.forEach((paper) => {
    if (used.has(paper.paper_id)) return;

    const nearby = papers.filter((other) => {
      if (used.has(other.paper_id)) return false;
      const sameYear = paper.published_year === other.published_year;
      const citationDiff = Math.abs(
        (paper.citation_count ?? 0) - (other.citation_count ?? 0),
      );
      return sameYear && citationDiff <= 3;
    });

    nearby.forEach((p) => used.add(p.paper_id));
    dots.push({
      x: paper.published_year,
      y: paper.citation_count ?? 0,
      paperIds: nearby.map((p) => p.paper_id),
      isCluster: nearby.length > 1,
      clusterCount: nearby.length,
    });
  });

  return dots;
};

// ─── 커스텀 점 렌더러 ─────────────────────────────────────

const CustomDot = (props: {
  cx?: number;
  cy?: number;
  payload?: ChartDot;
  selectedPaperIds: string[] | null;
  onClick: (paperIds: string[]) => void;
}) => {
  const { cx = 0, cy = 0, payload, selectedPaperIds, onClick } = props;
  if (!payload) return null;

  const isSelected = selectedPaperIds
    ? payload.paperIds.some((id) => selectedPaperIds.includes(id))
    : false;
  const isDimmed = selectedPaperIds !== null && !isSelected;
  const radius = payload.isCluster
    ? Math.min(DOT_RADIUS * 2 + payload.clusterCount * 3, 60)
    : DOT_RADIUS;
  const color = isDimmed
    ? DOT_DIMMED_COLOR
    : isSelected
      ? DOT_SELECTED_COLOR
      : payload.isCluster
        ? DOT_CLUSTER_COLOR
        : DOT_COLOR;

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onClick(payload.paperIds);
      }}
      style={{ cursor: "pointer" }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        stroke={isSelected ? DOT_SELECTED_COLOR : "none"}
        strokeWidth={isSelected ? 2 : 0}
      />
      {payload.isCluster && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize={24}
          fontWeight={600}
        >
          +{payload.clusterCount}
        </text>
      )}
    </g>
  );
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const BubbleChart = ({
  papers,
  selectedPaperIds,
  onDotClick,
  onBackgroundClick,
}: BubbleChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dots = useMemo(() => clusterPapers(papers), [papers]);

  const chartContent = (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        "& .recharts-zIndex-layer": { outline: "none" },
        "& *:focus": { outline: "none" },
      }}
      onClick={onBackgroundClick}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <ScatterChart margin={{ top: 85, right: 85, bottom: 85, left: 85 }}>
          <XAxis
            dataKey="x"
            hide
            type="number"
            domain={["dataMin", "dataMax"]}
          />
          <YAxis
            dataKey="y"
            hide
            type="number"
            domain={["dataMin", "dataMax"]}
          />
          <Tooltip content={() => null} cursor={false} />
          <Scatter
            data={dots}
            shape={(props: unknown) => (
              <CustomDot
                {...(props as { cx?: number; cy?: number; payload?: ChartDot })}
                selectedPaperIds={selectedPaperIds}
                onClick={onDotClick}
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );

  return chartContent;
};

export default BubbleChart;
