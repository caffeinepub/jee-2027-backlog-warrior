import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { useTests, Test } from '../hooks/useTests';
import { Plus, Trash2, Edit2, Save, X, Trophy, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { TestScoreChart } from '../components/TestScoreChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const CHART_COLORS = [
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#84cc16', label: 'Lime' },
];

export function Tests() {
  const { tests, addTest, updateTest, deleteTest, addScore, updateScore, deleteScore, updateChartSettings } = useTests();
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [newTestLabel, setNewTestLabel] = useState('');
  const [newTestMarks, setNewTestMarks] = useState('');
  const [editTestLabel, setEditTestLabel] = useState('');
  const [editTestMarks, setEditTestMarks] = useState('');
  const [newScore, setNewScore] = useState<Record<string, string>>({});
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [editScoreValue, setEditScoreValue] = useState('');

  const handleCreateTest = () => {
    if (!newTestLabel.trim() || !newTestMarks.trim()) {
      toast.error('Please enter test label and total marks');
      return;
    }
    const marks = parseFloat(newTestMarks);
    if (isNaN(marks) || marks <= 0) {
      toast.error('Total marks must be a positive number');
      return;
    }
    addTest(newTestLabel, marks);
    setNewTestLabel('');
    setNewTestMarks('');
    setIsCreatingTest(false);
    toast.success('Test created successfully');
  };

  const handleEditTest = (test: Test) => {
    setEditingTestId(test.id);
    setEditTestLabel(test.label);
    setEditTestMarks(test.totalMarks.toString());
  };

  const handleSaveEdit = (testId: string) => {
    if (!editTestLabel.trim() || !editTestMarks.trim()) {
      toast.error('Please enter test label and total marks');
      return;
    }
    const marks = parseFloat(editTestMarks);
    if (isNaN(marks) || marks <= 0) {
      toast.error('Total marks must be a positive number');
      return;
    }
    updateTest(testId, editTestLabel, marks);
    setEditingTestId(null);
    toast.success('Test updated successfully');
  };

  const handleAddScore = (testId: string) => {
    const scoreStr = newScore[testId];
    if (!scoreStr || !scoreStr.trim()) {
      toast.error('Please enter a score');
      return;
    }
    const score = parseFloat(scoreStr);
    if (isNaN(score) || score < 0) {
      toast.error('Score must be a non-negative number');
      return;
    }
    const test = tests.find(t => t.id === testId);
    if (test && score > test.totalMarks) {
      toast.error(`Score cannot exceed total marks (${test.totalMarks})`);
      return;
    }
    addScore(testId, score);
    setNewScore(prev => ({ ...prev, [testId]: '' }));
    toast.success('Score added successfully');
  };

  const handleEditScore = (testId: string, scoreId: string, currentScore: number) => {
    setEditingScoreId(scoreId);
    setEditScoreValue(currentScore.toString());
  };

  const handleSaveScoreEdit = (testId: string, scoreId: string) => {
    if (!editScoreValue.trim()) {
      toast.error('Please enter a score');
      return;
    }
    const score = parseFloat(editScoreValue);
    if (isNaN(score) || score < 0) {
      toast.error('Score must be a non-negative number');
      return;
    }
    const test = tests.find(t => t.id === testId);
    if (test && score > test.totalMarks) {
      toast.error(`Score cannot exceed total marks (${test.totalMarks})`);
      return;
    }
    updateScore(testId, scoreId, score);
    setEditingScoreId(null);
    toast.success('Score updated successfully');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateAverage = (test: Test): number => {
    if (test.scores.length === 0) return 0;
    const sum = test.scores.reduce((acc, s) => acc + s.score, 0);
    return sum / test.scores.length;
  };

  const calculatePercentage = (score: number, total: number): string => {
    return ((score / total) * 100).toFixed(1);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              Tests Tracker
            </h1>
            <p className="text-muted-foreground mt-1">Track your test scores and progress</p>
          </div>
          <Button onClick={() => setIsCreatingTest(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>

        {/* Create Test Form */}
        {isCreatingTest && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Test Label</label>
                  <Input
                    placeholder="e.g., Physics Mock Test 1"
                    value={newTestLabel}
                    onChange={(e) => setNewTestLabel(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Total Marks</label>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    value={newTestMarks}
                    onChange={(e) => setNewTestMarks(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTest}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Test
                </Button>
                <Button variant="outline" onClick={() => setIsCreatingTest(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tests List */}
        {tests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No tests yet</p>
              <p className="text-xs mt-1">Create your first test to start tracking scores!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => {
              const avgScore = calculateAverage(test);
              return (
                <Card key={test.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {editingTestId === test.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editTestLabel}
                              onChange={(e) => setEditTestLabel(e.target.value)}
                              placeholder="Test label"
                            />
                            <Input
                              type="number"
                              value={editTestMarks}
                              onChange={(e) => setEditTestMarks(e.target.value)}
                              placeholder="Total marks"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveEdit(test.id)}>
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingTestId(null)}>
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <CardTitle className="flex items-center gap-2">
                              {test.label}
                              <span className="text-sm font-normal text-muted-foreground">
                                (Total: {test.totalMarks} marks)
                              </span>
                            </CardTitle>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              <span>Attempts: {test.scores.length}</span>
                              {test.scores.length > 0 && (
                                <span>Average: {avgScore.toFixed(1)} ({calculatePercentage(avgScore, test.totalMarks)}%)</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {editingTestId !== test.id && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditTest(test)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            deleteTest(test.id);
                            toast.success('Test deleted');
                          }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedTestId(expandedTestId === test.id ? null : test.id)}
                          >
                            {expandedTestId === test.id ? 'Collapse' : 'Expand'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {expandedTestId === test.id && (
                    <CardContent className="space-y-6">
                      {/* Chart Customization */}
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Chart Settings
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium mb-2 block">Chart Type</label>
                            <Select
                              value={test.chartType}
                              onValueChange={(value: 'line' | 'bar') => updateChartSettings(test.id, value, test.chartColor)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="line">Line Chart</SelectItem>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-2 block">Chart Color</label>
                            <Select
                              value={test.chartColor}
                              onValueChange={(value) => updateChartSettings(test.id, test.chartType, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CHART_COLORS.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: color.value }}
                                      />
                                      {color.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Chart */}
                      {test.scores.length > 0 && (
                        <div className="border-t pt-4">
                          <h3 className="text-sm font-medium mb-3">Score Progress</h3>
                          <TestScoreChart test={test} />
                        </div>
                      )}

                      {/* Add Score */}
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-3">Add New Score</h3>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder={`Score (max ${test.totalMarks})`}
                            value={newScore[test.id] || ''}
                            onChange={(e) => setNewScore(prev => ({ ...prev, [test.id]: e.target.value }))}
                          />
                          <Button onClick={() => handleAddScore(test.id)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Scores List */}
                      {test.scores.length > 0 && (
                        <div className="border-t pt-4">
                          <h3 className="text-sm font-medium mb-3">Score History</h3>
                          <ScrollArea className="h-64">
                            <div className="space-y-2 pr-4">
                              {test.scores.map((score, index) => (
                                <div
                                  key={score.id}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm font-medium">Attempt {test.scores.length - index}</span>
                                      {editingScoreId === score.id ? (
                                        <Input
                                          type="number"
                                          value={editScoreValue}
                                          onChange={(e) => setEditScoreValue(e.target.value)}
                                          className="w-24"
                                        />
                                      ) : (
                                        <span className="text-lg font-bold text-primary">
                                          {score.score}/{test.totalMarks}
                                        </span>
                                      )}
                                      <span className="text-sm text-muted-foreground">
                                        ({calculatePercentage(score.score, test.totalMarks)}%)
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {formatDate(score.timestamp)}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    {editingScoreId === score.id ? (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() => handleSaveScoreEdit(test.id, score.id)}
                                        >
                                          <Save className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEditingScoreId(null)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEditScore(test.id, score.id, score.score)}
                                        >
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            deleteScore(test.id, score.id);
                                            toast.success('Score deleted');
                                          }}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
