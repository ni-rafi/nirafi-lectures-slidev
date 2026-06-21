import { describe, it, expect } from 'vitest';
import { solveMatrixEquations } from '../matrixSolver';

describe('stiffness matrix solver module', () => {
  it('correctly solves a 2x2 system of linear equations', () => {
    // 2x2 equations:
    // [ 4  1 ] {x} = { 13 }
    // [ 1  3 ]     = { 17 }
    // Solves to: x = [1, 5]^T
    const K = [
      [4, 1],
      [1, 3]
    ];
    const F = [13, 17];

    const step = solveMatrixEquations(K, F);

    expect(step.type).toBe('MATRIX_INVERSION');
    expect(step.payload.vectorD).toBeDefined();
    
    const D = step.payload.vectorD!;
    expect(D).toHaveLength(2);
    expect(D[0]).toBeCloseTo(2, 4);  // 4*2 + 5 = 13
    expect(D[1]).toBeCloseTo(5, 4);  // 2 + 3*5 = 17
  });

  it('correctly solves a 3x3 system of equations', () => {
    // [ 2   1  -1 ] {d} = { 8  }
    // [ -3  -1  2 ]     = { -11}
    // [ -2   1  2 ]     = { -3 }
    // Solves to: d = [2, 3, -1]^T
    const K = [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2]
    ];
    const F = [8, -11, -3];

    const step = solveMatrixEquations(K, F);
    const D = step.payload.vectorD!;

    expect(D).toHaveLength(3);
    expect(D[0]).toBeCloseTo(2, 4);
    expect(D[1]).toBeCloseTo(3, 4);
    expect(D[2]).toBeCloseTo(-1, 4);
  });

  it('throws an error for singular or unstable matrices', () => {
    const K = [
      [1, 2],
      [2, 4] // Row 2 is exactly 2x Row 1 (singular)
    ];
    const F = [5, 10];

    expect(() => solveMatrixEquations(K, F)).toThrowError(
      'Stiffness matrix is singular or unstable structure.'
    );
  });
});
