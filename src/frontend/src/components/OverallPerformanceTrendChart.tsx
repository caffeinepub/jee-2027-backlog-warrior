import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TestScore {
  id: string;
  score: number;
  timestamp: number;
}

interface Test {
  id: string;
  label: string;
  totalMarks: number;
  scores: TestScore[];
}

interface OverallPerformanceTrendChartProps {
  tests: Test[];
}

interface AggregatedScore {
  timestamp: number;
  percentage: number;
  testLabel: string;
}

export function OverallPerformanceTrendChart({ tests }: OverallPerformanceTrendChartProps) {
  const aggregatedData = useMemo(() => {
    const allScores: AggregatedScore[] = [];
    
    tests.forEach(test => {
      test.scores.forEach(score => {
        allScores.push({
          timestamp: score.timestamp,
          percentage: (score.score / test.totalMarks) * 100,
          testLabel: test.label,
        });
      });
    });
    
    // Sort by timestamp
    return allScores.sort((a, b) => a.timestamp - b.timestamp);
  }, [tests]);

  const trendAnalysis = useMemo(() => {
    if (aggregatedData.length < 2) {
      return { trend: 'flat', label: 'Not Enough Data', color: 'text-muted-foreground' };
    }

    // Calculate linear regression slope
    const n = aggregatedData.length;
    const sumX = aggregatedData.reduce((sum, _, i) => sum + i, 0);
    const sumY = aggregatedData.reduce((sum, d) => sum + d.percentage, 0);
    const sumXY = aggregatedData.reduce((sum, d, i) => sum + i * d.percentage, 0);
    const sumX2 = aggregatedData.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Determine trend based on slope
    if (slope > 1) {
      return { trend: 'improving', label: 'Trend: Improving', color: 'text-green-600 dark:text-green-400' };
    } else if (slope < -1) {
      return { trend: 'declining', label: 'Trend: Declining', color: 'text-red-600 dark:text-red-400' };
    } else {
      return { trend: 'flat', label: 'Trend: Stable', color: 'text-blue-600 dark:text-blue-400' };
    }
  }, [aggregatedData]);

  const averagePercentage = useMemo(() => {
    if (aggregatedData.length === 0) return 0;
    const sum = aggregatedData.reduce((acc, d) => acc + d.percentage, 0);
    return sum / aggregatedData.length;
  }, [aggregatedData]);

  if (aggregatedData.length === 0) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Overall Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-base font-medium">No test scores recorded yet.</p>
            <p className="text-sm mt-2">Add scores to see your performance trend.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate chart dimensions
  const width = 900;
  const height = 450;
  const padding = { top: 50, right: 50, bottom: 90, left: 90 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index: number) => {
    return (index / (aggregatedData.length - 1)) * chartWidth;
  };

  const yScale = (percentage: number) => {
    return chartHeight - (percentage / 100) * chartHeight;
  };

  // Generate path for line chart
  const linePath = aggregatedData
    .map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.percentage);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  const TrendIcon = trendAnalysis.trend === 'improving' ? TrendingUp : trendAnalysis.trend === 'declining' ? TrendingDown : Minus;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Overall Performance Trend
          </CardTitle>
          <div className={`flex items-center gap-2 font-semibold text-base ${trendAnalysis.color}`}>
            <TrendIcon className="h-5 w-5" />
            {trendAnalysis.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center border">
            <div className="text-3xl font-bold text-primary">{aggregatedData.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Attempts</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center border">
            <div className="text-3xl font-bold text-primary">{averagePercentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground mt-1">Average Score</div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
            style={{ minWidth: '320px', maxHeight: '450px' }}
          >
            {/* Grid lines and Y-axis labels */}
            {[0, 25, 50, 75, 100].map(tick => (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={padding.top + yScale(tick)}
                  x2={padding.left + chartWidth}
                  y2={padding.top + yScale(tick)}
                  className="stroke-border/50"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 15}
                  y={padding.top + yScale(tick)}
                  textAnchor="end"
                  className="text-[14px] fill-muted-foreground font-medium"
                  dominantBaseline="middle"
                >
                  {tick}%
                </text>
              </g>
            ))}

            {/* Line path with gradient */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="stop-color-primary" stopOpacity="0.8" />
                <stop offset="100%" className="stop-color-primary" stopOpacity="1" />
              </linearGradient>
            </defs>

            <path
              d={linePath}
              fill="none"
              className="stroke-primary"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${padding.left}, ${padding.top})`}
            />

            {/* Data points */}
            {aggregatedData.map((d, i) => (
              <g key={i} transform={`translate(${padding.left + xScale(i)}, ${padding.top + yScale(d.percentage)})`}>
                <circle
                  r="6"
                  className="fill-primary stroke-background"
                  strokeWidth="3"
                />
                <title>{`${d.testLabel}: ${d.percentage.toFixed(1)}% (${new Date(d.timestamp).toLocaleDateString()})`}</title>
              </g>
            ))}

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

            {/* X-axis tick labels */}
            {aggregatedData.map((d, i) => {
              if (aggregatedData.length > 15 && i % 2 !== 0) return null;
              return (
                <text
                  key={i}
                  x={padding.left + xScale(i)}
                  y={padding.top + chartHeight + 25}
                  textAnchor="middle"
                  className="text-[14px] fill-muted-foreground font-medium"
                >
                  {i + 1}
                </text>
              );
            })}

            {/* X-axis label */}
            <text
              x={padding.left + chartWidth / 2}
              y={height - 25}
              textAnchor="middle"
              className="text-[16px] fill-foreground font-semibold"
            >
              Attempt Number
            </text>

            {/* Y-axis label */}
            <text
              x={30}
              y={padding.top + chartHeight / 2}
              textAnchor="middle"
              className="text-[16px] fill-foreground font-semibold"
              transform={`rotate(-90, 30, ${padding.top + chartHeight / 2})`}
            >
              Score Percentage
            </text>
          </svg>
        </div>

        {/* Recent scores summary */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-3">Recent Scores:</p>
          <div className="flex flex-wrap gap-2">
            {aggregatedData.slice(-5).reverse().map((d, i) => (
              <div key={i} className="bg-muted/50 rounded-lg px-3 py-2 text-sm border">
                <span className="font-semibold text-primary">{d.percentage.toFixed(1)}%</span>
                <span className="text-muted-foreground ml-2">
                  ({new Date(d.timestamp).toLocaleDateString()})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
