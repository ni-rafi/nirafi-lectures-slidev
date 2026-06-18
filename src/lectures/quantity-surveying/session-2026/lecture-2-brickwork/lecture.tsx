import React, { useState } from 'react';
import { TitleLayout } from '@/shared/layouts/TitleLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { calculateBrickwork } from '../calculations/brickwork';
import { SlideContent, SlideTable, ClickHighlight, LatexFormula } from '@/features/presentation';

// Slide 1: Cover Slide
const Slide1: React.FC<any> = ({ subject, lecture }) => (
  <TitleLayout
    title={lecture.title}
    subtitle={`${subject.courseCode} Series • Session 2026-27`}
    description={lecture.description}
    footer="CE-QS Academic Department"
  />
);

// Slide 2: Theoretical Overview
const Slide2: React.FC = () => {
  return (
    <TwoColumnLayout
      title="Masonry Estimating Theory"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Brickwork estimation determines the{' '}
                  <ClickHighlight at={1} variant="marker">number of raw bricks</ClickHighlight>{' '}
                  and the{' '}
                  <ClickHighlight at={2} variant="rect">volume of wet mortar joint filling</ClickHighlight> needed.
                </span>
              ),
            },
            {
              type: 'paragraph',
              variant: 'plain',
              revealAt: 3,
              text: (
                <div className="flex flex-col items-center justify-center p-4 bg-card border border-border shadow-sm rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
                    Volumetric Mortar Equation
                  </div>
                  <div className="flex items-center gap-1.5 justify-center py-2 select-text">
                    <LatexFormula math="\text{Mortar Vol} = \text{Wall Vol} -" />
                    <ClickHighlight at={4} variant="text">
                      <LatexFormula math="(\text{Bricks} \times \text{Brick Vol})" />
                    </ClickHighlight>
                  </div>
                </div>
              ),
            },
          ]}
        />
      }
      rightContent={
        <SlideContent
          blocks={[
            {
              type: 'list',
              listTitle: 'Standard Brick Dimensions',
              description: 'Typical sizes used in masonry work calculations:',
              items: [
                {
                  text: (
                    <span>
                      Length:{' '}
                      <ClickHighlight at={5} variant="paint">0.240m (240mm)</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Width:{' '}
                      <ClickHighlight at={6} variant="rect">0.115m (115mm)</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Height:{' '}
                      <ClickHighlight at={7} variant="paint">0.070m (70mm)</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Standard mortar joint width:{' '}
                      <ClickHighlight at={8} variant="text">0.010m (10mm)</ClickHighlight>
                    </span>
                  ),
                },
              ],
            },
          ]}
        />
      }
    />
  );
};

// Slide 3: Live Masonry Calculator
const Slide3: React.FC = () => {
  const [area, setArea] = useState(15);
  const [thickness, setThickness] = useState(0.24);
  const [mortar, setMortar] = useState(0.01);

  const result = calculateBrickwork(area, thickness, 0.24, 0.115, 0.07, mortar);

  return (
    <TwoColumnLayout
      title="Masonry Calculation Sandbox"
      bgVariant="calculation"
      leftWidth="45%"
      leftContent={
        <div className="relative p-5 md:p-6 bg-muted/60 dark:bg-muted/20 border-l-[6px] border-primary rounded-r-xl text-foreground font-medium space-y-4 text-left before:absolute before:top-0 before:left-[-6px] before:w-10 before:h-[6px] before:bg-primary after:absolute after:bottom-0 after:left-[-6px] after:w-10 after:h-[6px] after:bg-primary">
          <div className="font-extrabold text-xs md:text-sm text-primary tracking-wide mb-3 border-b border-border/40 pb-1.5 uppercase select-none">
            Parameters (SI Meters)
          </div>
          <div className="p-3 bg-card dark:bg-card/40 border border-border/60 rounded-xl space-y-1.5 shadow-sm">
            <label className="text-muted-foreground font-sans text-xs flex justify-between items-center">
              <span>Wall Surface Area:</span>
              <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">{area}m²</span>
            </label>
            <input
              type="range" min="1" max="100" step="1" value={area}
              onChange={(e) => setArea(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
          <div className="p-3 bg-card dark:bg-card/40 border border-border/60 rounded-xl space-y-1.5 shadow-sm">
            <label className="text-muted-foreground font-sans text-xs flex justify-between items-center">
              <span>Wall Thickness:</span>
              <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">{thickness}m</span>
            </label>
            <input
              type="range" min="0.115" max="0.5" step="0.005" value={thickness}
              onChange={(e) => setThickness(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
          <div className="p-3 bg-card dark:bg-card/40 border border-border/60 rounded-xl space-y-1.5 shadow-sm">
            <label className="text-muted-foreground font-sans text-xs flex justify-between items-center">
              <span>Mortar Joints:</span>
              <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">{Math.round(mortar * 1000)}mm</span>
            </label>
            <input
              type="range" min="0.005" max="0.02" step="0.001" value={mortar}
              onChange={(e) => setMortar(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col items-center justify-center h-full border rounded-xl bg-card p-6 shadow-sm">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Bricks & Mortar Output</span>
          <span className="text-2xl font-extrabold text-primary select-all">
            {result.brickCount} Bricks
          </span>
          <span className="text-2xl font-extrabold text-primary select-all mt-2">
            {result.mortarVolume.toFixed(3)} m³ Mortar
          </span>
        </div>
      }
    />
  );
};

// Slide 4: BoQ Brickwork View
const Slide4: React.FC = () => {
  return (
    <FullWidthLayout title="Itemized Brickwork Bill of Quantities" bgVariant="gallery">
      <SlideTable
        headers={[
          { label: 'Item No', align: 'left' },
          { label: 'Description', align: 'left' },
          { label: 'Qty', align: 'right' },
          { label: 'Unit', align: 'center' },
          { label: 'Rate', align: 'right' },
          { label: 'Amount', align: 'right' },
        ]}
        rows={[
          [
            '2.1',
            'First class brickwork in 1:4 cement sand mortar',
            <ClickHighlight at={1} variant="paint">15.000</ClickHighlight>,
            'm³',
            '$150.00',
            <ClickHighlight at={1} variant="rect"><span className="text-foreground font-semibold">$2,250.00</span></ClickHighlight>
          ],
        ]}
      />
    </FullWidthLayout>
  );
};

export const slides: Record<number, React.ComponentType<any>> = {
  1: Slide1,
  2: Slide2,
  3: Slide3,
  4: Slide4,
};

export const slideMetadata: Record<number, { title: string; type: string; section: string }> = {
  1: { title: 'Brickwork Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Masonry Principles', type: 'Theory Overview', section: 'Introduction' },
  3: { title: 'Masonry Calculator', type: 'Live Sandbox', section: 'Calculations' },
  4: { title: 'Masonry BoQ', type: 'Spreadsheet View', section: 'BoQ Summary' },
};
