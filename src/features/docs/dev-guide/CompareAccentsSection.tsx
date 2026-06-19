import React, { useState } from 'react';
import { PlaygroundSection } from './PlaygroundSection';
import { SlideCompare, SlideBadge, SlideCallout } from '@/features/presentation/components/elements/SlideContent';

export const CompareAccentsSection: React.FC = () => {
  // Compare State
  const [highlight, setHighlight] = useState<'left' | 'right' | 'none'>('none');

  // Badge State
  const [badgeLabel, setBadgeLabel] = useState('Safety Factor');
  const [badgeVariant, setBadgeVariant] = useState<'default' | 'primary' | 'warning' | 'error' | 'success' | 'info'>('primary');

  // Callout State
  const [calloutTitle, setCalloutTitle] = useState('Critical Safety Parameter');
  const [calloutVariant, setCalloutVariant] = useState<'info' | 'warning' | 'success' | 'danger' | 'note'>('warning');

  const comparePreview = (
    <div className="border border-border/40 p-5 rounded-xl bg-card w-full">
      <SlideCompare
        highlight={highlight}
        leftTitle="Reinforced Concrete"
        leftContent={
          <ul className="space-y-1.5 list-disc pl-4 font-sans text-xs">
            <li>High compressive strength</li>
            <li>Excellent fire resistance</li>
            <li>Requires curing time (28 days)</li>
          </ul>
        }
        rightTitle="Structural Steel"
        rightContent={
          <ul className="space-y-1.5 list-disc pl-4 font-sans text-xs">
            <li>High tensile strength & elasticity</li>
            <li>Faster site erection times</li>
            <li>Requires anti-corrosion coating</li>
          </ul>
        }
      />
    </div>
  );

  const compareCode = `import { SlideCompare } from '@/features/presentation/components/elements';

<SlideCompare
  highlight="${highlight}"
  leftTitle="Reinforced Concrete"
  leftContent={<ConcreteDetails />}
  rightTitle="Structural Steel"
  rightContent={<SteelDetails />}
/>`;

  const compareEditor = (
    <div className="text-slate-300 space-y-2 text-[11px] font-mono">
      <div>
        <span className="text-purple-400">import</span> {'{ SlideCompare }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;
      </div>
      <div>
        <span className="text-blue-400">&lt;SlideCompare</span>
      </div>
      <div className="pl-4">
        <span className="text-teal-400">highlight</span>=<span className="text-amber-300">"</span>
        <select
          value={highlight}
          onChange={(e) => setHighlight(e.target.value as any)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 cursor-pointer font-bold"
        >
          <option value="none">none</option>
          <option value="left">left</option>
          <option value="right">right</option>
        </select>
        <span className="text-amber-300">"</span>
      </div>
      <div>
        <span className="text-blue-400">/&gt;</span>
      </div>
    </div>
  );

  const accentPreview = (
    <div className="flex flex-col gap-5 w-full">
      <div className="border border-border/40 p-4 rounded-xl bg-card flex items-center justify-center gap-2">
        <SlideBadge label={badgeLabel} variant={badgeVariant} />
        <SlideBadge label="Required" variant="default" />
        <SlideBadge label="Verified" variant="success" />
      </div>
      <div className="border border-border/40 p-4 rounded-xl bg-card">
        <SlideCallout title={calloutTitle || undefined} variant={calloutVariant}>
          Confirm that concrete grade is C25/30 minimum. Check site batch records before casting.
        </SlideCallout>
      </div>
    </div>
  );

  const accentCode = `import { SlideBadge, SlideCallout } from '@/features/presentation/components/elements';

<SlideBadge label="${badgeLabel}" variant="${badgeVariant}" />

<SlideCallout title="${calloutTitle}" variant="${calloutVariant}">
  Confirm that concrete grade is C25/30 minimum...
</SlideCallout>`;

  const accentEditor = (
    <div className="text-slate-300 space-y-3 text-[11px] font-mono">
      <div className="space-y-1">
        <span className="text-muted-foreground">// SlideBadge Controls:</span>
        <div className="flex items-center gap-1">
          {"  "}<span className="text-teal-400">label</span>=<span className="text-amber-300">"</span>
          <input
            type="text"
            value={badgeLabel}
            onChange={(e) => setBadgeLabel(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none w-36 font-mono text-[11px]"
          />
          <span className="text-amber-300">"</span>
        </div>
        <div>
          {"  "}<span className="text-teal-400">variant</span>=<span className="text-amber-300">"</span>
          <select
            value={badgeVariant}
            onChange={(e) => setBadgeVariant(e.target.value as any)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none cursor-pointer font-bold"
          >
            <option value="default">default</option>
            <option value="primary">primary</option>
            <option value="warning">warning</option>
            <option value="error">error</option>
            <option value="success">success</option>
            <option value="info">info</option>
          </select>
          <span className="text-amber-300">"</span>
        </div>
      </div>

      <div className="space-y-1 border-t border-white/5 pt-2">
        <span className="text-muted-foreground">// SlideCallout Controls:</span>
        <div className="flex items-center gap-1">
          {"  "}<span className="text-teal-400">title</span>=<span className="text-amber-300">"</span>
          <input
            type="text"
            value={calloutTitle}
            onChange={(e) => setCalloutTitle(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-slate-100 focus:outline-none w-48 font-mono text-[11px]"
          />
          <span className="text-amber-300">"</span>
        </div>
        <div>
          {"  "}<span className="text-teal-400">variant</span>=<span className="text-amber-300">"</span>
          <select
            value={calloutVariant}
            onChange={(e) => setCalloutVariant(e.target.value as any)}
            className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none cursor-pointer font-bold"
          >
            <option value="note">note</option>
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="success">success</option>
            <option value="danger">danger</option>
          </select>
          <span className="text-amber-300">"</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-300">
      <PlaygroundSection
        title="Side-by-Side Comparisons"
        description={
          <span>
            Use <code>&lt;SlideCompare&gt;</code> to contrast designs or parameters. Highlighting specific panels directs user focus during instruction. Stacks vertically in Blog Mode.
          </span>
        }
        preview={comparePreview}
        codeText={compareCode}
        editorContent={compareEditor}
      />
      <PlaygroundSection
        title="Badges & Accented Callouts"
        description={
          <span>
            Use <code>&lt;SlideBadge&gt;</code> to tag items and parameters. Use <code>&lt;SlideCallout&gt;</code> to highlight warnings, safety parameters, curing checks, and calculations.
          </span>
        }
        preview={accentPreview}
        codeText={accentCode}
        editorContent={accentEditor}
      />
    </div>
  );
};

export default CompareAccentsSection;
