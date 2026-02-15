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
import { Trash2, Plus, Save, Check, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react';
import { SubjectDeleteButton } from '../components/SubjectDeleteButton';
import { getSubjectIcon } from '../data/subjects';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Sun, Moon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { APP_VERSION, getConfirmedRollbackTarget } from '../lib/appVersion';
import { Badge } from '../components/ui/badge';
import { RollbackTargetSafeguard } from '../components/RollbackTargetSafeguard';
import { activateRollbackToV37, deactivateRollback, isRollbackActive, getRollbackStatus, retryRollbackReconciliation } from '../lib/rollbackRestore';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export function Customize() {
  const { subjects, addSubject, deleteSubject } = useSubjects();
  const { settings, updateSettings, resetToDefaults } = useCustomization();
  const { presets, savePreset, applyPreset, deletePreset } = useCustomizationPresets();

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newPresetName, setNewPresetName] = useState('');
  const [showRollbackSafeguard, setShowRollbackSafeguard] = useState(false);

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

  const handleRollbackRequest = useCallback(() => {
    setShowRollbackSafeguard(true);
  }, []);

  const handleRollbackConfirmed = useCallback((confirmedTarget: string) => {
    try {
      activateRollbackToV37(confirmedTarget);
    } catch (error) {
      toast.error('Rollback failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
      setShowRollbackSafeguard(false);
    }
  }, []);

  const handleRollbackCancel = useCallback(() => {
    setShowRollbackSafeguard(false);
  }, []);

  const handleRestoreNormal = useCallback(() => {
    try {
      deactivateRollback();
    } catch (error) {
      toast.error('Restore failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }, []);

  const handleRetryReconciliation = useCallback(() => {
    try {
      retryRollbackReconciliation();
    } catch (error) {
      toast.error('Retry failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }, []);

  const confirmedRollback = getConfirmedRollbackTarget();
  const rollbackStatus = getRollbackStatus();

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
              <CardTitle>Study Configuration</CardTitle>
              <CardDescription>
                Adjust your daily targets and study parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-4">
                <Label>Sleep Window (avoid study notifications)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Start Time</Label>
                    <Input
                      type="time"
                      value={settings.sleepWindowStart}
                      onChange={(e) => updateSettings({ sleepWindowStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">End Time</Label>
                    <Input
                      type="time"
                      value={settings.sleepWindowEnd}
                      onChange={(e) => updateSettings({ sleepWindowEnd: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders during study sessions
                  </p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-recalculate Date to Finish</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically update target dates based on progress
                  </p>
                </div>
                <Switch
                  checked={settings.autoRecalculateDateToFinish}
                  onCheckedChange={(checked) => updateSettings({ autoRecalculateDateToFinish: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings Tab */}
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize the appearance of your study planner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <ToggleGroup
                  type="single"
                  value={settings.darkModeOverride.enabled ? settings.darkModeOverride.mode : 'system'}
                  onValueChange={(value) => {
                    if (value === 'system') {
                      updateSettings({ 
                        darkModeOverride: { 
                          enabled: false, 
                          mode: settings.darkModeOverride.mode 
                        } 
                      });
                    } else {
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
                  <ToggleGroupItem value="light" aria-label="Light mode">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" aria-label="Dark mode">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </ToggleGroupItem>
                  <ToggleGroupItem value="system" aria-label="System theme">
                    System
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
                    if (value) updateSettings({ chapterCardSize: value as 'compact' | 'detailed' });
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
                  <ToggleGroupItem value="detailed">Detailed</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>App Version</CardTitle>
              <CardDescription>
                Current version and rollback controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Version</p>
                  <p className="text-sm text-muted-foreground">{APP_VERSION.label}</p>
                </div>
                <Badge variant={rollbackStatus.active ? 'destructive' : 'secondary'}>
                  {rollbackStatus.active ? 'Rollback Active' : 'Normal Operation'}
                </Badge>
              </div>

              {rollbackStatus.active && (
                <>
                  <Separator />
                  
                  {/* Rollback Verification Panel */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium">Rollback Status</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Rollback Active:</span>
                            <Badge variant="outline" className="text-xs">
                              {rollbackStatus.active ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Reconciliation Complete:</span>
                            <Badge variant={rollbackStatus.reconciled ? 'default' : 'destructive'} className="text-xs">
                              {rollbackStatus.reconciled ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          {confirmedRollback && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Target Version:</span>
                              <span className="text-xs font-mono">{confirmedRollback.target}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {rollbackStatus.needsReconciliation && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Reconciliation Incomplete</AlertTitle>
                        <AlertDescription>
                          The rollback restore process did not complete successfully. Click "Retry Restore" to force a clean v37 baseline.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      {rollbackStatus.needsReconciliation && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="default" size="sm">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Retry Restore
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Retry Rollback Reconciliation?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will force a clean restore to v37 baseline state by clearing all app data and reloading. 
                                Any unsaved changes will be lost.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleRetryReconciliation}>
                                Retry Restore
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore Normal Operation
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restore Normal Operation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will deactivate rollback mode and return to the latest version. 
                              The app will reload to apply changes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRestoreNormal}>
                              Restore Normal
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </>
              )}

              {!rollbackStatus.active && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRollbackRequest}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Rollback to v37
                  </Button>
                </>
              )}

              <Separator />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All Settings
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset All Settings?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all customization settings to their default values. 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetToDefaults}>
                      Reset Settings
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Presets Tab */}
        <TabsContent value="presets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customization Presets</CardTitle>
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
                <p className="text-sm text-muted-foreground text-center py-8">
                  No saved presets. Create one by saving your current settings.
                </p>
              ) : (
                <div className="space-y-2">
                  {presets.map((preset) => (
                    <div
                      key={preset.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{preset.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const presetSettings = applyPreset(preset.name);
                            if (presetSettings) {
                              updateSettings(presetSettings);
                              toast.success(`Preset "${preset.name}" applied successfully!`);
                            }
                          }}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Apply
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Preset?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the preset "{preset.name}"? 
                                This action cannot be undone.
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rollback Safeguard Dialog */}
      <RollbackTargetSafeguard
        isActive={showRollbackSafeguard}
        onConfirmed={handleRollbackConfirmed}
        onCancel={handleRollbackCancel}
      />
    </div>
  );
}
