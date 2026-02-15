import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../components/ui/sheet';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Separator } from '../components/ui/separator';
import { useCustomization } from './CustomizationProvider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Sun, Moon } from 'lucide-react';

interface CustomizationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomizationPanel({ open, onOpenChange }: CustomizationPanelProps) {
  const { settings, updateSettings, resetToDefaults } = useCustomization();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customization</SheetTitle>
          <SheetDescription>
            Adjust your study settings and preferences
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Theme Selection */}
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
                      mode: value as 'light' | 'dark' 
                    } 
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
            <p className="text-xs text-muted-foreground">
              Choose your preferred color theme
            </p>
          </div>

          <Separator />

          {/* Daily Target Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-target">Daily Target Hours</Label>
              <span className="text-sm font-semibold text-primary">{settings.dailyTargetHours}h</span>
            </div>
            <Slider
              id="daily-target"
              min={1}
              max={16}
              step={0.5}
              value={[settings.dailyTargetHours]}
              onValueChange={([value]) => updateSettings({ dailyTargetHours: value })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Used to calculate date-to-finish for chapters
            </p>
          </div>

          <Separator />

          {/* Lecture Speed Factor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="speed-factor">Lecture Speed Factor</Label>
              <span className="text-sm font-semibold text-primary">{settings.lectureSpeedFactor}x</span>
            </div>
            <Slider
              id="speed-factor"
              min={1}
              max={2}
              step={0.1}
              value={[settings.lectureSpeedFactor]}
              onValueChange={([value]) => updateSettings({ lectureSpeedFactor: value })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Playback speed used for target hours calculation
            </p>
          </div>

          <Separator />

          {/* Sleep Window */}
          <div className="space-y-3">
            <Label>Sleep Window (Local Time)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleep-start" className="text-xs text-muted-foreground">Start</Label>
                <Input
                  id="sleep-start"
                  type="time"
                  value={settings.sleepWindowStart}
                  onChange={(e) => updateSettings({ sleepWindowStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sleep-end" className="text-xs text-muted-foreground">End</Label>
                <Input
                  id="sleep-end"
                  type="time"
                  value={settings.sleepWindowEnd}
                  onChange={(e) => updateSettings({ sleepWindowEnd: e.target.value })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You'll be warned if you log study time during this window
            </p>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Show in-app warnings and alerts
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
            />
          </div>

          <Separator />

          {/* Chapter Card Size */}
          <div className="space-y-3">
            <Label>Chapter Card Size</Label>
            <ToggleGroup
              type="single"
              value={settings.chapterCardSize}
              onValueChange={(value) => value && updateSettings({ chapterCardSize: value as 'compact' | 'detailed' })}
              className="justify-start"
            >
              <ToggleGroupItem value="compact" aria-label="Compact view">
                Compact
              </ToggleGroupItem>
              <ToggleGroupItem value="detailed" aria-label="Detailed view">
                Detailed
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">
              Controls the density of chapter cards
            </p>
          </div>

          <Separator />

          {/* Auto Recalculate Date to Finish */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-recalc">Auto Recalculate Date</Label>
              <p className="text-xs text-muted-foreground">
                Automatically update date-to-finish based on settings
              </p>
            </div>
            <Switch
              id="auto-recalc"
              checked={settings.autoRecalculateDateToFinish}
              onCheckedChange={(checked) => updateSettings({ autoRecalculateDateToFinish: checked })}
            />
          </div>
        </div>

        <SheetFooter className="mt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Reset to Defaults
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset to Defaults?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will restore all settings to their default values. This action cannot be undone.
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
