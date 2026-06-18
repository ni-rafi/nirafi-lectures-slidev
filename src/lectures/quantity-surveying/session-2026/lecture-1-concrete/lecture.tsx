import React, { useState } from 'react';
import { TitleLayout } from '@/shared/layouts/TitleLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { calculateConcreteVolume } from '../calculations/concrete';
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
      title="Concrete Calculation Principles"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Estimating structural concrete requires{' '}
                  <ClickHighlight at={1} variant="marker">isolating total volumetric cubic meters</ClickHighlight>{' '}
                  from{' '}
                  <ClickHighlight at={2} variant="rect">internal rebar steel displacement constants</ClickHighlight>.
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
                    Volumetric Concrete Equation
                  </div>
                  <div className="flex items-center gap-1.5 justify-center py-2 select-text">
                    <LatexFormula math="V = L \times W \times H \times" />
                    <ClickHighlight at={4} variant="text">
                      <LatexFormula math="(1 + \text{wastage})" />
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
              listTitle: 'Wastage Allowances',
              description: 'Standard concrete estimations require structural wastage constants:',
              items: [
                {
                  text: (
                    <span>
                      Standard structural members (beams/columns):{' '}
                      <ClickHighlight at={5} variant="paint">5% waste</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Slabs and massive casting elements:{' '}
                      <ClickHighlight at={6} variant="rect">8% waste</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      Thin foundation blindings and overlays:{' '}
                      <ClickHighlight at={7} variant="paint">10% waste</ClickHighlight>
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

// Slide 3: Live Volumetric Calculator
const Slide3: React.FC = () => {
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(0.3);
  const [height, setHeight] = useState(0.4);
  const [wastage] = useState(0.05);

  const result = calculateConcreteVolume(length, width, height, wastage);

  return (
    <TwoColumnLayout
      title="Volumetric Calculation Sandbox"
      bgVariant="calculation"
      leftWidth="45%"
      leftContent={
        <div className="relative p-5 md:p-6 bg-muted/60 dark:bg-muted/20 border-l-[6px] border-primary rounded-r-xl text-foreground font-medium space-y-4 text-left before:absolute before:top-0 before:left-[-6px] before:w-10 before:h-[6px] before:bg-primary after:absolute after:bottom-0 after:left-[-6px] after:w-10 after:h-[6px] after:bg-primary">
          <div className="font-extrabold text-xs md:text-sm text-primary tracking-wide mb-3 border-b border-border/40 pb-1.5 uppercase select-none">
            Parameters (SI Meters)
          </div>
          <div className="p-3 bg-card dark:bg-card/40 border border-border/60 rounded-xl space-y-1.5 shadow-sm">
            <label className="text-muted-foreground font-sans text-xs flex justify-between items-center">
              <span>Length:</span>
              <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">{length}m</span>
            </label>
            <input
              type="range" min="1" max="50" step="0.5" value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
          <div className="p-3 bg-card dark:bg-card/40 border border-border/60 rounded-xl space-y-1.5 shadow-sm">
            <label className="text-muted-foreground font-sans text-xs flex justify-between items-center">
              <span>Width:</span>
              <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">{width}m</span>
            </label>
            <input
              type="range" min="0.1" max="2" step="0.05" value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
          <div className="p-3 bg-card dark:bg-card/40 border border-border/60 rounded-xl space-y-1.5 shadow-sm">
            <label className="text-muted-foreground font-sans text-xs flex justify-between items-center">
              <span>Height:</span>
              <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">{height}m</span>
            </label>
            <input
              type="range" min="0.1" max="2" step="0.05" value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col items-center justify-center h-full border rounded-xl bg-card p-6 shadow-sm">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Casting Volume Output</span>
          <span className="text-3xl font-extrabold text-primary select-all">
            {result.volume.toFixed(3)} m³
          </span>
          <div className="mt-4 text-[10px] text-muted-foreground text-center">
            Automatic wastage factor multiplier: {Math.round(wastage * 100)}%
          </div>
        </div>
      }
    />
  );
};

// Slide 4: BoQ Spreadsheet View
const Slide4: React.FC = () => {
  return (
    <FullWidthLayout title="Itemized Bill of Quantities (BoQ) Template" bgVariant="gallery">
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
            '1.1',
            'Concrete cast in situ for columns (SI metrics)',
            <ClickHighlight at={1} variant="paint">12.500</ClickHighlight>,
            'm³',
            '$120.00',
            <ClickHighlight at={1} variant="rect"><span className="text-foreground font-semibold">$1,500.00</span></ClickHighlight>
          ],
          [
            '1.2',
            'Mild steel reinforcement D=12mm',
            <ClickHighlight at={2} variant="paint">920.000</ClickHighlight>,
            'kg',
            '$1.50',
            <ClickHighlight at={2} variant="rect"><span className="text-foreground font-semibold">$1,380.00</span></ClickHighlight>
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
  1: { title: 'Concrete Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Calculation Principles', type: 'Theory Overview', section: 'Introduction' },
  3: { title: 'Volumetric Calculator', type: 'Live Sandbox', section: 'Calculations' },
  4: { title: 'Bill of Quantities', type: 'Spreadsheet View', section: 'BoQ Summary' },
};
