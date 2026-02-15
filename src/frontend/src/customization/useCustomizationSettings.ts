import { useState, useEffect, useCallback } from 'react';
import { type CustomizationSettings, DEFAULT_SETTINGS, validateSettings } from './settingsModel';

const STORAGE_KEY = 'jee-backlog-warrior-settings';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  settings: CustomizationSettings;
}

function loadSettings(): CustomizationSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    
    const data: StorageData = JSON.parse(stored);
    if (data.version !== STORAGE_VERSION) {
      return DEFAULT_SETTINGS;
    }
    
    return validateSettings(data.settings);
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: CustomizationSettings): void {
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      settings,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function useCustomizationSettings() {
  const [settings, setSettings] = useState<CustomizationSettings>(loadSettings);

  const updateSettings = useCallback((updates: Partial<CustomizationSettings>) => {
    setSettings(prev => {
      const newSettings = validateSettings({ ...prev, ...updates });
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    resetToDefaults,
  };
}
