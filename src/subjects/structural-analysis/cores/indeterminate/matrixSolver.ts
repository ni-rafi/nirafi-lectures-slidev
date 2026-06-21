import { IMatrixInversionStep } from '../shared/types/step-protocol';

/**
 * Solves simultaneous linear equations [K]{D} = {F} using Gaussian elimination with partial pivoting.
 * @param matrix The square coefficients matrix [K] (size N x N)
 * @param vectorF The constants vector {F} (size N)
 * @returns A type-safe step payload containing input and output vectors.
 */
export function solveMatrixEquations(
  matrix: number[][],
  vectorF: number[]
): IMatrixInversionStep {
  const n = vectorF.length;
  
  // Clone matrix and vector to prevent mutation
  const A = matrix.map(row => [...row]);
  const B = [...vectorF];

  // Gaussian elimination with partial pivoting
  for (let i = 0; i < n; i++) {
    // Search for maximum pivot in column i
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k]![i]!) > Math.abs(A[maxRow]![i]!)) {
        maxRow = k;
      }
    }

    // Swap row i and maxRow in A and B
    const tempRow = A[i]!;
    A[i] = A[maxRow]!;
    A[maxRow] = tempRow;
    
    const tempB = B[i]!;
    B[i] = B[maxRow]!;
    B[maxRow] = tempB;

    // Singular matrix check
    if (Math.abs(A[i]![i]!) < 1e-12) {
      throw new Error('Stiffness matrix is singular or unstable structure.');
    }

    // Eliminate rows below i
    for (let k = i + 1; k < n; k++) {
      const factor = A[k]![i]! / A[i]![i]!;
      B[k]! -= factor * B[i]!;
      for (let j = i; j < n; j++) {
        A[k]![j]! -= factor * A[i]![j]!;
      }
    }
  }

  // Back substitution
  const D = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += A[i]![j]! * D[j]!;
    }
    D[i] = (B[i]! - sum) / A[i]![i]!;
  }

  return {
    stepId: `matrix_solve_${Date.now()}`,
    type: 'MATRIX_INVERSION',
    payload: {
      matrix,
      vectorF,
      vectorD: D
    }
  };
}
