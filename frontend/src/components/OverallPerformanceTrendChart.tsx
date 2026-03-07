import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Test } from '../hooks/useTests';

interface OverallPerformanceTrendChartProps {
  tests: Test[];
}

export function OverallPerformanceTrendChart({ tests }: OverallPerformanceTrendChartProps) {
  const allScores = useMemo(() => {
    const scores: Array<{ score: number; maxScore: number; percentage: number; date: number; testLabel: string }> = [];
    
    tests.forEach(test => {
      test.scores.forEach(score => {
        scores.push({
          score: score.score,
          maxScore: test.totalMarks,
          percentage: (score.score / test.totalMarks) * 100,
          date: score.timestamp,
          testLabel: test.label
        });
      });
    });
    
    return scores.sort((a, b) => a.date - b.date);
  }, [tests]);

  const stats = useMemo(() => {
    if (allScores.length === 0) {
      return { avgPercentage: 0, trend: 'Stable' as const, recentScores: [] };
    }

    const avgPercentage = allScores.reduce((sum, s) => sum + s.percentage, 0) / allScores.length;
    
    // Simple linear regression for trend
    const n = allScores.length;
    const sumX = allScores.reduce((sum, _, i) => sum + i, 0);
    const sumY = allScores.reduce((sum, s) => sum + s.percentage, 0);
    const sumXY = allScores.reduce((sum, s, i) => sum + i * s.percentage, 0);
    const sumX2 = allScores.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    let trend: 'Improving' | 'Declining' | 'Stable' = 'Stable';
    if (slope > 1) trend = 'Improving';
    else if (slope < -1) trend = 'Declining';
    
    const recentScores = allScores.slice(-3);
    
    return { avgPercentage, trend, recentScores };
  }, [allScores]);

  if (allScores.length === 0) {
    return (
      <Card className="mb-6 bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Overall Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm">
            No test scores recorded yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Chart dimensions
  const width = 900;
  const height = 350;
  const padding = { top: 40, right: 40, bottom: 80, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index: number) => {
    return (index / Math.max(allScores.length - 1, 1)) * chartWidth;
  };

  const yScale = (percentage: number) => {
    return chartHeight - (percentage / 100) * chartHeight;
  };

  // Generate path
  const linePath = allScores
    .map((s, i) => {
      const x = xScale(i);
      const y = yScale(s.percentage);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  const trendColor = stats.trend === 'Improving' 
    ? 'oklch(65% 0.18 150)' 
    : stats.trend === 'Declining' 
    ? 'oklch(58% 0.22 25)' 
    : 'oklch(68% 0.16 195)';

  const TrendIcon = stats.trend === 'Improving' 
    ? TrendingUp 
    : stats.trend === 'Declining' 
    ? TrendingDown 
    : Minus;

  return (
    <Card className="mb-6 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-smooth shadow-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Overall Performance Trend
          </CardTitle>
          <div className="flex items-center gap-2">
            <TrendIcon className="h-5 w-5" style={{ color: trendColor }} />
            <span className="text-sm font-semibold" style={{ color: trendColor }}>
              {stats.trend}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full transition-smooth"
            style={{ minWidth: '320px', maxHeight: '350px' }}
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((tick) => {
              const y = chartHeight * (1 - tick / 100);
              return (
                <g key={tick} className="transition-smooth">
                  <line
                    x1={padding.left}
                    y1={padding.top + y}
                    x2={padding.left + chartWidth}
                    y2={padding.top + y}
                    className="stroke-border/30 transition-smooth"
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
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* Chart content */}
            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {/* Line path with glow */}
              <path
                d={linePath}
                fill="none"
                stroke={trendColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-smooth"
                style={{
                  filter: 'drop-shadow(0 0 6px currentColor)',
                  opacity: 0.9
                }}
              />
              {/* Data points */}
              {allScores.map((s, i) => (
                <g key={i} className="transition-smooth hover:scale-110">
                  <circle
                    cx={xScale(i)}
                    cy={yScale(s.percentage)}
                    r="5"
                    fill={trendColor}
                    className="stroke-background transition-smooth"
                    strokeWidth="2"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                  >
                    <title>{`${s.testLabel}: ${s.percentage.toFixed(1)}%`}</title>
                  </circle>
                </g>
              ))}
            </g>

            {/* Axes */}
            <line
              x1={padding.left}
              y1={padding.top + chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight}
              className="stroke-border/50"
              strokeWidth="2"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + chartHeight}
              className="stroke-border/50"
              strokeWidth="2"
            />

            {/* Axis labels */}
            <text
              x={padding.left + chartWidth / 2}
              y={height - 20}
              textAnchor="middle"
              className="text-[16px] fill-foreground font-semibold"
            >
              Test Attempts (Chronological)
            </text>
            <text
              x={25}
              y={padding.top + chartHeight / 2}
              textAnchor="middle"
              className="text-[16px] fill-foreground font-semibold"
              transform={`rotate(-90, 25, ${padding.top + chartHeight / 2})`}
            >
              Percentage (%)
            </text>
          </svg>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary drop-shadow-sm">
              {stats.avgPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{allScores.length}</div>
            <div className="text-xs text-muted-foreground">Total Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: trendColor }}>
              {stats.trend}
            </div>
            <div className="text-xs text-muted-foreground">Trend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success drop-shadow-sm">
              {stats.recentScores.length > 0 
                ? stats.recentScores[stats.recentScores.length - 1].percentage.toFixed(1) 
                : '0'}%
            </div>
            <div className="text-xs text-muted-foreground">Latest</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
