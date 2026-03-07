import { useState, useEffect, useCallback } from 'react';
import { type CustomizationSettings, validateSettings } from './settingsModel';

const PRESETS_STORAGE_KEY = 'jee-backlog-warrior-presets';
const PRESETS_VERSION = 1;

interface Preset {
  name: string;
  settings: CustomizationSettings;
}

interface PresetsStorage {
  version: number;
  presets: Preset[];
}

function loadPresets(): Preset[] {
  try {
    const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!stored) return [];
    
    const data: PresetsStorage = JSON.parse(stored);
    if (data.version !== PRESETS_VERSION) {
      return [];
    }
    
    return data.presets.map(preset => ({
      name: preset.name,
      settings: validateSettings(preset.settings),
    }));
  } catch (error) {
    console.error('Failed to load presets:', error);
    return [];
  }
}

function savePresetsToStorage(presets: Preset[]): void {
  try {
    const data: PresetsStorage = {
      version: PRESETS_VERSION,
      presets,
    };
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save presets:', error);
  }
}

export function useCustomizationPresets() {
  const [presets, setPresets] = useState<Preset[]>(loadPresets);

  const savePreset = useCallback((name: string, settings: CustomizationSettings) => {
    setPresets(prev => {
      const filtered = prev.filter(p => p.name !== name);
      const updated = [...filtered, { name, settings: validateSettings(settings) }];
      savePresetsToStorage(updated);
      return updated;
    });
  }, []);

  const applyPreset = useCallback((name: string): CustomizationSettings | null => {
    const preset = presets.find(p => p.name === name);
    return preset ? preset.settings : null;
  }, [presets]);

  const deletePreset = useCallback((name: string) => {
    setPresets(prev => {
      const updated = prev.filter(p => p.name !== name);
      savePresetsToStorage(updated);
      return updated;
    });
  }, []);

  return {
    presets,
    savePreset,
    applyPreset,
    deletePreset,
  };
}
