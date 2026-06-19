import React, { useState } from 'react';
import { SlideIcon } from '@/features/presentation/components/elements/SlideIcon';
import { PlaygroundSection } from './PlaygroundSection';

export const IconsSection: React.FC = () => {
  const [icon, setIcon] = useState('logos:react');
  const [size, setSize] = useState('h-10 w-10');
  const [color, setColor] = useState('text-primary');

  const preview = (
    <div className="flex flex-col items-center justify-center gap-4 py-6 select-none text-center">
      <div className={`p-4 rounded-2xl bg-card border border-border/40 shadow-xs flex items-center justify-center`}>
        <SlideIcon icon={icon} className={`${size} ${color} transition-all duration-300`} />
      </div>
      <div className="text-[10px] text-muted-foreground font-mono">
        Active Iconify identifier: <span className="text-foreground font-semibold">{icon}</span>
      </div>
    </div>
  );

  const codeText = `import { SlideIcon } from '@/features/presentation/components/elements';

// Renders React logo with custom size and accent color
<SlideIcon
  icon="${icon}"
  className="${size} ${color}"
/>`;

  const editorContent = (
    <div className="text-slate-300">
      <span className="text-purple-400">import</span> {'{ SlideIcon }'} <span className="text-purple-400">from</span> <span className="text-amber-300">"@/features/presentation/components/elements"</span>;{"\n\n"}
      <span className="text-blue-400">&lt;SlideIcon</span>{"\n"}
      {"  "}<span className="text-teal-400">icon</span>=<span className="text-amber-300">"</span>
      <select
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold"
      >
        <option value="logos:react">logos:react</option>
        <option value="logos:typescript-icon">logos:typescript-icon</option>
        <option value="logos:vitejs">logos:vitejs</option>
        <option value="logos:tailwindcss-icon">logos:tailwindcss-icon</option>
        <option value="twemoji:fire">twemoji:fire</option>
        <option value="twemoji:rocket">twemoji:rocket</option>
        <option value="twemoji:check-mark-button">twemoji:check-mark-button</option>
        <option value="mdi:home">mdi:home</option>
        <option value="mdi:gear">mdi:gear</option>
        <option value="mdi:cube-outline">mdi:cube-outline</option>
      </select>
      <span className="text-amber-300">"</span>{"\n"}
      {"  "}<span className="text-teal-400">className</span>=<span className="text-amber-300">"</span>
      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer"
      >
        <option value="h-6 w-6">h-6 w-6 (Small)</option>
        <option value="h-10 w-10">h-10 w-10 (Medium)</option>
        <option value="h-16 w-16">h-16 w-16 (Large)</option>
        <option value="h-24 w-24">h-24 w-24 (Extra Large)</option>
      </select>{" "}
      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer"
      >
        <option value="text-primary">text-primary (Blue)</option>
        <option value="text-emerald-500">text-emerald-500 (Green)</option>
        <option value="text-amber-500">text-amber-500 (Amber)</option>
        <option value="text-red-500">text-red-500 (Red)</option>
        <option value="text-slate-100">text-slate-100 (White)</option>
      </select>
      <span className="text-amber-300">"</span>{"\n"}
      <span className="text-blue-400">/&gt;</span>
    </div>
  );

  return (
    <PlaygroundSection
      title="Slide Icons & SVG Graphics"
      description={
        <span>
          Use <code>&lt;SlideIcon&gt;</code> to render vector icons from the <code>Iconify</code> database. This supports combining logos, emojis, and system controls natively inside headers, text lists, or slide buttons.
        </span>
      }
      preview={preview}
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default IconsSection;
