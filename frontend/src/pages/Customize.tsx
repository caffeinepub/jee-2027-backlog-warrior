import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { ScrollArea } from '../components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { ArrowLeft, Save, X, Smartphone, Monitor, Trash2, Plus } from 'lucide-react';
import { useCustomization } from '../customization/CustomizationProvider';
import { type CustomizationSettings } from '../customization/settingsModel';
import { useCustomizationPresets } from '../customization/useCustomizationPresets';
import { useSubjects } from '../hooks/useSubjects';
import { ChapterCard } from '../components/ChapterCard';
import { useChapterData } from '../hooks/useChapterData';
import { toast } from 'sonner';

export function Customize() {
  const navigate = useNavigate();
  const { settings: globalSettings, updateSettings } = useCustomization();
  const { chapters } = useChapterData();
  const { presets, savePreset, applyPreset, deletePreset } = useCustomizationPresets();
  const { subjects, addSubject, deleteSubject } = useSubjects();
  const { deleteChaptersBySubjectId } = useChapterData();
  
  const [draftSettings, setDraftSettings] = useState<CustomizationSettings>(globalSettings);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [presetName, setPresetName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);

  const sampleChapters = useMemo(() => chapters.slice(0, 3), [chapters]);

  const handleDraftChange = useCallback((updates: Partial<CustomizationSettings>) => {
    setDraftSettings(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    updateSettings(draftSettings);
    setHasUnsavedChanges(false);
    toast.success('Settings saved successfully!');
  }, [draftSettings, updateSettings]);

  const handleDiscard = useCallback(() => {
    setDraftSettings(globalSettings);
    setHasUnsavedChanges(false);
    toast.info('Changes discarded');
  }, [globalSettings]);

  const handleSavePreset = useCallback(() => {
    if (presetName.trim()) {
      savePreset(presetName.trim(), draftSettings);
      setPresetName('');
      toast.success('Preset saved!');
    }
  }, [presetName, draftSettings, savePreset]);

  const handleApplyPreset = useCallback((presetName: string) => {
    const settings = applyPreset(presetName);
    if (settings) {
      setDraftSettings(settings);
      setHasUnsavedChanges(true);
      toast.success('Preset applied!');
    }
  }, [applyPreset]);

  const handleAddSubject = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      const success = addSubject(newSubjectName.trim());
      if (success) {
        toast.success(`Subject "${newSubjectName.trim()}" added successfully!`);
        setNewSubjectName('');
      } else {
        toast.error('Failed to add subject. It may already exist.');
      }
    }
  }, [newSubjectName, addSubject]);

  const handleDeleteSubject = useCallback((subjectId: string) => {
    const success = deleteSubject(subjectId);
    if (success) {
      deleteChaptersBySubjectId(subjectId);
      toast.success('Subject and associated chapters deleted successfully!');
      setSubjectToDelete(null);
    } else {
      toast.error('Failed to delete subject.');
    }
  }, [deleteSubject, deleteChaptersBySubjectId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Customize</h1>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <>
                <Button variant="ghost" size="sm" onClick={handleDiscard}>
                  <X className="h-4 w-4 mr-2" />
                  Discard
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>Manage your study subjects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddSubject} className="flex gap-2">
                  <Input
                    placeholder="Add a new subject..."
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>

                <Separator />

                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <span className="font-medium">{subject.name}</span>
                        <AlertDialog open={subjectToDelete === subject.id} onOpenChange={(open) => !open && setSubjectToDelete(null)}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSubjectToDelete(subject.id)}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{subject.name}"? This will also delete all chapters associated with this subject. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSubject(subject.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Settings</CardTitle>
                <CardDescription>Configure your daily targets and playback speed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Daily Target Hours: {draftSettings.dailyTargetHours}h</Label>
                  <Slider
                    value={[draftSettings.dailyTargetHours]}
                    onValueChange={([value]) => handleDraftChange({ dailyTargetHours: value })}
                    min={1}
                    max={16}
                    step={0.5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lecture Speed Factor: {draftSettings.lectureSpeedFactor}x</Label>
                  <Slider
                    value={[draftSettings.lectureSpeedFactor]}
                    onValueChange={([value]) => handleDraftChange({ lectureSpeedFactor: value })}
                    min={1}
                    max={2}
                    step={0.1}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={draftSettings.notificationsEnabled}
                      onCheckedChange={(checked) => handleDraftChange({ notificationsEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-recalc">Auto-recalculate Date to Finish</Label>
                    <Switch
                      id="auto-recalc"
                      checked={draftSettings.autoRecalculateDateToFinish}
                      onCheckedChange={(checked) => handleDraftChange({ autoRecalculateDateToFinish: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Sleep Window</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sleep-start" className="text-xs text-muted-foreground">Start</Label>
                      <Input
                        id="sleep-start"
                        type="time"
                        value={draftSettings.sleepWindowStart}
                        onChange={(e) => handleDraftChange({ sleepWindowStart: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sleep-end" className="text-xs text-muted-foreground">End</Label>
                      <Input
                        id="sleep-end"
                        type="time"
                        value={draftSettings.sleepWindowEnd}
                        onChange={(e) => handleDraftChange({ sleepWindowEnd: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Customize the appearance of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Chapter Card Size</Label>
                  <ToggleGroup
                    type="single"
                    value={draftSettings.chapterCardSize}
                    onValueChange={(value) => value && handleDraftChange({ chapterCardSize: value as 'compact' | 'detailed' })}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="compact" aria-label="Compact">
                      Compact
                    </ToggleGroupItem>
                    <ToggleGroupItem value="detailed" aria-label="Detailed">
                      Detailed
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode-override">Dark Mode Override</Label>
                    <Switch
                      id="dark-mode-override"
                      checked={draftSettings.darkModeOverride.enabled}
                      onCheckedChange={(checked) => 
                        handleDraftChange({ 
                          darkModeOverride: { 
                            ...draftSettings.darkModeOverride, 
                            enabled: checked 
                          } 
                        })
                      }
                    />
                  </div>
                  {draftSettings.darkModeOverride.enabled && (
                    <ToggleGroup
                      type="single"
                      value={draftSettings.darkModeOverride.mode}
                      onValueChange={(value) => 
                        value && handleDraftChange({ 
                          darkModeOverride: { 
                            ...draftSettings.darkModeOverride, 
                            mode: value as 'light' | 'dark' 
                          } 
                        })
                      }
                      className="justify-start"
                    >
                      <ToggleGroupItem value="light" aria-label="Light mode">
                        Light
                      </ToggleGroupItem>
                      <ToggleGroupItem value="dark" aria-label="Dark mode">
                        Dark
                      </ToggleGroupItem>
                    </ToggleGroup>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Presets</CardTitle>
                <CardDescription>Save and load customization presets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Preset name..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                  />
                  <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
                    Save
                  </Button>
                </div>

                <Separator />

                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {presets.map((preset) => (
                      <div
                        key={preset.name}
                        className="flex items-center justify-between p-2 border border-border rounded-lg"
                      >
                        <span className="text-sm font-medium">{preset.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApplyPreset(preset.name)}
                          >
                            Apply
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              deletePreset(preset.name);
                              toast.success('Preset deleted');
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Preview</CardTitle>
                  <ToggleGroup
                    type="single"
                    value={previewMode}
                    onValueChange={(value) => value && setPreviewMode(value as 'desktop' | 'mobile')}
                  >
                    <ToggleGroupItem value="desktop" aria-label="Desktop preview">
                      <Monitor className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="mobile" aria-label="Mobile preview">
                      <Smartphone className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <CardDescription>See how your changes will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border border-border rounded-lg p-4 bg-background ${
                    previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Sample Chapters</h3>
                    <div className={`grid gap-4 ${previewMode === 'desktop' ? 'sm:grid-cols-2' : ''}`}>
                      {sampleChapters.map((chapter) => (
                        <ChapterCard
                          key={chapter.id}
                          chapter={chapter}
                          onClick={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
