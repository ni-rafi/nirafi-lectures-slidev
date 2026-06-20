import { ICrossSection } from './stress.interface';

export interface ISectionProperties {
  area: number;     // A in m^2
  centroid: number; // y_bar from bottom in m
  I: number;        // Moment of Inertia about neutral axis in m^4
}

export class CrossSectionEngine {
  static calculateProperties(shape: ICrossSection, defaultI: number = 100e-6): ISectionProperties {
    switch (shape.type) {
      case 'rectangular': {
        const b = shape.width ?? 0.1;  // default 100mm
        const h = shape.height ?? 0.2; // default 200mm
        const area = b * h;
        const centroid = h / 2;
        const I = (b * h * h * h) / 12;
        return { area, centroid, I };
      }
      case 'circular': {
        const d = shape.diameter ?? 0.1; // default 100mm
        const area = (Math.PI * d * d) / 4;
        const centroid = d / 2;
        const I = (Math.PI * Math.pow(d, 4)) / 64;
        return { area, centroid, I };
      }
      case 'i-beam':
      case 'channel': {
        const d = shape.height ?? 0.2;          // default 200mm
        const bft = shape.width ?? 0.15;         // default 150mm
        const tft = shape.thicknessFlange ?? 0.01; // default 10mm
        const bfb = shape.widthBottom ?? bft;
        const tfb = shape.thicknessFlangeBottom ?? tft;
        const tw = shape.thicknessWeb ?? 0.006;  // default 6mm

        const Aft = bft * tft;
        const Afb = bfb * tfb;
        const hw = d - tft - tfb;
        const Aw = tw * hw;
        const area = Aft + Afb + Aw;

        const yft = d - tft / 2;
        const yfb = tfb / 2;
        const yw = tfb + hw / 2;
        const centroid = (Aft * yft + Afb * yfb + Aw * yw) / area;

        const Ift = (bft * Math.pow(tft, 3)) / 12 + Aft * Math.pow(yft - centroid, 2);
        const Ifb = (bfb * Math.pow(tfb, 3)) / 12 + Afb * Math.pow(yfb - centroid, 2);
        const Iw = (tw * Math.pow(hw, 3)) / 12 + Aw * Math.pow(yw - centroid, 2);
        const I = Ift + Ifb + Iw;

        return { area, centroid, I };
      }
      case 't-beam': {
        const d = shape.height ?? 0.2;           // default 200mm
        const bf = shape.width ?? 0.15;          // default 150mm
        const tf = shape.thicknessFlange ?? 0.01; // default 10mm
        const tw = shape.thicknessWeb ?? 0.008;   // default 8mm

        const Af = bf * tf;
        const yf = d - tf / 2;
        const Aw = tw * (d - tf);
        const yw = (d - tf) / 2;

        const area = Af + Aw;
        const centroid = (Af * yf + Aw * yw) / area;

        const Iflange = (bf * Math.pow(tf, 3)) / 12 + Af * Math.pow(yf - centroid, 2);
        const Iweb = (tw * Math.pow(d - tf, 3)) / 12 + Aw * Math.pow(yw - centroid, 2);
        const I = Iflange + Iweb;

        return { area, centroid, I };
      }
      case 'custom':
      default:
        // Returns default fallback properties based on the manual I value
        return {
          area: 0.01,
          centroid: 0.1,
          I: defaultI,
        };
    }
  }
}
