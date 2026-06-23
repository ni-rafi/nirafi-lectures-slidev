import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Pure TypeScript QR Code Generator (Zero-Dependency)
// Adapted from Kazuhiko Arase's classic qrcode-generator
// ─────────────────────────────────────────────────────────────────────────────

type ECLevel = 'L' | 'M' | 'Q' | 'H';

// Galois Field Table Initialization
const EXP_TABLE = new Array<number>(256);
const LOG_TABLE = new Array<number>(256);

for (let i = 0; i < 8; i++) {
  EXP_TABLE[i] = 1 << i;
}
for (let i = 8; i < 256; i++) {
  EXP_TABLE[i] =
    (EXP_TABLE[i - 4] ?? 0) ^
    (EXP_TABLE[i - 5] ?? 0) ^
    (EXP_TABLE[i - 6] ?? 0) ^
    (EXP_TABLE[i - 8] ?? 0);
}
for (let i = 0; i < 255; i++) {
  const expVal = EXP_TABLE[i] ?? 0;
  LOG_TABLE[expVal] = i;
}

const QRMath = {
  glog: (n: number): number => {
    if (n < 1) throw new Error(`glog(${n})`);
    return LOG_TABLE[n] ?? 0;
  },
  gexp: (n: number): number => {
    let val = n;
    while (val < 0) val += 255;
    while (val >= 255) val -= 255;
    return EXP_TABLE[val] ?? 0;
  },
};

class QRPolynomial {
  num: number[];

  constructor(num: number[], shift: number) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) {
      offset++;
    }
    this.num = new Array<number>(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset] ?? 0;
    }
    for (let i = num.length - offset; i < this.num.length; i++) {
      this.num[i] = 0;
    }
  }

  get(index: number): number {
    return this.num[index] ?? 0;
  }

  getLength(): number {
    return this.num.length;
  }

  multiply(e: QRPolynomial): QRPolynomial {
    const num = new Array<number>(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        const idx = i + j;
        num[idx] = (num[idx] ?? 0) ^ QRMath.gexp(
          QRMath.glog(this.get(i)) + QRMath.glog(e.get(j))
        );
      }
    }
    return new QRPolynomial(num, 0);
  }

  mod(e: QRPolynomial): QRPolynomial {
    if (this.getLength() - e.getLength() < 0) {
      return this;
    }
    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
    const num = new Array<number>(this.getLength());
    for (let i = 0; i < this.getLength(); i++) {
      num[i] = this.get(i);
    }
    for (let i = 0; i < e.getLength(); i++) {
      num[i] = (num[i] ?? 0) ^ QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num, 0).mod(e);
  }
}

// Error Correction Block Metadata
interface QRRSBlock {
  totalCount: number;
  dataCount: number;
}

const RS_BLOCK_TABLE: Record<number, Record<ECLevel, number[]>> = {
  1: { L: [1, 26, 19], M: [1, 26, 16], Q: [1, 26, 13], H: [1, 26, 9] },
  2: { L: [1, 44, 34], M: [1, 44, 28], Q: [1, 44, 22], H: [1, 44, 16] },
  3: { L: [1, 70, 55], M: [1, 70, 44], Q: [2, 35, 17], H: [2, 35, 13] },
  4: { L: [1, 100, 80], M: [2, 50, 32], Q: [2, 50, 24], H: [4, 25, 9] },
  5: { L: [1, 134, 108], M: [2, 67, 43], Q: [2, 33, 15, 2, 34, 16], H: [2, 33, 11, 2, 34, 12] },
  6: { L: [2, 86, 68], M: [4, 43, 27], Q: [4, 43, 19], H: [4, 43, 15] },
  7: { L: [2, 98, 78], M: [4, 49, 31], Q: [2, 49, 14, 4, 50, 15], H: [4, 39, 13, 1, 40, 14] },
  8: { L: [2, 121, 97], M: [2, 60, 38, 2, 61, 39], Q: [4, 40, 18, 2, 41, 19], H: [4, 40, 14, 2, 41, 15] },
  9: { L: [2, 146, 116], M: [3, 58, 36, 2, 59, 37], Q: [4, 36, 16, 4, 37, 17], H: [4, 36, 12, 4, 37, 13] },
  10: { L: [2, 86, 68, 2, 87, 69], M: [4, 69, 43, 1, 70, 44], Q: [6, 43, 19, 2, 44, 20], H: [6, 43, 15, 2, 44, 16] },
};

