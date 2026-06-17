import React from 'react';
import CodeBlock from '../CodeBlock';
import CodeMagicMove from '../CodeMagicMove';

export const SlideCodeHighlighting: React.FC = () => {
  const codeExample = `function computeVolume(a: number, b: number) {
  const wastageFactor = 1.05;
  const rawVolume = a * b * 3.5;
  // Calculate total concrete volume
  return Math.round(rawVolume * wastageFactor * 1000) / 1000;
}`;

  const steps = [
`// Step 1: Initialize values
const length = 10;
const width = 5;
const height = 3;`,
`// Step 2: Calculate direct volume
const length = 10;
const width = 5;
const height = 3;
const volume = length * width * height;`,
`// Step 3: Round the calculated output
const length = 10;
const width = 5;
const height = 3;
const volume = length * width * height;
console.log("Volume:", volume.toFixed(3));`
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-start text-left px-8 py-8 overflow-y-auto">
      <div className="flex flex-col gap-1 mb-4 select-none">
        <h3 className="text-xl font-bold text-foreground">
          Slide 4: Advanced Code Highlighting & Morphing
        </h3>
        <p className="text-xs text-muted-foreground">
          Demonstrating prefix line numbers, click-synced dynamic line highlighting, and magic-move step morphing.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full items-start">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
            Dynamic Line Highlighting
          </span>
          <CodeBlock
            language="typescript"
            highlight="{2-3|5|all}"
            startLine={5}
            code={codeExample}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
            Code Magic Move
          </span>
          <CodeMagicMove
            language="javascript"
            steps={steps}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideCodeHighlighting;
