import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { useUserContext } from '@/context';
import type { ThemeConfigPayload, ThemePreferences } from '@/services/firebase/IFirebaseService';
import useGoogleFontLoader from '../hooks/useGoogleFontLoader';

export interface ThemeValues {
  accentHue: number;
  fontSans: string;
  fontHeader: string;
  borderRadius: number;
  bulletStyle: 'dot' | 'square' | 'check' | 'chevron' | 'arrow' | 'dash';
  equationBg: 'default' | 'none' | 'tinted' | 'bordered';
  footerStyle: 'fraction' | 'prefixed' | 'progress-bar' | 'hidden';
  bgType: 'solid' | 'gradient' | 'custom';
  customBgValue: string;
  borderSide: 'all' | 'left' | 'bottom';
  headerFontSize: number;
}

export const DEFAULT_THEME_VALUES: ThemeValues = {
  accentHue: 220,
  fontSans: 'Montserrat',
  fontHeader: 'Raleway',
  borderRadius: 0,
  bulletStyle: 'chevron',
  equationBg: 'default',
  footerStyle: 'fraction',
  bgType: 'solid',
  customBgValue: '',
  borderSide: 'left',
  headerFontSize: 30,
};

const getDefaultHueForSubject = () => {
  return 220;
};

interface SlideThemeContextType {
  resolvedTheme: ThemeValues;
  isLocked: boolean;
  lockedLevel: 'lecture' | 'subject' | 'global' | null;
  tempThemeOverrides: Partial<ThemeValues> | null;
  setTempThemeOverrides: React.Dispatch<React.SetStateAction<Partial<ThemeValues> | null>>;
  saveTheme: (level: 'lecture' | 'subject' | 'global', lock?: boolean) => Promise<void>;
  resetTheme: (level: 'lecture' | 'subject' | 'global') => Promise<void>;
  isLoading: boolean;
}

const SlideThemeContext = createContext<SlideThemeContextType | null>(null);

export const useSlideTheme = (): SlideThemeContextType => {
  const context = useContext(SlideThemeContext);
  if (!context) {
    throw new Error('useSlideTheme must be used within a SlideThemeProvider');
  }
  return context;
};

interface SlideThemeProviderProps {
  subjectId: string;
  lectureId: string;
  children: React.ReactNode;
}

