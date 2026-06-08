import { useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
// TODO: [이슈 B] API 연동 시 MockRecentPaper → RecentPaper로 교체
import { type MockRecentPaper } from "./RecentPaperListView";

// ─── 타입 ─────────────────────────────────────────────────

interface BubbleChartProps {
  variant: "normal" | "fullscreen";
  papers: MockRecentPaper[]; // 변경
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

const CLUSTER_THRESHOLD = 40;
const DOT_RADIUS = 12;
const CLUSTER_RADIUS = 20;
const DOT_COLOR = "#6B7280";
const DOT_SELECTED_COLOR = "#31333F";
const DOT_DIMMED_COLOR = "#D1D5DB";

// ─── 클러스터링 로직 ──────────────────────────────────────

const clusterPapers = (
  papers: MockRecentPaper[],
  width: number,
  height: number,
): ChartDot[] => {
  const maxYear = Math.max(...papers.map((p) => p.publishYear));
  const minYear = Math.min(...papers.map((p) => p.publishYear));
  const maxCitation = Math.max(...papers.map((p) => p.citationForChart));

  const toPixel = (paper: MockRecentPaper) => ({
    px: ((paper.publishYear - minYear) / (maxYear - minYear || 1)) * width,
    py: (1 - paper.citationForChart / (maxCitation || 1)) * height,
  });

  const dots: ChartDot[] = [];
  const used = new Set<string>();

  papers.forEach((paper) => {
    if (used.has(paper.id)) return;
    const { px, py } = toPixel(paper);
    const nearby = papers.filter((other) => {
      if (used.has(other.id)) return false;
      const { px: ox, py: oy } = toPixel(other);
      return Math.sqrt((px - ox) ** 2 + (py - oy) ** 2) < CLUSTER_THRESHOLD;
    });
    nearby.forEach((p) => used.add(p.id));
    dots.push({
      x: paper.publishYear,
      y: paper.citationForChart,
      paperIds: nearby.map((p) => p.id),
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
  const radius = payload.isCluster ? CLUSTER_RADIUS : DOT_RADIUS;
  const color = isDimmed
    ? DOT_DIMMED_COLOR
    : isSelected
      ? DOT_SELECTED_COLOR
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
          fontSize={12}
          fontWeight={600}
        >
          +{payload.clusterCount}
        </text>
      )}
    </g>
  );
};

// ─── 축 오버레이 (normal variant) ────────────────────────

const NormalAxisOverlay = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => (
  <svg
    style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    width={width}
    height={height}
  >
    <defs>
      <marker
        id="arrowhead"
        markerWidth="6"
        markerHeight="4"
        refX="6"
        refY="2"
        orient="auto"
      >
        <polygon points="0 0, 6 2, 0 4" fill="#9CA3AF" />
      </marker>
    </defs>
    {/* X축 */}
    <line
      x1={0}
      y1={height / 2}
      x2={width}
      y2={height / 2}
      stroke="#9CA3AF"
      strokeWidth={1}
      markerEnd="url(#arrowhead)"
    />
    {/* Y축 */}
    <line
      x1={width / 2}
      y1={height}
      x2={width / 2}
      y2={0}
      stroke="#9CA3AF"
      strokeWidth={1}
      markerEnd="url(#arrowhead)"
    />
    {/* 라벨 */}
    <text x={8} y={height / 2 - 8} fill="#9CA3AF" fontSize={12}>
      오래된 논문
    </text>
    <text x={width - 60} y={height / 2 - 8} fill="#9CA3AF" fontSize={12}>
      최신 논문
    </text>
    <text x={width / 2 + 8} y={16} fill="#9CA3AF" fontSize={12}>
      인용 높음
    </text>
    <text x={width / 2 + 8} y={height - 8} fill="#9CA3AF" fontSize={12}>
      인용 낮음
    </text>
  </svg>
);

const FullscreenAxisOverlay = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const cx = margin.left + innerWidth / 2;
  const cy = margin.top + innerHeight / 2;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
      width={width}
      height={height}
    >
      {/* X축 — 단순 선 */}
      <line
        x1={margin.left}
        y1={cy}
        x2={width - margin.right}
        y2={cy}
        stroke="#9CA3AF"
        strokeWidth={1}
      />
      {/* Y축 — 단순 선 */}
      <line
        x1={cx}
        y1={margin.top}
        x2={cx}
        y2={height - margin.bottom}
        stroke="#9CA3AF"
        strokeWidth={1}
      />
    </svg>
  );
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const BubbleChart = ({
  variant,
  papers,
  selectedPaperIds,
  onDotClick,
  onBackgroundClick,
}: BubbleChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 600, height: 400 });

  const dots = useMemo(
    () => clusterPapers(papers, chartSize.width, chartSize.height),
    [papers, chartSize],
  );

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
      {variant === "fullscreen" && (
        <FullscreenAxisOverlay
          width={chartSize.width}
          height={chartSize.height}
        />
      )}
      <ResponsiveContainer
        width="100%"
        height="100%"
        onResize={(w, h) => setChartSize({ width: w, height: h })}
      >
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="x" hide />
          <YAxis dataKey="y" hide />
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
      {variant === "normal" && (
        <NormalAxisOverlay width={chartSize.width} height={chartSize.height} />
      )}
    </Box>
  );

  if (variant === "fullscreen") {
    return chartContent;
  }

  return chartContent;
};

export default BubbleChart;
