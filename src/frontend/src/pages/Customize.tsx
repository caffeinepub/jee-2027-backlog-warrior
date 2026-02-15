import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useSubjects } from '../hooks/useSubjects';
import { useCustomization } from '../customization/CustomizationProvider';
import { useCustomizationPresets } from '../customization/useCustomizationPresets';
import { useState, useCallback } from 'react';
import { Trash2, Plus, Save, Check } from 'lucide-react';
import { SubjectDeleteButton } from '../components/SubjectDeleteButton';
import { getSubjectIcon } from '../data/subjects';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Sun, Moon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { APP_VERSION, getConfirmedRollbackTarget } from '../lib/appVersion';
import { Badge } from '../components/ui/badge';

export function Customize() {
  const { subjects, addSubject, deleteSubject } = useSubjects();
  const { settings, updateSettings, resetToDefaults } = useCustomization();
  const { presets, savePreset, applyPreset, deletePreset } = useCustomizationPresets();

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newPresetName, setNewPresetName] = useState('');

  const handleAddSubject = useCallback(() => {
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim());
      setNewSubjectName('');
    }
  }, [newSubjectName, addSubject]);

  const handleSavePreset = useCallback(() => {
    if (newPresetName.trim()) {
      savePreset(newPresetName.trim(), settings);
      setNewPresetName('');
    }
  }, [newPresetName, settings, savePreset]);

  const confirmedRollback = getConfirmedRollbackTarget();

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Customize Your Study Planner</h1>
        <p className="text-muted-foreground">
          Manage subjects, adjust settings, and personalize your experience
        </p>
      </div>

      <Tabs defaultValue="subjects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="settings">Study Settings</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
        </TabsList>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Subjects</CardTitle>
              <CardDescription>
                Add or remove subjects from your study plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New subject name"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                />
                <Button onClick={handleAddSubject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subjects.map((subject) => {
                  const Icon = getSubjectIcon(subject.name);
                  return (
                    <div
                      key={subject.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{subject.name}</span>
                        {subject.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      {!subject.isDefault && (
                        <SubjectDeleteButton
                          subjectName={subject.name}
                          onDelete={() => deleteSubject(subject.id)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Settings</CardTitle>
              <CardDescription>
                Configure your study preferences and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Daily Target Hours: {settings.dailyTargetHours}h</Label>
                <Slider
                  value={[settings.dailyTargetHours]}
                  onValueChange={([value]) => updateSettings({ dailyTargetHours: value })}
                  min={1}
                  max={16}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Lecture Speed Factor: {settings.lectureSpeedFactor}x</Label>
                <Slider
                  value={[settings.lectureSpeedFactor]}
                  onValueChange={([value]) => updateSettings({ lectureSpeedFactor: value })}
                  min={1}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Sleep Window</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sleep-start" className="text-xs text-muted-foreground">
                      Start
                    </Label>
                    <Input
                      id="sleep-start"
                      type="time"
                      value={settings.sleepWindowStart}
                      onChange={(e) => updateSettings({ sleepWindowStart: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleep-end" className="text-xs text-muted-foreground">
                      End
                    </Label>
                    <Input
                      id="sleep-end"
                      type="time"
                      value={settings.sleepWindowEnd}
                      onChange={(e) => updateSettings({ sleepWindowEnd: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Show alerts for incomplete work
                  </p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-recalculate Date to Finish</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically update completion dates
                  </p>
                </div>
                <Switch
                  checked={settings.autoRecalculateDateToFinish}
                  onCheckedChange={(checked) =>
                    updateSettings({ autoRecalculateDateToFinish: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your study planner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <ToggleGroup
                  type="single"
                  value={settings.darkModeOverride.enabled ? settings.darkModeOverride.mode : 'dark'}
                  onValueChange={(value) => {
                    if (value) {
                      updateSettings({
                        darkModeOverride: {
                          enabled: true,
                          mode: value as 'light' | 'dark',
                        },
                      });
                    }
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="light" aria-label="Light mode" className="gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" aria-label="Dark mode" className="gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Chapter Card Size</Label>
                <ToggleGroup
                  type="single"
                  value={settings.chapterCardSize}
                  onValueChange={(value) => {
                    if (value) {
                      updateSettings({ chapterCardSize: value as 'compact' | 'detailed' });
                    }
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
                  <ToggleGroupItem value="detailed">Detailed</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          {/* App Version Section */}
          <Card>
            <CardHeader>
              <CardTitle>App Version</CardTitle>
              <CardDescription>
                Current application version information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Version</p>
                  <p className="text-2xl font-bold text-primary">{APP_VERSION.label}</p>
                  <p className="text-xs text-muted-foreground">{APP_VERSION.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>

              {confirmedRollback && (
                <div className="p-4 rounded-lg border border-warning/50 bg-warning/10">
                  <p className="text-sm font-medium text-warning mb-2">Last Rollback Confirmation</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Target: {confirmedRollback.target}</p>
                    <p>Confirmed: {new Date(confirmedRollback.confirmedAt).toLocaleString()}</p>
                    <p>From Version: {confirmedRollback.currentVersion}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Presets Tab */}
        <TabsContent value="presets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings Presets</CardTitle>
              <CardDescription>
                Save and load your favorite settings configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Preset name"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                />
                <Button onClick={handleSavePreset}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Current
                </Button>
              </div>

              <Separator />

              {presets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No saved presets. Create one by entering a name and clicking "Save Current".
                </p>
              ) : (
                <div className="space-y-2">
                  {presets.map((preset) => (
                    <div
                      key={preset.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <span className="font-medium">{preset.name}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const settings = applyPreset(preset.name);
                            if (settings) {
                              updateSettings(settings);
                            }
                          }}
                        >
                          Apply
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Preset</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the preset "{preset.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePreset(preset.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Reset to Defaults
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset to Default Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all customization settings to their default values. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetToDefaults}>
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
