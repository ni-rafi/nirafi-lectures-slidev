export const beamConfig = {
  length: 16,
  supports: [
    { id: 'A', type: 'hinge' as const, position: 0 },
    { id: 'B', type: 'roller' as const, position: 16 }
  ],
  releases: [],
  loads: [
    { id: 'P', type: 'point' as const, position: 8, magnitude: 20 }
  ],
  eiSegments: [{ id: 'ei-1', startPosition: 0, endPosition: 16, E: 200, I: 100 }]
};
