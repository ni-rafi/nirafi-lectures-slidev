// Solves A * X = B using Gaussian elimination with partial pivoting
export function solveLinearSystem(A: number[][], B: number[]): number[] | null {
  const n = B.length;
  for (let i = 0; i < n; i++) {
    // Search for maximum in this column
    let maxEl = Math.abs((A[i]?.[i]) ?? 0);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      const valKI = Math.abs((A[k]?.[i]) ?? 0);
      if (valKI > maxEl) {
        maxEl = valKI;
        maxRow = k;
      }
    }

    // Swap maximum row with current row
    const tempA = A[maxRow];
    const rowI = A[i];
    if (tempA && rowI) {
      A[maxRow] = rowI;
      A[i] = tempA;
    }

    const tempB = B[maxRow];
    const valBI = B[i];
    if (tempB !== undefined && valBI !== undefined) {
      B[maxRow] = valBI;
      B[i] = tempB;
    }

    // Check if matrix is singular
    const diag = A[i]?.[i];
    if (diag === undefined || Math.abs(diag) < 1e-9) {
      return null;
    }

    // Make all rows below this one 0 in current column
    for (let k = i + 1; k < n; k++) {
      const rowK = A[k];
      const rowI = A[i];
      if (!rowK || !rowI) continue;
      const valKI = rowK[i];
      const valII = rowI[i];
      if (valKI === undefined || valII === undefined || Math.abs(valII) < 1e-9) continue;

      const c = -valKI / valII;
      for (let j = i; j < n; j++) {
        if (i === j) {
          rowK[j] = 0;
        } else {
          const valIJ = rowI[j];
          const valKJ = rowK[j];
          if (valIJ !== undefined && valKJ !== undefined) {
            rowK[j] = valKJ + c * valIJ;
          }
        }
      }
      rowK[i] = 0; // force exact zero
      const valBI2 = B[i];
      const valBK = B[k];
      if (valBI2 !== undefined && valBK !== undefined) {
        B[k] = valBK + c * valBI2;
      }
    }
  }

  // Solve equation Ax = B for an upper triangular matrix
  const X = new Array(n).fill(0) as number[];
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    const rowI = A[i];
    if (!rowI) continue;
    for (let k = i + 1; k < n; k++) {
      const valIK = rowI[k];
      const valXK = X[k];
      if (valIK !== undefined && valXK !== undefined) {
        sum += valIK * valXK;
      }
    }
    const valBI = B[i];
    const valII = rowI[i];
    if (valBI !== undefined && valII !== undefined && Math.abs(valII) > 1e-9) {
      X[i] = parseFloat(((valBI - sum) / valII).toFixed(5));
    }
  }
  return X;
}
