import React from 'react';
import Draggable from '../Draggable';
import DraggableArrow from '../DraggableArrow';

export const SlideDraggable: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start text-left px-8 py-10">
      <div className="max-w-md flex flex-col gap-1.5 mb-2 select-none">
        <h3 className="text-xl font-bold text-foreground">
          Slide 3: Interactive Positioning Elements
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Draggable widgets let presenters draw overlays, arrange structural diagrams, or nudge labels dynamically inside the canvas sandbox.
        </p>
      </div>

      <DraggableArrow initialPos={{ x: 80, y: 220, w: 180, h: 40 }} />
      
      <Draggable
        initialPos={{ x: 400, y: 160, w: 220, h: 100 }}
        className="p-4 border bg-amber-500/10 border-amber-500/30 text-amber-500 rounded-xl text-xs flex flex-col justify-center items-center shadow-md select-none"
      >
        <span className="font-bold text-[10px] uppercase font-mono tracking-wider mb-1">
          Draggable Box Widget
        </span>
        <span className="text-center leading-normal text-muted-foreground">
          Grab me to slide, or double-click to select and nudge with Arrow keys!
        </span>
      </Draggable>
    </div>
  );
};

export default SlideDraggable;