function getRSBlocks(version: number, ecLevel: ECLevel): QRRSBlock[] {
  const list = RS_BLOCK_TABLE[version]?.[ecLevel];
  if (!list) throw new Error(`Unsupported version/EC: ${version}/${ecLevel}`);
  
  const blocks: QRRSBlock[] = [];
  for (let i = 0; i < list.length; i += 3) {
    const count = list[i] ?? 0;
    const totalCount = list[i + 1] ?? 0;
    const dataCount = list[i + 2] ?? 0;
    for (let j = 0; j < count; j++) {
      blocks.push({ totalCount, dataCount });
    }
  }
  return blocks;
}

// Alignment Pattern Coordinates
const ALIGNMENT_PATTERN_TABLE: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
};

const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1) | (1 << 0);

class QRBitBuffer {
  buffer: number[] = [];
  length = 0;

  get(index: number): boolean {
    const bufIndex = Math.floor(index / 8);
    const byteVal = this.buffer[bufIndex] ?? 0;
    return ((byteVal >>> (7 - (index % 8))) & 1) === 1;
  }

  put(num: number, length: number) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] = (this.buffer[bufIndex] ?? 0) | (0x80 >>> (this.length % 8));
    }
    this.length++;
  }
}

// Minimal Helper functions for Reed Solomon Math
function createBytes(buffer: QRBitBuffer, rsBlocks: QRRSBlock[]): number[] {
  let offset = 0;
  let maxDcCount = 0;
  let maxEcCount = 0;

  const dcdata = new Array<number[]>(rsBlocks.length);
  const ecdata = new Array<number[]>(rsBlocks.length);

  for (let r = 0; r < rsBlocks.length; r++) {
    const block = rsBlocks[r]!;
    const dcCount = block.dataCount;
    const ecCount = block.totalCount - dcCount;

    maxDcCount = Math.max(maxDcCount, dcCount);
    maxEcCount = Math.max(maxEcCount, ecCount);

    dcdata[r] = new Array<number>(dcCount);
    for (let i = 0; i < dcdata[r]!.length; i++) {
      dcdata[r]![i] = 0xff & (buffer.buffer[i + offset] ?? 0);
    }
    offset += dcCount;

    const rsPoly = errorCorrectPolynomial(ecCount);
    const rawPoly = new QRPolynomial(dcdata[r]!, rsPoly.getLength() - 1);
    const modPoly = rawPoly.mod(rsPoly);

    ecdata[r] = new Array<number>(rsPoly.getLength() - 1);
    for (let i = 0; i < ecdata[r]!.length; i++) {
      const modIndex = i + modPoly.getLength() - ecdata[r]!.length;
      ecdata[r]![i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
    }
  }

  let totalCodeCount = 0;
  for (let i = 0; i < rsBlocks.length; i++) {
    totalCodeCount += rsBlocks[i]!.totalCount;
  }

  const data = new Array<number>(totalCodeCount);
  let idx = 0;

  for (let i = 0; i < maxDcCount; i++) {
    for (let r = 0; r < rsBlocks.length; r++) {
      const currentDc = dcdata[r]!;
      if (i < currentDc.length) {
        data[idx++] = currentDc[i] ?? 0;
      }
    }
  }

  for (let i = 0; i < maxEcCount; i++) {
    for (let r = 0; r < rsBlocks.length; r++) {
      const currentEc = ecdata[r]!;
      if (i < currentEc.length) {
        data[idx++] = currentEc[i] ?? 0;
      }
    }
  }

  return data;
}

function errorCorrectPolynomial(errorCorrectLength: number): QRPolynomial {
  let a = new QRPolynomial([1], 0);
  for (let i = 0; i < errorCorrectLength; i++) {
    a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
  }
  return a;
}

const BCH_TYPE_INFO = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
function getBCHTypeInfo(data: number): number {
  let d = data << 10;
  while (getBCHDigit(d) - getBCHDigit(BCH_TYPE_INFO) >= 0) {
    d ^= BCH_TYPE_INFO << (getBCHDigit(d) - getBCHDigit(BCH_TYPE_INFO));
  }
  return ((data << 10) | d) ^ G15_MASK;
}

function getBCHDigit(data: number): number {
  let digit = 0;
  let val = data;
  while (val !== 0) {
    digit++;
    val >>>= 1;
  }
  return digit;
}

// Standard QR Code matrix generator
class QRCode {
  version: number;
  ecLevel: ECLevel;
  modules: Array<Array<boolean | null>> = [];
  moduleCount = 0;
  data: string;

  constructor(data: string, ecLevel: ECLevel = 'M') {
    this.data = data;
    this.ecLevel = ecLevel;
    
    // Dynamically resolve version depending on string size (Up to Version 10)
    let version = 1;
    const dataLen = data.length;
    for (let v = 1; v <= 10; v++) {
      const limits = RS_BLOCK_TABLE[v]?.[ecLevel];
      if (limits) {
        // approx limit calculation for 8-bit byte mode
        const totalBlockCount = limits[0] ?? 1;
        const dataCount = (limits[2] ?? 16) * totalBlockCount;
        if (dataLen < dataCount - 4) {
          version = v;
          break;
        }
      }
      version = v;
    }
    this.version = version;
  }

  make() {
    this.moduleCount = this.version * 4 + 17;
    this.modules = new Array(this.moduleCount);
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = new Array(this.moduleCount).fill(null);
    }

    this.setupPositionFinderPattern(0, 0);
    this.setupPositionFinderPattern(this.moduleCount - 7, 0);
    this.setupPositionFinderPattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(false, 0);

    // Encode data
    const buffer = new QRBitBuffer();
    // 8-bit Byte Mode indicator (0100)
    buffer.put(4, 4);
    // Character count indicator length
    const charCountLength = this.version < 10 ? 8 : 16;
    buffer.put(this.data.length, charCountLength);

    for (let i = 0; i < this.data.length; i++) {
      buffer.put(this.data.charCodeAt(i), 8);
    }

    const rsBlocks = getRSBlocks(this.version, this.ecLevel);
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i]!.dataCount;
    }

    // Add termination padding
    if (buffer.length + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    // Align to byte
    while (buffer.length % 8 !== 0) {
      buffer.putBit(false);
    }
    // Fill up remaining space with padding patterns
    const PAD1 = 0xec;
    const PAD2 = 0x11;
    while (true) {
      if (buffer.length >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
      if (buffer.length >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD2, 8);
    }

    const bytes = createBytes(buffer, rsBlocks);
    this.mapData(bytes, 0);
  }

  setupPositionFinderPattern(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          const rowArr = this.modules[row + r];
          if (rowArr) rowArr[col + c] = true;
        } else {
          const rowArr = this.modules[row + r];
          if (rowArr) rowArr[col + c] = false;
        }
      }
    }
  }

  setupPositionAdjustPattern() {
    const pos = ALIGNMENT_PATTERN_TABLE[this.version] ?? [];
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i] ?? 0;
        const col = pos[j] ?? 0;
        const rowArr = this.modules[row];
        if (rowArr && rowArr[col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            const targetRow = this.modules[row + r];
            if (targetRow) {
              if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
                targetRow[col + c] = true;
              } else {
                targetRow[col + c] = false;
              }
            }
          }
        }
      }
    }
  }

  setupTimingPattern() {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      const rowArr = this.modules[r];
      if (rowArr && rowArr[6] !== null) continue;
      if (rowArr) rowArr[6] = r % 2 === 0;
    }
    const fixedRow = this.modules[6];
    if (fixedRow) {
      for (let c = 8; c < this.moduleCount - 8; c++) {
        if (fixedRow[c] !== null) continue;
        fixedRow[c] = c % 2 === 0;
      }
    }
  }

  setupTypeInfo(test: boolean, maskPattern: number) {
    let ecBits = 0;
    if (this.ecLevel === 'L') ecBits = 1;
    else if (this.ecLevel === 'M') ecBits = 0;
    else if (this.ecLevel === 'Q') ecBits = 3;
    else if (this.ecLevel === 'H') ecBits = 2;

    const data = (ecBits << 3) | maskPattern;
    const bits = getBCHTypeInfo(data);

    // vertical
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >>> i) & 1) === 1;
      if (i < 6) {
        const r = this.modules[i];
        if (r) r[8] = mod;
      } else if (i < 8) {
        const r = this.modules[i + 1];
        if (r) r[8] = mod;
      } else {
        const r = this.modules[this.moduleCount - 15 + i];
        if (r) r[8] = mod;
      }
    }

    // horizontal
    const row8 = this.modules[8];
    if (row8) {
      for (let i = 0; i < 15; i++) {
        const mod = !test && ((bits >>> i) & 1) === 1;
        if (i < 8) {
          row8[this.moduleCount - i - 1] = mod;
        } else if (i < 9) {
          row8[15 - i - 1 + 1] = mod;
        } else {
          row8[15 - i - 1] = mod;
        }
      }
    }

    // fixed module
    const fixedRow = this.modules[this.moduleCount - 8];
    if (fixedRow) fixedRow[8] = !test;
  }

  mapData(data: number[], maskPattern: number) {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;

    const getMask = (r: number, c: number): boolean => {
      switch (maskPattern) {
        case 0: return (r + c) % 2 === 0;
        case 1: return r % 2 === 0;
        case 2: return c % 3 === 0;
        case 3: return (r + c) % 3 === 0;
        case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
        case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
        case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
        case 7: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
        default: throw new Error(`Bad mask pattern: ${maskPattern}`);
      }
    };

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          const currentCol = col - c;
          const targetRow = this.modules[row];
          if (targetRow && targetRow[currentCol] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              const byteVal = data[byteIndex] ?? 0;
              dark = ((byteVal >>> bitIndex) & 1) === 1;
            }
            const mask = getMask(row, currentCol);
            if (mask) {
              dark = !dark;
            }
            targetRow[currentCol] = dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }
}

