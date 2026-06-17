import { useEffect } from 'react';

interface ShortcutProps {
  onNext: () => void;
  onPrev: () => void;
  onToggleFullscreen: () => void;
  onToggleOverview: () => void;
  onToggleDark: () => void;
  onTogglePresenter?: () => void;
}

/**
 * useNavShortcuts binds presentation keyboard binds.
 */
export const useNavShortcuts = ({
  onNext,
  onPrev,
  onToggleFullscreen,
  onToggleOverview,
  onToggleDark,
  onTogglePresenter,
}: ShortcutProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        onToggleFullscreen();
      } else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        onToggleOverview();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        onToggleDark();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        onTogglePresenter?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onToggleFullscreen, onToggleOverview, onToggleDark, onTogglePresenter]);
};

export default useNavShortcuts;
