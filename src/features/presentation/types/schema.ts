import React from 'react';

export type FragmentNode =
  | string
  | { highlight: string; at: number; variant?: 'paint' | 'marker' | 'rect' | 'text' | 'strike' };

export interface SchemaListElement {
  listTitle?: string;
  description?: string;
  items: Array<{
    title?: React.ReactNode;
    text: React.ReactNode;
    revealAt?: number | string;
    icon?: React.ReactNode;
  }>;
}

export interface SchemaTableElement {
  headers: Array<
    | string
    | {
        label: string;
        align?: 'left' | 'center' | 'right';
        revealAt?: number | string;
      }
  >;
  rows: Array<Array<React.ReactNode>>;
}

export interface SchemaLatexElement {
  title?: string;
  formulaParts: Array<
    | string
    | {
        highlight: string;
        at: number;
        variant?: 'paint' | 'marker' | 'rect' | 'text' | 'strike';
      }
  >;
}

export interface SchemaParagraphElement {
  fragments: FragmentNode[];
}

export type PhysicalUnit = 'm' | 'cm' | 'mm';

export interface ShapeDimensions {
  length?: number;     // Physical length/width
  height?: number;     // Physical height
  diameter?: number;   // Circle diameter
  diagonal1?: number;  // Rhombus diagonal 1
  diagonal2?: number;  // Rhombus diagonal 2
  rIn?: number;        // Star inner radius
  rOut?: number;       // Star outer radius
  s?: number;          // Side length for pentagon/hexagon
}

export interface VisualCanvasShape {
  id: string;
  type:
    | 'rect'
    | 'circle'
    | 'triangle'
    | 'star'
    | 'arrow'
    | 'text'
    | 'pentagon'
    | 'hexagon'
    | 'cross'
    | 'heart'
    | 'parallelogram'
    | 'rhombus'
    | 'polygon'
    | 'udl'
    | 'uvl'
    | 'moment'
    | 'point-load'
    | 'support-pin'
    | 'support-roller'
    | 'support-fixed'
    | 'hinge'
    | 'rounded-arrow';
  x: number;           // Absolute position on 980 grid
  y: number;           // Absolute position on 551.25 grid
  w: number;           // Computed pixel width
  h: number;           // Computed pixel height
  rotate?: number;
  label?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  enterAt: number;
  exitAt?: number;
  animation?: 'fade' | 'scale' | 'none';
  showDimensionLines?: boolean;
  dimensions?: ShapeDimensions;
  points?: Array<{ x: number; y: number }>;
  borderRadius?: number;
  momentDirection?: 'cw' | 'ccw';
  pointLoadDirection?: 'down' | 'up' | 'left' | 'right';
  uvlStartHeight?: number;
  uvlEndHeight?: number;
  udlSegmentsCount?: number;
}

export interface PlaygroundPage {
  id: string;
  name: string;
  elements: VisualCanvasShape[];
  scaleFactor: {
    pixelsPerUnit: number;
    unit: PhysicalUnit;
  };
}

export interface SlideSchemaElement {
  type:
    | 'rich-paragraph'
    | 'list'
    | 'table'
    | 'latex'
    | 'rebar-calculator-inputs'
    | 'rebar-calculator-outputs'
    | 'quiz'
    | 'composite'
    | 'visual-canvas'
    | 'highlightable-list'
    | 'master-detail-panel'
    | 'interactive-schedule-table'
    | 'reference-legends'
    | 'reference-books-list';
  config?: unknown;
  data?: unknown;
}

export interface SlideSchema {
  id: number;
  section: string;
  metadata: {
    title: string;
    type: string;
  };
  layout: 'title' | 'twocolumn' | 'fullwidth' | 'thankyou' | 'title-v2';
  props: {
    title?: string;
    subtitle?: string;
    description?: string;
    footer?: string;
    bgVariant?: 'default' | 'calculation' | 'gallery' | 'cover';
    leftWidth?: string;
    leftElement?: SlideSchemaElement;
    rightElement?: SlideSchemaElement;
    element?: SlideSchemaElement;
    courseCode?: string;
    courseTitle?: string;
    yearSemester?: string;
    creditHours?: string;
    usnCode?: string;
    session?: string;
  };
}
