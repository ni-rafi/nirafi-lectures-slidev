import { useState, useEffect, useRef } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { PlaygroundPage, VisualCanvasShape, PhysicalUnit } from '../../../types/schema';

const DEFAULT_PAGE_DATA: PlaygroundPage = {
  id: 'page-1',
  name: 'Page 1',
  elements: [
    {
      id: 'beam-1',
      type: 'rect',
      x: 150,
      y: 200,
      w: 600,
      h: 60,
      fill: 'color-mix(in srgb, var(--primary) 15%, transparent)',
      stroke: 'var(--primary)',
      strokeWidth: 2,
      enterAt: 1,
      showDimensionLines: true,
      dimensions: { length: 4.0, height: 0.4 },
      label: 'Concrete Beam B1',
    },
  ],
  scaleFactor: {
    pixelsPerUnit: 150,
    unit: 'm',
  },
};

export const usePlaygroundData = (
  subjectId: string,
  sessionId: string,
  lectureId: string
) => {
  const firebaseService = useFirebase();
  const id = `${subjectId}:${sessionId}:${lectureId}`;

  const [pages, setPages] = useState<PlaygroundPage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [savingStatus, setSavingStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isLoading, setIsLoading] = useState(true);

  const isInitialLoad = useRef(true);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial data
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        isInitialLoad.current = true;
        const res = await firebaseService.getPlaygroundCanvas(id);
        if (!active) return;

        if (res && res.pages && res.pages.length > 0) {
          setPages(res.pages);
        } else {
          setPages([DEFAULT_PAGE_DATA]);
        }
      } catch (e) {
        console.error('[usePlaygroundData] Fetch error:', e);
        if (active) setPages([DEFAULT_PAGE_DATA]);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, firebaseService]);

  // Debounced Autosave
  useEffect(() => {
    // Skip saving on initial mount/data load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (pages.length === 0) return;

    setSavingStatus('saving');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        await firebaseService.setPlaygroundCanvas(id, {
          pages,
          updatedAt: Date.now(),
        });
        setSavingStatus('saved');
      } catch (e) {
        console.error('[usePlaygroundData] Autosave failed:', e);
        setSavingStatus('error');
      }
    }, 1500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [pages, id, firebaseService]);

  const activePage = pages[activeIndex] || DEFAULT_PAGE_DATA;

  const addPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPage: PlaygroundPage = {
      id: newPageId,
      name: `Page ${pages.length + 1}`,
      elements: [],
      scaleFactor: { pixelsPerUnit: 150, unit: 'm' },
    };
    const updated = [...pages, newPage];
    setPages(updated);
    setActiveIndex(updated.length - 1);
  };

  const duplicatePage = () => {
    const current = pages[activeIndex] || DEFAULT_PAGE_DATA;
    const newPageId = `page-${Date.now()}`;
    const newPage: PlaygroundPage = {
      id: newPageId,
      name: `${current.name} (Copy)`,
      elements: current.elements.map((el) => ({ ...el, id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` })),
      scaleFactor: { ...current.scaleFactor },
    };
    const updated = [...pages];
    updated.splice(activeIndex + 1, 0, newPage);
    setPages(updated);
    setActiveIndex(activeIndex + 1);
  };

  const deletePage = () => {
    if (pages.length <= 1) return;
    const updated = pages.filter((_, idx) => idx !== activeIndex);
    setPages(updated);
    setActiveIndex(Math.max(0, activeIndex - 1));
  };

  const renamePage = (index: number, newName: string) => {
    if (!newName.trim()) return;
    setPages((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, name: newName.trim() } : p))
    );
  };

  const updateActivePageElements = (newElements: VisualCanvasShape[]) => {
    setPages((prev) =>
      prev.map((p, idx) => (idx === activeIndex ? { ...p, elements: newElements } : p))
    );
  };

  const updateActivePageScaleFactor = (sf: { pixelsPerUnit: number; unit: PhysicalUnit }) => {
    setPages((prev) =>
      prev.map((p, idx) => (idx === activeIndex ? { ...p, scaleFactor: sf } : p))
    );
  };

  return {
    pages,
    activeIndex,
    activePage,
    savingStatus,
    isLoading,
    setActiveIndex,
    addPage,
    duplicatePage,
    deletePage,
    renamePage,
    updateActivePageElements,
    updateActivePageScaleFactor,
  };
};
