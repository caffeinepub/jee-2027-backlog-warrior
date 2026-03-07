import { createContext, useContext, type ReactNode, useState } from 'react';
import { useCustomizationSettings } from './useCustomizationSettings';
import { type CustomizationSettings } from './settingsModel';
import { useEffect } from 'react';
import { applyDarkModeOverride } from './applyDarkModeOverride';

interface CustomizationContextValue {
  settings: CustomizationSettings;
  updateSettings: (updates: Partial<CustomizationSettings>) => void;
  resetToDefaults: () => void;
  draftSettings?: CustomizationSettings;
  setDraftSettings?: (settings: CustomizationSettings) => void;
}

const CustomizationContext = createContext<CustomizationContextValue | undefined>(undefined);

export function CustomizationProvider({ children }: { children: ReactNode }) {
  const customization = useCustomizationSettings();
  const [draftSettings, setDraftSettings] = useState<CustomizationSettings | undefined>(undefined);

  useEffect(() => {
    applyDarkModeOverride(customization.settings.darkModeOverride);
  }, [customization.settings.darkModeOverride]);

  const contextValue: CustomizationContextValue = {
    ...customization,
    draftSettings,
    setDraftSettings,
  };

  return (
    <CustomizationContext.Provider value={contextValue}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within CustomizationProvider');
  }
  return context;
}
