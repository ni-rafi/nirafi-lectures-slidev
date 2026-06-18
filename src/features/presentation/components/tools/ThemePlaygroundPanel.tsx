import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, RotateCcw, Save, Sliders, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSlideTheme, ThemeValues } from '../../context/SlideThemeContext';
import { useUserContext } from '@/context/UserContext';

// Import granular sub-components
import PlaygroundBackgroundSelector from './playground/PlaygroundBackgroundSelector';
import PlaygroundHueSlider from './playground/PlaygroundHueSlider';
import PlaygroundBorderSelector from './playground/PlaygroundBorderSelector';
import PlaygroundHeaderSizeSelector from './playground/PlaygroundHeaderSizeSelector';
import PlaygroundFontSelector from './playground/PlaygroundFontSelector';
import PlaygroundBulletSelector from './playground/PlaygroundBulletSelector';
import PlaygroundEquationSelector from './playground/PlaygroundEquationSelector';
import PlaygroundFooterSelector from './playground/PlaygroundFooterSelector';
import PlaygroundGeometrySelector from './playground/PlaygroundGeometrySelector';

interface ThemePlaygroundPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isInline?: boolean;
}

export const ThemePlaygroundPanel: React.FC<ThemePlaygroundPanelProps> = ({
  isOpen,
  onClose,
  isInline = false,
}) => {
  const {
    resolvedTheme,
    isLocked,
    lockedLevel,
    tempThemeOverrides,
    setTempThemeOverrides,
    saveTheme,
    resetTheme,
  } = useSlideTheme();

  const userContext = useUserContext();
  const isAdmin = userContext.userProfile?.role === 'admin';
  const canEdit = !isLocked || isAdmin;

  const [scope, setScope] = useState<'lecture' | 'subject' | 'global'>('lecture');
  const [adminLockCheck, setAdminLockCheck] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const activeSettings = {
    ...resolvedTheme,
    ...(tempThemeOverrides || {}),
  };

  useEffect(() => {
    if (isLocked) {
      setAdminLockCheck(true);
    }
  }, [isLocked]);

  if (!isOpen) return null;

  const updateVal = <K extends keyof ThemeValues>(key: K, val: ThemeValues[K]) => {
    if (!canEdit) return;
    setTempThemeOverrides((prev) => ({
      ...(prev || {}),
      [key]: val,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveTheme(scope, isAdmin ? adminLockCheck : false);
      onClose();
    } catch (e) {
      console.error('[ThemePlaygroundPanel] Save failed', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm(`Are you sure you want to reset customizations for the selected level: ${scope}?`)) {
      return;
    }
    try {
      setIsSaving(true);
      await resetTheme(scope);
      onClose();
    } catch (e) {
      console.error('[ThemePlaygroundPanel] Reset failed', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setTempThemeOverrides(null);
    onClose();
  };

  const containerClass = isInline
    ? 'relative flex h-full w-full flex-col bg-background/95 select-none text-xs text-foreground'
    : 'fixed inset-y-0 right-0 z-50 flex w-[380px] flex-col border-l border-border bg-background/95 shadow-2xl backdrop-blur-md select-none text-xs text-foreground animate-in slide-in-from-right duration-300';

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <span className="flex items-center gap-2 font-bold text-sm text-foreground">
          <Sliders className="h-4 w-4 text-primary" /> Slide Theme Builder
        </span>
        <button
          onClick={handleDiscard}
          className="rounded-sm opacity-70 hover:opacity-100 hover:bg-accent p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Theme Lock Alert Badge */}
      {isLocked && (
        <div className="flex items-start gap-2.5 bg-destructive/10 border-b border-destructive/20 px-5 py-3.5 text-destructive">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Locked by Admin</p>
            <p className="text-[10px] opacity-85 mt-0.5">
              Custom styling is currently locked at the <strong>{lockedLevel}</strong> level.
              {isAdmin ? " As an administrator, you may modify and unlock it." : " Student overrides are disabled."}
            </p>
          </div>
        </div>
      )}

      {/* Form Fields Section */}
      <div className={`flex-1 overflow-y-auto px-5 py-4 space-y-5 ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}>
        
        <PlaygroundBackgroundSelector
          bgType={activeSettings.bgType}
          customBgValue={activeSettings.customBgValue}
          onBgTypeChange={(type) => updateVal('bgType', type)}
          onCustomBgValueChange={(val) => updateVal('customBgValue', val)}
          disabled={!canEdit}
        />

        <PlaygroundHueSlider
          value={activeSettings.accentHue}
          onChange={(hue) => updateVal('accentHue', hue)}
          disabled={!canEdit}
        />

        <PlaygroundBorderSelector
          value={activeSettings.borderSide}
          onChange={(side) => updateVal('borderSide', side)}
          disabled={!canEdit}
        />

        <PlaygroundHeaderSizeSelector
          value={activeSettings.headerFontSize}
          onChange={(size) => updateVal('headerFontSize', size)}
          disabled={!canEdit}
        />

        <PlaygroundFontSelector
          fontSans={activeSettings.fontSans}
          fontHeader={activeSettings.fontHeader}
          onSansChange={(font) => updateVal('fontSans', font)}
          onHeaderChange={(font) => updateVal('fontHeader', font)}
          disabled={!canEdit}
        />

        <PlaygroundBulletSelector
          value={activeSettings.bulletStyle}
          onChange={(bullet) => updateVal('bulletStyle', bullet)}
          disabled={!canEdit}
        />

        <PlaygroundEquationSelector
          value={activeSettings.equationBg}
          onChange={(bg) => updateVal('equationBg', bg)}
          disabled={!canEdit}
        />

        <PlaygroundFooterSelector
          value={activeSettings.footerStyle}
          onChange={(footer) => updateVal('footerStyle', footer)}
          disabled={!canEdit}
        />

        <PlaygroundGeometrySelector
          value={activeSettings.borderRadius}
          onChange={(radius) => updateVal('borderRadius', radius)}
          disabled={!canEdit}
        />
      </div>

      {/* Save Settings and Actions Footer panel */}
      <div className="border-t bg-background px-5 py-4 space-y-3">
        <div className="space-y-2.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Save Customization Scope</label>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-accent/40 p-0.5">
              {(['lecture', 'subject', 'global'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setScope(level)}
                  className={`rounded-md py-1.5 text-center font-medium capitalize transition-all ${
                    scope === level ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {isAdmin && (
            <label className="flex items-center justify-between cursor-pointer border rounded-md p-2 bg-muted/20 hover:bg-muted/40 transition-colors">
              <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {adminLockCheck ? <Lock className="h-3 w-3 text-destructive" /> : <Unlock className="h-3 w-3 text-muted-foreground" />}
                Lock Settings for Students
              </span>
              <input
                type="checkbox"
                checked={adminLockCheck}
                disabled={!canEdit}
                onChange={(e) => setAdminLockCheck(e.target.checked)}
                className="h-3.5 w-7 cursor-pointer appearance-none rounded-full bg-muted checked:bg-primary relative before:absolute before:h-2.5 before:w-2.5 before:rounded-full before:bg-background before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {canEdit && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-semibold"
            >
              <Save className="h-3.5 w-3.5" /> {isSaving ? 'Saving...' : 'Apply & Save Styles'}
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-destructive border-border"
              title="Reset configurations"
            >
              <RotateCcw className="h-3 w-3" /> Reset {scope}
            </Button>
            <Button
              variant="ghost"
              onClick={handleDiscard}
              disabled={isSaving}
              className="flex-1 text-[10px] text-muted-foreground hover:text-foreground border border-transparent"
            >
              Discard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePlaygroundPanel;
