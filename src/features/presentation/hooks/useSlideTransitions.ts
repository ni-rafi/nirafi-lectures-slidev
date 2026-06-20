import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { getSlideMetadata } from '../components/slides/SlideRenderer';
import type { Subject, Lecture } from '@/config/lectures';
import { DEFAULT_SETTINGS } from '../components/layers/SettingsPopover';

interface ViewTransitionHandle {
  ready: Promise<void>;
  finished: Promise<void>;
}

export const useSlideTransitions = (
  activeSub: Subject | undefined,
  activeLec: Lecture | undefined,
  settingsRef: React.RefObject<typeof DEFAULT_SETTINGS>
) => {
  const startSafeTransition = useCallback((updateFn: () => void) => {
    if (!document.startViewTransition) {
      updateFn();
      return;
    }
    const vt = document.startViewTransition(() => {
      flushSync(updateFn);
    }) as unknown as ViewTransitionHandle;
    vt.ready.catch(() => { });
    vt.finished.catch(() => { });
  }, []);

  const applyTransitionStyle = useCallback((nextSlideNum: number, direction: 'forward' | 'backward') => {
    const meta = activeSub && activeLec ? getSlideMetadata(nextSlideNum, activeSub, activeLec) : null;
    const resolvedTransition = meta?.transition || settingsRef.current.transitionType || 'morph';
    const duration = meta?.transitionDuration !== undefined
      ? meta.transitionDuration
      : (settingsRef.current.transitionDuration || 500);

    let oldAnim = 'morph-out';
    let newAnim = 'morph-in';

    if (resolvedTransition === 'slide') {
      if (direction === 'forward') {
        oldAnim = 'canvas-slide-out-left';
        newAnim = 'canvas-slide-in-right';
      } else {
        oldAnim = 'canvas-slide-out-right';
        newAnim = 'canvas-slide-in-left';
      }
    } else if (resolvedTransition === 'fade') {
      oldAnim = 'canvas-fade-out';
      newAnim = 'canvas-fade-in';
    } else if (resolvedTransition === 'zoom') {
      oldAnim = 'canvas-zoom-out';
      newAnim = 'canvas-zoom-in';
    } else if (resolvedTransition === 'none') {
      oldAnim = 'none';
      newAnim = 'none';
    }

    const docEl = document.documentElement;
    docEl.style.setProperty('--slide-canvas-duration', `${duration}ms`);
    docEl.style.setProperty('--slide-canvas-old-anim', oldAnim);
    docEl.style.setProperty('--slide-canvas-new-anim', newAnim);
  }, [activeSub, activeLec, settingsRef]);

  return { startSafeTransition, applyTransitionStyle };
};