export const SlideThemeProvider: React.FC<SlideThemeProviderProps> = ({
  subjectId,
  lectureId,
  children,
}) => {
  const firebaseService = useFirebase();
  const userContext = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [tempThemeOverrides, setTempThemeOverrides] = useState<Partial<ThemeValues> | null>(null);

  const [adminConfigs, setAdminConfigs] = useState<{
    lecture: ThemeConfigPayload | null;
    subject: ThemeConfigPayload | null;
    global: ThemeConfigPayload | null;
  }>({ lecture: null, subject: null, global: null });

  const loadAdminConfigs = useCallback(async () => {
    try {
      setIsLoading(true);
      const [lectureDoc, subjectDoc, globalDoc] = await Promise.all([
        firebaseService.getThemeConfig(`lecture:${lectureId}`),
        firebaseService.getThemeConfig(`subject:${subjectId}`),
        firebaseService.getThemeConfig(`global`),
      ]);
      setAdminConfigs({
        lecture: lectureDoc,
        subject: subjectDoc,
        global: globalDoc,
      });
    } catch (e) {
      console.error('[SlideThemeContext] Failed to load shared admin configs', e);
    } finally {
      setIsLoading(false);
    }
  }, [subjectId, lectureId, firebaseService]);

  useEffect(() => {
    loadAdminConfigs();
  }, [loadAdminConfigs]);

  // One-time client migration to clear older mock themes & profile caches in localStorage,
  // ensuring the new defaults (left edge and 30px size) are loaded correctly.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const migratedKey = 'cee_theme_migrated_to_left_33';
      if (!window.localStorage.getItem(migratedKey)) {
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key && (key.startsWith('offline_theme_') || key === 'offline_student_profile')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((k) => window.localStorage.removeItem(k));
          window.localStorage.setItem(migratedKey, 'true');
          window.location.reload();
        } catch (e) {
          console.error('[SlideThemeContext] Failed to run theme migration cleanup', e);
        }
      }
    }
  }, []);

  const resolvedInfo = useMemo(() => {
    let activeLock: ThemeConfigPayload | null = null;
    let lockedLevel: 'lecture' | 'subject' | 'global' | null = null;

    if (adminConfigs.lecture?.isLocked) {
      activeLock = adminConfigs.lecture;
      lockedLevel = 'lecture';
    } else if (adminConfigs.subject?.isLocked) {
      activeLock = adminConfigs.subject;
      lockedLevel = 'subject';
    } else if (adminConfigs.global?.isLocked) {
      activeLock = adminConfigs.global;
      lockedLevel = 'global';
    }

    const defaultHue = getDefaultHueForSubject();
    const baseDefaults: ThemeValues = {
      ...DEFAULT_THEME_VALUES,
      accentHue: defaultHue,
    };

    if (activeLock) {
      const lockedTheme: ThemeValues = {
        accentHue: activeLock.accentHue ?? baseDefaults.accentHue,
        fontSans: activeLock.fontSans || baseDefaults.fontSans,
        fontHeader: activeLock.fontHeader || baseDefaults.fontHeader,
        borderRadius: activeLock.borderRadius ?? baseDefaults.borderRadius,
        bulletStyle: activeLock.bulletStyle || baseDefaults.bulletStyle,
        equationBg: activeLock.equationBg || baseDefaults.equationBg,
        footerStyle: activeLock.footerStyle || baseDefaults.footerStyle,
        bgType: activeLock.bgType || baseDefaults.bgType,
        customBgValue: activeLock.customBgValue ?? baseDefaults.customBgValue,
        borderSide: activeLock.borderSide || baseDefaults.borderSide,
        headerFontSize: activeLock.headerFontSize ?? baseDefaults.headerFontSize,
      };
      return { resolvedTheme: lockedTheme, isLocked: true, lockedLevel };
    }

    const prefs = userContext.userProfile?.themePreferences || {};
    const studentLecture = prefs[`lecture:${lectureId}`];
    const studentSubject = prefs[`subject:${subjectId}`];
    const studentGlobal = prefs[`global`];

    const adminLecture = adminConfigs.lecture;
    const adminSubject = adminConfigs.subject;
    const adminGlobal = adminConfigs.global;

    const getVal = <K extends keyof ThemeValues>(key: K): ThemeValues[K] => {
      if (tempThemeOverrides && tempThemeOverrides[key] !== undefined) {
        return tempThemeOverrides[key] as ThemeValues[K];
      }
      if (studentLecture && studentLecture[key] !== undefined) return studentLecture[key] as ThemeValues[K];
      if (studentSubject && studentSubject[key] !== undefined) return studentSubject[key] as ThemeValues[K];
      if (studentGlobal && studentGlobal[key] !== undefined) return studentGlobal[key] as ThemeValues[K];

      if (adminLecture && adminLecture[key] !== undefined) return adminLecture[key] as ThemeValues[K];
      if (adminSubject && adminSubject[key] !== undefined) return adminSubject[key] as ThemeValues[K];
      if (adminGlobal && adminGlobal[key] !== undefined) return adminGlobal[key] as ThemeValues[K];

      return baseDefaults[key];
    };

    const mergedTheme: ThemeValues = {
      accentHue: getVal('accentHue'),
      fontSans: getVal('fontSans'),
      fontHeader: getVal('fontHeader'),
      borderRadius: getVal('borderRadius'),
      bulletStyle: getVal('bulletStyle'),
      equationBg: getVal('equationBg'),
      footerStyle: getVal('footerStyle'),
      bgType: getVal('bgType'),
      customBgValue: getVal('customBgValue'),
      borderSide: getVal('borderSide'),
      headerFontSize: getVal('headerFontSize'),
    };

    return { resolvedTheme: mergedTheme, isLocked: false, lockedLevel: null };
  }, [adminConfigs, userContext.userProfile, tempThemeOverrides, subjectId, lectureId]);

  useGoogleFontLoader(resolvedInfo.resolvedTheme.fontSans, resolvedInfo.resolvedTheme.fontHeader);

  const saveTheme = useCallback(
    async (level: 'lecture' | 'subject' | 'global', lock = false) => {
      const payloadValues = tempThemeOverrides
        ? { ...resolvedInfo.resolvedTheme, ...tempThemeOverrides }
        : resolvedInfo.resolvedTheme;
      const key = level === 'lecture' ? `lecture:${lectureId}` : level === 'subject' ? `subject:${subjectId}` : 'global';

      const isAdmin = userContext.userProfile?.role === 'admin';

      if (isAdmin) {
        await firebaseService.setThemeConfig(key, {
          isLocked: lock,
          accentHue: payloadValues.accentHue,
          fontSans: payloadValues.fontSans,
          fontHeader: payloadValues.fontHeader,
          borderRadius: payloadValues.borderRadius,
          bulletStyle: payloadValues.bulletStyle,
          equationBg: payloadValues.equationBg,
          footerStyle: payloadValues.footerStyle,
          bgType: payloadValues.bgType,
          customBgValue: payloadValues.customBgValue,
          borderSide: payloadValues.borderSide,
          headerFontSize: payloadValues.headerFontSize,
          updatedAt: Date.now(),
        });
        await loadAdminConfigs();
      } else {
        const studentPrefs: ThemePreferences = {
          accentHue: payloadValues.accentHue,
          fontSans: payloadValues.fontSans,
          fontHeader: payloadValues.fontHeader,
          borderRadius: payloadValues.borderRadius,
          bulletStyle: payloadValues.bulletStyle,
          equationBg: payloadValues.equationBg,
          footerStyle: payloadValues.footerStyle,
          bgType: payloadValues.bgType,
          customBgValue: payloadValues.customBgValue,
          borderSide: payloadValues.borderSide,
          headerFontSize: payloadValues.headerFontSize,
          updatedAt: Date.now(),
        };
        await userContext.updateThemePreferences(key, studentPrefs);
      }
      setTempThemeOverrides(null);
    },
    [
      lectureId,
      subjectId,
      tempThemeOverrides,
      resolvedInfo.resolvedTheme,
      userContext,
      firebaseService,
      loadAdminConfigs,
    ]
  );

  const resetTheme = useCallback(
    async (level: 'lecture' | 'subject' | 'global') => {
      const key = level === 'lecture' ? `lecture:${lectureId}` : level === 'subject' ? `subject:${subjectId}` : 'global';
      const isAdmin = userContext.userProfile?.role === 'admin';

      if (isAdmin) {
        await firebaseService.deleteThemeConfig(key);
        await loadAdminConfigs();
      } else {
        await userContext.updateThemePreferences(key, null);
      }
      setTempThemeOverrides(null);
    },
    [lectureId, subjectId, userContext, firebaseService, loadAdminConfigs]
  );

  const contextValue = useMemo(
    () => ({
      resolvedTheme: resolvedInfo.resolvedTheme,
      isLocked: resolvedInfo.isLocked,
      lockedLevel: resolvedInfo.lockedLevel,
      tempThemeOverrides,
      setTempThemeOverrides,
      saveTheme,
      resetTheme,
      isLoading,
    }),
    [resolvedInfo, tempThemeOverrides, saveTheme, resetTheme, isLoading]
  );

  return (
    <SlideThemeContext.Provider value={contextValue}>
      {children}
    </SlideThemeContext.Provider>
  );
};
