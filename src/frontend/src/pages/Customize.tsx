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
  const { subjects, addSubject } = useSubjects();
  
  const [draftSettings, setDraftSettings] = useState<CustomizationSettings>(globalSettings);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [presetName, setPresetName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const sampleChapters = useMemo(() => chapters.slice(0, 3), [chapters]);

  const handleDraftChange = useCallback((updates: Partial<CustomizationSettings>) => {
    setDraftSettings(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    updateSettings(draftSettings);
    setHasUnsavedChanges(false);
  }, [draftSettings, updateSettings]);

  const handleDiscard = useCallback(() => {
    setDraftSettings(globalSettings);
    setHasUnsavedChanges(false);
  }, [globalSettings]);

  const handleSavePreset = useCallback(() => {
    if (presetName.trim()) {
      savePreset(presetName.trim(), draftSettings);
      setPresetName('');
    }
  }, [presetName, draftSettings, savePreset]);

  const handleApplyPreset = useCallback((preset: CustomizationSettings) => {
    setDraftSettings(preset);
    setHasUnsavedChanges(true);
  }, []);

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
                  <Label>Sleep Window</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Start</Label>
                      <Input
                        type="time"
                        value={draftSettings.sleepWindowStart}
                        onChange={(e) => handleDraftChange({ sleepWindowStart: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">End</Label>
                      <Input
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
                <CardDescription>Customize how information is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chapter Card Size</Label>
                    <p className="text-sm text-muted-foreground">Choose compact or detailed view</p>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={draftSettings.chapterCardSize}
                    onValueChange={(value) => value && handleDraftChange({ chapterCardSize: value as 'compact' | 'detailed' })}
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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Override system theme</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={draftSettings.darkModeOverride.enabled}
                      onCheckedChange={(checked) =>
                        handleDraftChange({
                          darkModeOverride: { ...draftSettings.darkModeOverride, enabled: checked },
                        })
                      }
                    />
                    {draftSettings.darkModeOverride.enabled && (
                      <ToggleGroup
                        type="single"
                        value={draftSettings.darkModeOverride.mode}
                        onValueChange={(value) =>
                          value &&
                          handleDraftChange({
                            darkModeOverride: { ...draftSettings.darkModeOverride, mode: value as 'light' | 'dark' },
                          })
                        }
                      >
                        <ToggleGroupItem value="light" aria-label="Light">
                          Light
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dark" aria-label="Dark">
                          Dark
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-recalculate Date to Finish</Label>
                    <p className="text-sm text-muted-foreground">Update finish dates automatically</p>
                  </div>
                  <Switch
                    checked={draftSettings.autoRecalculateDateToFinish}
                    onCheckedChange={(checked) => handleDraftChange({ autoRecalculateDateToFinish: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable study reminders</p>
                  </div>
                  <Switch
                    checked={draftSettings.notificationsEnabled}
                    onCheckedChange={(checked) => handleDraftChange({ notificationsEnabled: checked })}
                  />
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
                    placeholder="Preset name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                  />
                  <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
                    Save Preset
                  </Button>
                </div>

                <Separator />

                {presets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No saved presets. Create one to quickly switch between configurations.
                  </p>
                ) : (
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {presets.map((preset) => (
                        <div
                          key={preset.name}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <span className="font-medium">{preset.name}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApplyPreset(preset.settings)}
                            >
                              Apply
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Preset</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{preset.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deletePreset(preset.name)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Preview</CardTitle>
                  <ToggleGroup
                    type="single"
                    value={previewMode}
                    onValueChange={(value) => value && setPreviewMode(value as 'desktop' | 'mobile')}
                  >
                    <ToggleGroupItem value="desktop" aria-label="Desktop">
                      <Monitor className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="mobile" aria-label="Mobile">
                      <Smartphone className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <CardDescription>See how your changes look in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`${previewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
                  <div className="border border-border rounded-lg p-4 bg-background min-h-[400px]">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Sample Chapters</h3>
                      <div className="grid gap-4">
                        {sampleChapters.map((chapter) => (
                          <div key={chapter.id} className="pointer-events-none">
                            <ChapterCard
                              chapter={chapter}
                              onClick={() => {}}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Preview reflects: {draftSettings.chapterCardSize} cards, {draftSettings.lectureSpeedFactor}x speed, {draftSettings.dailyTargetHours}h daily target
                        </p>
                      </div>
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
