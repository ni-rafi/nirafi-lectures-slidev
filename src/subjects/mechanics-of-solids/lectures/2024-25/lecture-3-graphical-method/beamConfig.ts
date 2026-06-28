export const beamConfig = {
  length: 20,
  supports: [
    { id: 'A', type: 'hinge' as const, position: 0 },
    { id: 'B', type: 'roller' as const, position: 20 }
  ],
  releases: [],
  loads: [
    { id: 'w', type: 'udl' as const, startPosition: 5, endPosition: 12, magnitude: 3 },
    { id: 'P', type: 'point' as const, position: 17, magnitude: 15 }
  ],
  eiSegments: [{ id: 'ei-1', startPosition: 0, endPosition: 20, E: 200, I: 100 }]
};
