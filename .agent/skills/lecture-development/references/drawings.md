# Drawing Canvases & Structural Editors Reference Guide

This document covers the parameterized drawing engines and interactive canvasses under `src/features/building-drawing/` and `src/features/civil-drawing/`. These components render high-fidelity, theme-adaptive engineering blueprints from JSON parameters.

---

## 1. Building Drawing Canvases (`src/features/building-drawing/`)

Used to render plan-view layouts and structural micro-sections for concrete slabs, beams, columns, and walls.

### PlanDrawingCanvas
Displays column grids, clear-span beam offsets, dynamic door swings, and window frames. Supports drag-to-reposition and snap-to-grid actions.
* **Props**:
  * `axesX: number[]` - Horizontal gridline positions (e.g. `[0, 3000, 6000]`)
  * `axesY: number[]` - Vertical gridline positions (e.g. `[0, 4000, 8000]`)
  * `columns: ColumnSpec[]` - Array of columns snapping to intersections (e.g. `grid: "A-1"`, size, rotation)
  * `beams: BeamSpec[]` - Array of beams between columns (autotrimmed)
  * `openings?: OpeningSpec[]` - Doors and window frames with swings
  * `highlightedBeamId?: string` - Highlights a specific span (with fraction overrides)
* **Example**:
  ```tsx
  <PlanDrawingCanvas
    axesX={[0, 3000, 6000]}
    axesY={[0, 4000]}
    columns={[{ id: "c1", grid: "A-1", width: 400, depth: 400 }]}
    beams={[{ id: "b1", fromCol: "c1", toCol: "c2", width: 300 }]}
  />
  ```

### SectionDrawingCanvas
Renders concrete details, links/stirrups, and longitudinal bar arrays with labels.
* **Props**:
  * `width: number`, `depth: number` - Concrete core dimensions
  * `clearCover: number` - Clearance distance in mm
  * `longBars: LongBarSpec` - Top and bottom rebar counts and diameters
  * `links: StirrupSpec` - Diameter, spacing, and hook specs
* **Example**:
  ```tsx
  <SectionDrawingCanvas width={300} depth={500} clearCover={40} />
  ```

---

## 2. Civil Structural Drawings (`src/features/civil-drawing/`)

Used for foundations, highway camber pavement courses, and topographical volume calculators.

### FoundationDrawingCanvas
Renders centered pile cap plan grids and elevation cross-sections stacked vertically with dimensions.
* **Props**:
  * `spec: FoundationSpec`
    * `pileCount: number` - Supports 1 to 6 piles arranged symmetrically
    * `pileDiameter: number`, `pileDepth: number` - Shaft specifications (in mm)
    * `capWidth: number`, `capDepth: number` - Foundation cap dimensions
    * `clearCover: number` - Clear cover distance
    * `capRebar?: CapRebarDetails` - Starter L-bars, top/bottom meshes
    * `soilLayers: SoilLayer[]` - Strata labels and dynamic colors
  * `activeView?: 'all' | 'plan' | 'section'` - Stacked layout vs single view
* **Example**:
  ```tsx
  <FoundationDrawingCanvas
    spec={{
      id: "f1",
      pileCount: 4,
      pileDiameter: 600,
      pileDepth: 12000,
      capWidth: 2400,
      capDepth: 900,
      clearCover: 75,
      soilLayers: [{ depth: 3000, label: "Soft Silt", colorClass: "fill-amber-900/10" }]
    }}
  />
  ```

### RoadSectionCanvas
Renders sloped pavement courses, shoulders, and side drainage V-trenches.
* **Props**:
  * `spec: RoadSectionSpec`
    * `carriagewayWidth: number` - Total road bed width (in mm)
    * `camberPercentage: number` - Crown slope (e.g. `2.5` for 2.5%)
    * `layers: PavementLayerSpec[]` - Wear, base, and flat subgrade courses
    * `shoulder?: ShoulderSpec` - Sloped shoulder aggregates
    * `drainage?: DrainageSpec` - V-drain width, depth, and offset clearance
* **Example**:
  ```tsx
  <RoadSectionCanvas
    spec={{
      id: "r1",
      carriagewayWidth: 7000,
      camberPercentage: 2.5,
      layers: [
        { id: "l1", name: "Wearing Course", thickness: 40, colorClass: "fill-zinc-800" },
        { id: "l2", name: "Subgrade (Flat)", thickness: 300, colorClass: "fill-zinc-400/20", isSubgrade: true }
      ]
    }}
  />
  ```

### EarthworkProfileCanvas
Topographical sandbox overlaying existing ground lines (EGL) and formation bed levels (FL). Automatically computes cut/fill volumes using Shoelace math and labels centroids.
* **Props**:
  * `spec: EarthworkSpec`
    * `eglPoints: Point2D[]` - Surveyed ground nodes (x, y)
    * `formationLevel: number` - Target flat bed level (y)
    * `formationWidth: number` - Base bed width
    * `sideSlopeCutRatio: number` - Horizontal:Vertical cut slope (e.g. 1.5)
    * `sideSlopeFillRatio: number` - Horizontal:Vertical fill slope (e.g. 2.0)
    * `isTrenchExcavation?: boolean` - Forces vertical shoring retaining walls
    * `workingSpaceAllowance?: number` - Lateral clearance buffer
  * `scaleFactor?: number` - Area conversion divisor (default: `1000000` for mm² to m²)
  * `showLabels?: boolean` - Toggles area centroid banners
* **Example**:
  ```tsx
  <EarthworkProfileCanvas
    spec={{
      id: "ew1",
      eglPoints: [{ x: 0, y: 150 }, { x: 50, y: 180 }, { x: 100, y: 100 }],
      formationLevel: 140,
      formationWidth: 30,
      sideSlopeCutRatio: 1.5,
      sideSlopeFillRatio: 2.0
    }}
    scaleFactor={1} // EGL coordinates in meters
  />
  ```
