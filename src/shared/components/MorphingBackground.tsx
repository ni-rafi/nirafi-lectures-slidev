import React from 'react';

interface MorphingBackgroundProps {
  variant?: 'default' | 'calculation' | 'gallery' | 'cover';
}

/**
 * MorphingBackground is kept for layout compatibility, but renders
 * a completely transparent container to let the slide backdrop background flow.
 */
export const MorphingBackground: React.FC<MorphingBackgroundProps> = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-transparent" />
  );
};

export default MorphingBackground;
