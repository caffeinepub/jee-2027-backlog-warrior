import { Test } from '../hooks/useTests';

interface TestScoreChartProps {
  test: Test;
}

export function TestScoreChart({ test }: TestScoreChartProps) {
  if (test.scores.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No scores recorded yet
      </div>
    );
  }

  const chartType = test.chartType || 'line';
  const accentColor = test.chartColor || '#8b5cf6';

  // Calculate dimensions with better mobile support
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 80, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find max score for scaling
  const maxScore = test.totalMarks;
  const scores = test.scores;

  // Scale functions
  const xScale = (index: number) => {
    return (index / Math.max(scores.length - 1, 1)) * chartWidth;
  };

  const yScale = (score: number) => {
    return chartHeight - (score / maxScore) * chartHeight;
  };

  // Generate path for line chart
  const linePath = scores
    .map((s, i) => {
      const x = xScale(i);
      const y = yScale(s.score);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: '320px', maxHeight: '400px' }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const y = chartHeight * (1 - tick);
          const scoreValue = maxScore * tick;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={padding.top + y}
                x2={padding.left + chartWidth}
                y2={padding.top + y}
                className="stroke-border/50"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 10}
                y={padding.top + y}
                textAnchor="end"
                className="text-[14px] fill-muted-foreground font-medium"
                dominantBaseline="middle"
              >
                {scoreValue.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Chart content */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {chartType === 'line' ? (
            <>
              {/* Line path */}
              <path
                d={linePath}
                fill="none"
                stroke={accentColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              {scores.map((s, i) => (
                <circle
                  key={s.id}
                  cx={xScale(i)}
                  cy={yScale(s.score)}
                  r="6"
                  fill={accentColor}
                  className="stroke-background"
                  strokeWidth="2"
                >
                  <title>{`Attempt ${i + 1}: ${s.score}/${maxScore} (${((s.score / maxScore) * 100).toFixed(1)}%)`}</title>
                </circle>
              ))}
            </>
          ) : (
            /* Bar chart */
            scores.map((s, i) => {
              const barWidth = Math.max(chartWidth / scores.length - 8, 20);
              const x = xScale(i) - barWidth / 2;
              const y = yScale(s.score);
              const barHeight = chartHeight - y;
              return (
                <rect
                  key={s.id}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={accentColor}
                  opacity="0.85"
                  rx="4"
                >
                  <title>{`Attempt ${i + 1}: ${s.score}/${maxScore} (${((s.score / maxScore) * 100).toFixed(1)}%)`}</title>
                </rect>
              );
            })
          )}
        </g>

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          className="stroke-border"
          strokeWidth="2"
        />

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          className="stroke-border"
          strokeWidth="2"
        />

        {/* X-axis labels */}
        {scores.map((s, i) => {
          if (scores.length > 15 && i % 2 !== 0) return null;
          return (
            <text
              key={s.id}
              x={padding.left + xScale(i)}
              y={padding.top + chartHeight + 25}
              textAnchor="middle"
              className="text-[14px] fill-muted-foreground font-medium"
            >
              {i + 1}
            </text>
          );
        })}

        {/* Axis labels */}
        <text
          x={padding.left + chartWidth / 2}
          y={height - 20}
          textAnchor="middle"
          className="text-[16px] fill-foreground font-semibold"
        >
          Attempt Number
        </text>

        <text
          x={25}
          y={padding.top + chartHeight / 2}
          textAnchor="middle"
          className="text-[16px] fill-foreground font-semibold"
          transform={`rotate(-90, 25, ${padding.top + chartHeight / 2})`}
        >
          Score
        </text>
      </svg>
    </div>
  );
}
