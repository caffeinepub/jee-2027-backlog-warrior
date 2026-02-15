import { Test } from '../hooks/useTests';

interface TestScoreChartProps {
  test: Test;
}

export function TestScoreChart({ test }: TestScoreChartProps) {
  if (test.scores.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No scores to display
      </div>
    );
  }

  const maxScore = test.totalMarks;
  const chartHeight = 200;
  const chartWidth = 100; // percentage
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  
  // Sort scores by timestamp
  const sortedScores = [...test.scores].sort((a, b) => a.timestamp - b.timestamp);
  
  const dataPoints = sortedScores.map((score, index) => ({
    x: index,
    y: score.score,
    label: `#${index + 1}`,
  }));

  const xStep = (chartWidth - padding.left - padding.right) / Math.max(dataPoints.length - 1, 1);
  const yScale = (chartHeight - padding.top - padding.bottom) / maxScore;

  const getX = (index: number) => padding.left + index * xStep;
  const getY = (score: number) => chartHeight - padding.bottom - score * yScale;

  // Generate path for line chart
  const linePath = dataPoints
    .map((point, i) => {
      const x = getX(point.x);
      const y = getY(point.y);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        style={{ minWidth: '300px' }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = chartHeight - padding.bottom - maxScore * fraction * yScale;
          return (
            <g key={fraction}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
                strokeDasharray="2,2"
              />
              <text
                x={padding.left - 5}
                y={y + 3}
                textAnchor="end"
                fontSize="8"
                className="fill-muted-foreground"
              >
                {Math.round(maxScore * fraction)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {dataPoints.map((point) => {
          const x = getX(point.x);
          return (
            <text
              key={point.x}
              x={x}
              y={chartHeight - padding.bottom + 15}
              textAnchor="middle"
              fontSize="8"
              className="fill-muted-foreground"
            >
              {point.label}
            </text>
          );
        })}

        {/* Chart content */}
        {test.chartType === 'line' ? (
          <>
            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke={test.chartColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Points */}
            {dataPoints.map((point) => {
              const x = getX(point.x);
              const y = getY(point.y);
              return (
                <g key={point.x}>
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill={test.chartColor}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    className="fill-foreground"
                  >
                    {point.y}
                  </text>
                </g>
              );
            })}
          </>
        ) : (
          <>
            {/* Bars */}
            {dataPoints.map((point) => {
              const x = getX(point.x);
              const y = getY(point.y);
              const barWidth = Math.min(xStep * 0.6, 8);
              const barHeight = chartHeight - padding.bottom - y;
              return (
                <g key={point.x}>
                  <rect
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={test.chartColor}
                    rx="1"
                  />
                  <text
                    x={x}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    className="fill-foreground"
                  >
                    {point.y}
                  </text>
                </g>
              );
            })}
          </>
        )}

        {/* Axes */}
        <line
          x1={padding.left}
          y1={chartHeight - padding.bottom}
          x2={chartWidth - padding.right}
          y2={chartHeight - padding.bottom}
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={chartHeight - padding.bottom}
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
        />

        {/* Axis labels */}
        <text
          x={chartWidth / 2}
          y={chartHeight - 5}
          textAnchor="middle"
          fontSize="10"
          fontWeight="500"
          className="fill-muted-foreground"
        >
          Attempts
        </text>
        <text
          x={10}
          y={chartHeight / 2}
          textAnchor="middle"
          fontSize="10"
          fontWeight="500"
          className="fill-muted-foreground"
          transform={`rotate(-90, 10, ${chartHeight / 2})`}
        >
          Score
        </text>
      </svg>
    </div>
  );
}
