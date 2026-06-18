import React, { useState } from 'react';
import { TitleLayout } from '@/shared/layouts/TitleLayout';
import { TwoColumnLayout } from '@/shared/layouts/TwoColumnLayout';
import { FullWidthLayout } from '@/shared/layouts/FullWidthLayout';
import { calculateSteelWeight } from '../calculations/steel';
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
      title="Reinforcement Steel Theory"
      bgVariant="default"
      leftWidth="45%"
      leftContent={
        <SlideContent
          blocks={[
            {
              type: 'paragraph',
              text: (
                <span>
                  Reinforcement bars (rebar) are estimated in terms of{' '}
                  <ClickHighlight at={1} variant="marker">weight (kilograms or tons)</ClickHighlight>{' '}
                  rather than{' '}
                  <ClickHighlight at={2} variant="strike">length</ClickHighlight>.
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
                    Unit Weight Formula
                  </div>
                  <div className="flex items-center gap-1.5 justify-center py-2 select-text">
                    <LatexFormula math="W_{\text{unit}} =" />
                    <ClickHighlight at={4} variant="text">
                      <LatexFormula math="\frac{d^2}{162} \text{ kg/m}" />
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
              listTitle: 'Standard Rebar Diameters',
              description: 'Typical diameters and corresponding unit weights:',
              items: [
                {
                  text: (
                    <span>
                      D=10mm:{' '}
                      <ClickHighlight at={5} variant="paint">0.617 kg/m</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      D=12mm:{' '}
                      <ClickHighlight at={6} variant="rect">0.888 kg/m</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      D=16mm:{' '}
                      <ClickHighlight at={7} variant="paint">1.580 kg/m</ClickHighlight>
                    </span>
                  ),
                },
                {
                  text: (
                    <span>
                      D=20mm:{' '}
                      <ClickHighlight at={8} variant="text">2.469 kg/m</ClickHighlight>
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

// Slide 3: Live Steel Weight Calculator
const Slide3: React.FC = () => {
  const [diameter, setDiameter] = useState(12);
  const [length, setLength] = useState(100);

  const result = calculateSteelWeight(diameter, length);

  return (
    <TwoColumnLayout
      title="Rebar Steel Calculation Sandbox"
      bgVariant="calculation"
      leftWidth="45%"
      leftContent={
        <div className="relative p-5 md:p-6 bg-muted/60 dark:bg-muted/20 border-l-[6px] border-primary rounded-r-xl text-foreground font-medium space-y-4 text-left before:absolute before:top-0 before:left-[-6px] before:w-10 before:h-[6px] before:bg-primary after:absolute after:bottom-0 after:left-[-6px] after:w-10 after:h-[6px] after:bg-primary">
          <div className="font-extrabold text-xs md:text-sm text-primary tracking-wide mb-3 border-b border-border/40 pb-1.5 uppercase select-none">
            Parameters (SI Units)
          </div>
          <div className="p-3 bg-card dark:bg-card/40 border border-border/60 rounded-xl space-y-1.5 shadow-sm">
            <label className="text-muted-foreground font-sans text-xs flex justify-between items-center">
              <span>Rebar Diameter:</span>
              <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">{diameter}mm</span>
            </label>
            <input
              type="range" min="6" max="32" step="1" value={diameter}
              onChange={(e) => setDiameter(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
          <div className="p-3 bg-card dark:bg-card/40 border border-border/60 rounded-xl space-y-1.5 shadow-sm">
            <label className="text-muted-foreground font-sans text-xs flex justify-between items-center">
              <span>Total Length:</span>
              <span className="font-bold text-foreground bg-muted/80 px-1.5 py-0.5 rounded text-[11px]">{length}m</span>
            </label>
            <input
              type="range" min="10" max="1000" step="10" value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>
      }
      rightContent={
        <div className="flex flex-col items-center justify-center h-full border rounded-xl bg-card p-6 shadow-sm">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Rebar Weight Output</span>
          <span className="text-3xl font-extrabold text-primary select-all">
            {result.weightKg.toFixed(3)} kg
          </span>
          <div className="mt-4 text-[10px] text-muted-foreground text-center">
            Estimated Unit Weight: {((diameter * diameter) / 162).toFixed(3)} kg/m
          </div>
        </div>
      }
    />
  );
};

// Slide 4: BoQ Steel View
const Slide4: React.FC = () => {
  return (
    <FullWidthLayout title="Itemized Steel Reinforcement BoQ" bgVariant="gallery">
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
            '3.1',
            'Deformed steel reinforcement bar including cutting/bending',
            <ClickHighlight at={1} variant="paint">493.800</ClickHighlight>,
            'kg',
            '$1.60',
            <ClickHighlight at={1} variant="rect"><span className="text-foreground font-semibold">$790.08</span></ClickHighlight>
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
  1: { title: 'Steel Cover', type: 'Cover Slide', section: 'Introduction' },
  2: { title: 'Steel Weight Principles', type: 'Theory Overview', section: 'Introduction' },
  3: { title: 'Rebar Calculator', type: 'Live Sandbox', section: 'Calculations' },
  4: { title: 'Reinforcement BoQ', type: 'Spreadsheet View', section: 'BoQ Summary' },
};
