import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { VisualCanvasShape, PhysicalUnit } from '../../../types/schema';

// Import subcomponents
import ShapeBuilderHeader from './ShapeBuilderHeader';
import ShapeBuilderToolbar from './ShapeBuilderToolbar';
import ShapeBuilderInspector from './ShapeBuilderInspector';
import ShapeBuilderCanvas from './ShapeBuilderCanvas';
import ShapeBuilderPageTabs from './ShapeBuilderPageTabs';
import { usePlaygroundData } from './usePlaygroundData';

export const ShapeBuilderPlayground: React.FC = () => {
  const { subjectId, sessionId, lectureId } = useParams<{
    subjectId: string;
    sessionId: string;
    lectureId: string;
  }>();

  // Scoped hook to handle all Firestore and page state operations
  const {
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
  } = usePlaygroundData(
    subjectId || 'quantity-surveying',
    sessionId || 'session-2026',
    lectureId || 'lecture-1-concrete'
  );

  const elements = activePage.elements;
  const scaleFactor = activePage.scaleFactor;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [simulatedClick, setSimulatedClick] = useState(1);
  const [activePopover, setActivePopover] = useState<{
    elementId: string;
    key: 'length' | 'height' | 'diameter' | 'diagonal1' | 'diagonal2';
    val: number;
    clientX: number;
    clientY: number;
  } | null>(null);

  const selectedEl = useMemo(
    () => elements.find((el) => el.id === selectedId) || null,
    [elements, selectedId]
  );

  const addElement = (type: VisualCanvasShape['type']) => {
    const defaultDims =
      type === 'circle'
        ? { diameter: 1.0 }
        : type === 'triangle'
        ? { length: 2.0, height: 1.5 }
        : type === 'rhombus'
        ? { diagonal1: 2.0, diagonal2: 1.5 }
        : { length: 2.0, height: 0.4 };

    const w = type === 'circle' ? 150 : 200;
    const h = type === 'circle' ? 150 : type === 'triangle' ? 150 : 80;

    const newEl: VisualCanvasShape = {
      id: `${type}-${Date.now()}`,
      type,
      x: 200,
      y: 150,
      w,
      h,
      fill: 'color-mix(in srgb, var(--primary) 15%, transparent)',
      stroke: 'var(--primary)',
      strokeWidth: 2,
      enterAt: 1,
      showDimensionLines: true,
      dimensions: defaultDims,
      label: `${type.toUpperCase()}`,
    };

    const updated = [...elements, newEl];
    updateActivePageElements(updated);
    setSelectedId(newEl.id);
  };

  const updateSelected = (key: keyof VisualCanvasShape, val: any) => {
    if (!selectedId) return;
    const updated = elements.map((el) => {
      if (el.id !== selectedId) return el;
      const updatedEl = { ...el, [key]: val };

      if (key === 'w' && updatedEl.dimensions) {
        const u = updatedEl.dimensions;
        if (updatedEl.type === 'circle') {
          u.diameter = parseFloat((updatedEl.w / scaleFactor.pixelsPerUnit).toFixed(3));
        } else {
          u.length = parseFloat((updatedEl.w / scaleFactor.pixelsPerUnit).toFixed(3));
        }
      }
      if (key === 'h' && updatedEl.dimensions) {
        const u = updatedEl.dimensions;
        if (updatedEl.type !== 'circle') {
          u.height = parseFloat((updatedEl.h / scaleFactor.pixelsPerUnit).toFixed(3));
        }
      }
      return updatedEl;
    });
    updateActivePageElements(updated);
  };

  const updateSelectedDimensions = (dimKey: string, val: number) => {
    if (!selectedId || !selectedEl) return;
    const updated = elements.map((el) => {
      if (el.id !== selectedId) return el;
      const updatedDims = { ...(el.dimensions || {}), [dimKey]: val };
      const updatedEl = { ...el, dimensions: updatedDims };

      if (dimKey === 'diameter') {
        const px = val * scaleFactor.pixelsPerUnit;
        updatedEl.w = px;
        updatedEl.h = px;
      } else if (dimKey === 'length') {
        updatedEl.w = val * scaleFactor.pixelsPerUnit;
      } else if (dimKey === 'height') {
        updatedEl.h = val * scaleFactor.pixelsPerUnit;
      }
      return updatedEl;
    });
    updateActivePageElements(updated);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    updateActivePageElements(elements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const handleLabelClick = (
    elId: string,
    key: 'length' | 'height' | 'diameter' | 'diagonal1' | 'diagonal2',
    val: number,
    clientX: number,
    clientY: number
  ) => {
    setActivePopover({ elementId: elId, key, val, clientX, clientY });
  };

  const submitPopoverValue = (val: number) => {
    if (!activePopover) return;
    const { elementId, key } = activePopover;
    const updated = elements.map((el) => {
      if (el.id !== elementId) return el;
      const updatedDims = { ...(el.dimensions || {}), [key]: val };
      const updatedEl = { ...el, dimensions: updatedDims };

      if (key === 'diameter') {
        const px = val * scaleFactor.pixelsPerUnit;
        updatedEl.w = px;
        updatedEl.h = px;
      } else if (key === 'length') {
        updatedEl.w = val * scaleFactor.pixelsPerUnit;
      } else if (key === 'height') {
        updatedEl.h = val * scaleFactor.pixelsPerUnit;
      }
      return updatedEl;
    });
    updateActivePageElements(updated);
    setActivePopover(null);
  };

  const exportSchema = useMemo(() => {
    const formatted = {
      type: 'visual-canvas',
      config: { scaleFactor },
      data: { elements },
    };
    return JSON.stringify(formatted, null, 2);
  }, [elements, scaleFactor]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportSchema);
    alert('Schema copied to clipboard successfully!');
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 text-slate-100 font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs text-muted-foreground font-semibold">Loading designer canvas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <ShapeBuilderHeader
        scaleFactor={scaleFactor}
        onScaleFactorChange={updateActivePageScaleFactor}
        simulatedClick={simulatedClick}
        onSimulatedClickChange={setSimulatedClick}
        onCopy={copyToClipboard}
      />

      <ShapeBuilderPageTabs
        pages={pages}
        activeIndex={activeIndex}
        savingStatus={savingStatus}
        onSelectPage={setActiveIndex}
        onAddPage={addPage}
        onDuplicatePage={duplicatePage}
        onDeletePage={deletePage}
        onRenamePage={renamePage}
      />

      <div className="flex-1 flex overflow-hidden">
        <ShapeBuilderToolbar onAddElement={addElement} />

        <ShapeBuilderCanvas
          elements={elements}
          scaleFactor={scaleFactor}
          selectedId={selectedId}
          simulatedClick={simulatedClick}
          activePopover={activePopover}
          onElementsChange={updateActivePageElements}
          onSelectedIdChange={setSelectedId}
          onLabelClick={handleLabelClick}
          onSubmitPopoverValue={submitPopoverValue}
          onClosePopover={() => setActivePopover(null)}
        />

        <ShapeBuilderInspector
          selectedEl={selectedEl}
          scaleFactor={scaleFactor}
          exportSchema={exportSchema}
          onUpdateSelected={updateSelected}
          onUpdateSelectedDimensions={updateSelectedDimensions}
          onDeleteSelected={deleteSelected}
        />
      </div>
    </div>
  );
};

export default ShapeBuilderPlayground;
