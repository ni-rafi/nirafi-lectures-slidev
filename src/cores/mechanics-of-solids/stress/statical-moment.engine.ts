import { ICrossSection } from './stress.interface';
import { ISectionProperties } from './cross-section.engine';

export class StaticalMomentEngine {
  static calculateQAndWidth(
    shape: ICrossSection,
    y: number, // distance from neutral axis in m
    props: ISectionProperties
  ): { Q: number; t: number } {
    const H = shape.height ?? 0.2;
    const W = shape.width ?? 0.1;

    switch (shape.type) {
      case 'rectangular': {
        const b = W;
        const h = H;
        // Q = b/2 * (h^2/4 - y^2)
        const Q = (b / 2) * (h * h / 4 - y * y);
        return { Q: Math.max(0, Q), t: b };
      }
      case 'circular': {
        const d = shape.diameter ?? 0.1;
        const R = d / 2;
        if (Math.abs(y) >= R) return { Q: 0, t: 1e-4 };
        const Q = (2 / 3) * Math.pow(R * R - y * y, 1.5);
        const t = 2 * Math.sqrt(R * R - y * y);
        return { Q: Math.max(0, Q), t: Math.max(1e-4, t) };
      }
      case 'i-beam':
      case 'channel': {
        const d = H;
        const bft = W;
        const tft = shape.thicknessFlange ?? 0.01;
        const bfb = shape.widthBottom ?? bft;
        const tfb = shape.thicknessFlangeBottom ?? tft;
        const tw = shape.thicknessWeb ?? 0.006;

        const ybar = props.centroid; // neutral axis from bottom
        const ylocal = ybar + y; // distance from bottom

        if (ylocal >= d || ylocal <= 0) return { Q: 0, t: bft };

        if (ylocal >= d - tft) {
          // Inside top flange
          const hAbove = d - ylocal;
          const yCentroidAbove = ylocal + hAbove / 2 - ybar;
          const Q = bft * hAbove * yCentroidAbove;
          return { Q: Math.max(0, Q), t: bft };
        } else if (ylocal <= tfb) {
          // Inside bottom flange
          const hBelow = ylocal;
          const yCentroidBelow = ybar - ylocal / 2;
          const Q = bfb * hBelow * yCentroidBelow;
          return { Q: Math.max(0, Q), t: bfb };
        } else {
          // Inside web
          const yft = d - tft / 2;
          const Qflange = bft * tft * (yft - ybar);
          const hWebAbove = d - tft - ylocal;
          const yCentroidWeb = ylocal + hWebAbove / 2 - ybar;
          const Qweb = tw * hWebAbove * yCentroidWeb;
          return { Q: Math.max(0, Qflange + Qweb), t: tw };
        }
      }
      case 't-beam': {
        const d = H;
        const bf = W;
        const tf = shape.thicknessFlange ?? 0.01;
        const tw = shape.thicknessWeb ?? 0.008;

        const ybar = props.centroid; // neutral axis from bottom
        const ylocal = ybar + y; // distance from bottom

        if (ylocal >= d || ylocal <= 0) return { Q: 0, t: bf };

        if (ylocal >= d - tf) {
          // Inside flange
          const hAbove = d - ylocal;
          const yCentroidAbove = ylocal + hAbove / 2 - ybar;
          const Q = bf * hAbove * yCentroidAbove;
          return { Q: Math.abs(Q), t: bf };
        } else {
          // Inside web
          const yf = d - tf / 2;
          const Qflange = bf * tf * (yf - ybar);
          const hAbove = d - tf - ylocal;
          const yCentroidAbove = ylocal + hAbove / 2 - ybar;
          const Qweb = tw * hAbove * yCentroidAbove;
          return { Q: Math.abs(Qflange + Qweb), t: tw };
        }
      }
      case 'custom':
      default:
        return { Q: 0, t: 1 };
    }
  }
}
