export const ROUTE_PATHS = {
  PORTAL: '/',
  PORTAL_LEGACY: '/1',
  SLIDE_NESTED: '/:subjectId/:sessionId/:lectureId/:slideNo',
  SLIDE_FLAT: '/:slideNo(\\d+)', // Matches a flat slide number
};
