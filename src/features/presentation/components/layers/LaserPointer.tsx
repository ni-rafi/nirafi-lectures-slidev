import React, { useEffect, useState } from 'react';

interface LaserPointerProps {
  active: boolean;
}

/**
 * LaserPointer tracks cursor movement when enabled, hides the browser's standard cursor,
 * and renders a glowing red dot to act as a presenter laser pointer.
 */
export const LaserPointer: React.FC<LaserPointerProps> = ({ active }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Hide default cursor across the body
    document.body.classList.add('cursor-none');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.classList.remove('cursor-none');
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
      }}
    >
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/30 blur-[2px] animate-pulse" />
      
      {/* Inner Bright Laser Point */}
      <div className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444,0_0_20px_#ef4444]" />
    </div>
  );
};

export default LaserPointer;
