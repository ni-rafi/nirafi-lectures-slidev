import { useUrlSyncedState } from '@/features/presentation/hooks/useUrlSyncedState';
import { PlanLayoutSchema } from '../types/layoutSchema';
import { CrossSectionSpec } from '../types/sectionSchema';

interface DrawingState {
  activeElementId: string;
  setActiveElementId: (id: string) => void;
  layoutSchema: PlanLayoutSchema;
  setLayoutSchema: (schema: PlanLayoutSchema) => void;
  sectionSpecs: CrossSectionSpec[];
  setSectionSpecs: (specs: CrossSectionSpec[]) => void;
}

/**
 * Custom hook to manage synced drawing editor states including selection and JSON schemas.
 */
export function useDrawingState(
  initialLayout: PlanLayoutSchema,
  initialSections: CrossSectionSpec[] = [],
  syncPrefix: string = 'drawing'
): DrawingState {
  const [activeElementId, setActiveElementId] = useUrlSyncedState<string>(
    `${syncPrefix}_active_element`,
    ''
  );

  const [layoutSchema, setLayoutSchema] = useUrlSyncedState<PlanLayoutSchema>(
    `${syncPrefix}_layout_schema`,
    initialLayout
  );

  const [sectionSpecs, setSectionSpecs] = useUrlSyncedState<CrossSectionSpec[]>(
    `${syncPrefix}_section_specs`,
    initialSections
  );

  return {
    activeElementId,
    setActiveElementId,
    layoutSchema,
    setLayoutSchema,
    sectionSpecs,
    setSectionSpecs,
  };
}
