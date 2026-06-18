export const ROUTE_PATHS = {
  PORTAL: '/',
  PORTAL_LEGACY: '/1',
  SLIDE_NESTED: '/:subjectId/:sessionId/:lectureId/:slideNo',
  LECTURE_VIEW: '/:subjectId/:sessionId/:lectureId',
  BLOG_VIEW: '/:subjectId/:sessionId/:lectureId/blog',
  SLIDE_FLAT: '/:slideNo(\\d+)', // Matches a flat slide number
  ADMIN_DASHBOARD: '/:subjectId/:sessionId/admin',
  DOCS: '/docs',
  SHAPES_PLAYGROUND: '/playground/:subjectId/:sessionId/:lectureId/shapes',
};
