import React from 'react';
import ClickRevealGroup from '../ClickRevealGroup';

interface SlideConceptsProps {
  slideNo: number;
}

export const SlideConcepts: React.FC<SlideConceptsProps> = ({ slideNo }) => {
  return (
    <div className="flex flex-col gap-4 animate-fade-in w-full text-left max-w-xl">
      <h3 className="text-xl font-bold text-foreground">
        Slide {slideNo}: Core Concepts
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
      </p>
      
      <ClickRevealGroup
        preset="up"
        className="list-disc pl-5 text-xs text-muted-foreground/90 flex flex-col gap-1.5"
      >
        <li>Volumetric estimation equations in meters</li>
        <li>Allowance parameters for wastage coefficients</li>
        <li>Interactive formulas testing</li>
      </ClickRevealGroup>
    </div>
  );
};

export default SlideConcepts;
