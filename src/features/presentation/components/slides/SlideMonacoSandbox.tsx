import React from 'react';
import CodePlayground from '../CodePlayground';

export const SlideMonacoSandbox: React.FC = () => {
  const calculationsCode = `// Quantity Surveying concrete slab volume formula
const length = 8.5; // in meters
const width = 4.2;  // in meters
const thickness = 0.15; // in meters

const rawVol = length * width * thickness;
const totalVol = Math.round(rawVol * 1.05 * 1000) / 1000; // adding 5% waste

console.log("Slab Raw Volume:", rawVol.toFixed(3) + " m³");
console.log("Slab Total Volume (with 5% waste):", totalVol.toFixed(3) + " m³");`;

  const comparisonCode = `function getArea(r: number): number {
  return Math.PI * r * r;
}
~~~
function getArea(radius: number): number {
  // Rounded circle surface calculation
  const rawArea = Math.PI * Math.pow(radius, 2);
  return Math.round(rawArea * 1000) / 1000;
}`;

  return (
    <div className="relative w-full h-full flex flex-col justify-start text-left px-8 py-8 overflow-y-auto">
      <div className="flex flex-col gap-1 mb-4 select-none">
        <h3 className="text-xl font-bold text-foreground">
          Slide 5: Interactive Monaco Editor & Runner Sandbox
        </h3>
        <p className="text-xs text-muted-foreground">
          Edit the formula below and click the play button to evaluate your calculations live on the slide!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full items-start">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
            Live Calculator Sandbox
          </span>
          <CodePlayground
            mode="run"
            language="typescript"
            height="180px"
            code={calculationsCode}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
            Code Comparison (Diff Editor)
          </span>
          <CodePlayground
            mode="diff"
            language="typescript"
            height="220px"
            code={comparisonCode}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideMonacoSandbox;