interface QRCodeSVGProps {
  value: string;
  size?: number;
  className?: string;
  fgColor?: string;
  bgColor?: string;
  margin?: number;
}

export const QRCodeSVG: React.FC<QRCodeSVGProps> = ({
  value,
  size = 128,
  className = '',
  fgColor = '#000000',
  bgColor = '#ffffff',
  margin = 2,
}) => {
  const qr = React.useMemo(() => {
    try {
      const q = new QRCode(value, 'M');
      q.make();
      return q;
    } catch (e) {
      console.error('Failed to generate QR Code matrix', e);
      return null;
    }
  }, [value]);

  if (!qr) {
    return <div style={{ width: size, height: size }} className="bg-muted animate-pulse rounded" />;
  }

  const moduleCount = qr.moduleCount;
  const totalCells = moduleCount + margin * 2;
  const cellSize = 10;
  const viewSize = totalCells * cellSize;

  const paths: string[] = [];
  for (let r = 0; r < moduleCount; r++) {
    const rowArr = qr.modules[r];
    if (rowArr) {
      for (let c = 0; c < moduleCount; c++) {
        if (rowArr[c]) {
          const x = (c + margin) * cellSize;
          const y = (r + margin) * cellSize;
          paths.push(`M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z`);
        }
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      className={className}
      style={{ display: 'block', backgroundColor: bgColor }}
    >
      <rect width="100%" height="100%" fill={bgColor} />
      <path d={paths.join(' ')} fill={fgColor} shapeRendering="crispEdges" />
    </svg>
  );
};

export default QRCodeSVG;
