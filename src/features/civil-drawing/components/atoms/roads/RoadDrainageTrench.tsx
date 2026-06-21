import React from 'react';
import { ShoulderSpec, DrainageSpec } from '../../../types/roadSchema';

interface RoadDrainageTrenchProps {
  carriagewayWidth: number;
  camberPercentage: number;
  shoulder?: ShoulderSpec;
  drainage?: DrainageSpec;
}

export const RoadDrainageTrench: React.FC<RoadDrainageTrenchProps> = ({
  carriagewayWidth,
  camberPercentage,
  shoulder,
  drainage,
}) => {
  const halfW = carriagewayWidth / 2;
  const camberSlope = camberPercentage / 100;

  const getSurfaceY = (x: number): number => {
    return -Math.abs(x) * camberSlope;
  };

  // Shoulder and drainage vertices
  const shoulderLeftStart = { x: -halfW, y: getSurfaceY(-halfW) };
  const shoulderRightStart = { x: halfW, y: getSurfaceY(halfW) };

  let shoulderLeftEnd = shoulderLeftStart;
  let shoulderRightEnd = shoulderRightStart;

  // Render arrays
  const paths: React.ReactNode[] = [];

  if (shoulder) {
    const shSlope = shoulder.slopePercentage / 100;
    const shLeftX = -halfW - shoulder.width;
    const shLeftY = shoulderLeftStart.y + shoulder.width * shSlope;
    shoulderLeftEnd = { x: shLeftX, y: shLeftY };

    const shRightX = halfW + shoulder.width;
    const shRightY = shoulderRightStart.y + shoulder.width * shSlope;
    shoulderRightEnd = { x: shRightX, y: shRightY };

    // Render left shoulder wedge (trapezoidal layer)
    const thickness = 120; // 120mm visual depth of shoulder aggregate
    const leftWedgePoints = [
      `${shoulderLeftStart.x},${shoulderLeftStart.y}`,
      `${shoulderLeftEnd.x},${shoulderLeftEnd.y}`,
      `${shoulderLeftEnd.x},${shoulderLeftEnd.y + thickness}`,
      `${shoulderLeftStart.x},${shoulderLeftStart.y + thickness}`,
    ].join(' ');

    paths.push(
      <polygon
        key="left-shoulder"
        points={leftWedgePoints}
        className={shoulder.colorClass || 'fill-amber-700/20 stroke-amber-800/40 stroke-[1.2]'}
      />
    );

    // Render right shoulder wedge
    const rightWedgePoints = [
      `${shoulderRightStart.x},${shoulderRightStart.y}`,
      `${shoulderRightEnd.x},${shoulderRightEnd.y}`,
      `${shoulderRightEnd.x},${shoulderRightEnd.y + thickness}`,
      `${shoulderRightStart.x},${shoulderRightStart.y + thickness}`,
    ].join(' ');

    paths.push(
      <polygon
        key="right-shoulder"
        points={rightWedgePoints}
        className={shoulder.colorClass || 'fill-amber-700/20 stroke-amber-800/40 stroke-[1.2]'}
      />
    );
  }

  if (drainage) {
    // Left V-drain
    const drainLeftStart = {
      x: shoulderLeftEnd.x - drainage.shoulderClearance,
      y: shoulderLeftEnd.y,
    };
    const drainLeftInvert = {
      x: drainLeftStart.x - drainage.width / 2,
      y: drainLeftStart.y + drainage.depth,
    };
    const drainLeftEnd = {
      x: drainLeftStart.x - drainage.width,
      y: drainLeftStart.y,
    };

    const leftDrainPath = `M ${shoulderLeftEnd.x} ${shoulderLeftEnd.y} L ${drainLeftStart.x} ${drainLeftStart.y} L ${drainLeftInvert.x} ${drainLeftInvert.y} L ${drainLeftEnd.x} ${drainLeftEnd.y}`;

    paths.push(
      <path
        key="left-drain"
        d={leftDrainPath}
        className={drainage.colorClass || 'stroke-sky-600 fill-none stroke-[2]'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );

    // Right V-drain
    const drainRightStart = {
      x: shoulderRightEnd.x + drainage.shoulderClearance,
      y: shoulderRightEnd.y,
    };
    const drainRightInvert = {
      x: drainRightStart.x + drainage.width / 2,
      y: drainRightStart.y + drainage.depth,
    };
    const drainRightEnd = {
      x: drainRightStart.x + drainage.width,
      y: drainRightStart.y,
    };

    const rightDrainPath = `M ${shoulderRightEnd.x} ${shoulderRightEnd.y} L ${drainRightStart.x} ${drainRightStart.y} L ${drainRightInvert.x} ${drainRightInvert.y} L ${drainRightEnd.x} ${drainRightEnd.y}`;

    paths.push(
      <path
        key="right-drain"
        d={rightDrainPath}
        className={drainage.colorClass || 'stroke-sky-600 fill-none stroke-[2]'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }

  return <g>{paths}</g>;
};
