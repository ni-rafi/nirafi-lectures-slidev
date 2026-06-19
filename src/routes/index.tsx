import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ROUTE_PATHS } from './paths';
import { useUserContext, useLectureStatus } from '@/context';
import { PageLayout } from '@/shared/components/Layout/PageLayout';
import { ClickStepsProvider } from '@/features/presentation/context/ClickStepsContext';
import LecturePortal from '@/features/portal';
import { SlideViewer } from '@/features/presentation/components/core';
import RollNumberGate from '@/features/gate/components/RollNumberGate';
import AdminClassDashboard from '@/features/portal/components/AdminClassDashboard';
import SlideCustomizationDocs from '@/features/docs/SlideCustomizationDocs';
import ShapeBuilderPlayground from '@/features/presentation/components/tools/playground/ShapeBuilderPlayground';

/**
 * Handles legacy Slidev flat slide number requests (e.g. /5) by
 * mapping/redirecting them to the main portal dashboard or standard layout.
 */
const FlatSlideRedirect: React.FC = () => {
  const { slideNo } = useParams<{ slideNo: string }>();
  console.info(`Redirecting legacy flat slide request: P${slideNo}`);
  return <Navigate to={ROUTE_PATHS.PORTAL} replace />;
};

/**
 * Guard component that redirects students back to the dashboard if the lecture is locked.
 */
const LectureRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { subjectId, sessionId, lectureId } = useParams<{ subjectId: string; sessionId: string; lectureId: string }>();
  const { isLectureLocked } = useLectureStatus();
  const { userProfile } = useUserContext();

  if (subjectId && sessionId && lectureId) {
    const isLocked = isLectureLocked(subjectId, sessionId, lectureId);
    const isAdmin = userProfile?.role === 'admin';
    if (isLocked && !isAdmin) {
      console.warn(`[LectureRouteGuard] Direct access denied to locked lecture: ${subjectId}/${sessionId}/${lectureId}`);
      return <Navigate to={ROUTE_PATHS.PORTAL} state={{ alertMessage: 'This lecture is currently locked.' }} replace />;
    }
  }

  return <>{children}</>;
};

/**
 * Guard component that restricts routes to administrators only.
 */
const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useUserContext();
  const isAdmin = userProfile?.role === 'admin';

  if (!isAdmin) {
    console.warn('[AdminRouteGuard] Access denied to non-admin user.');
    return <Navigate to={ROUTE_PATHS.PORTAL} replace />;
  }

  return <>{children}</>;
};


/**
 * AppRoutes renders the page-level route map using React Router.
 */
export const AppRoutes: React.FC = () => {
  const { isLoggedIn, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs font-medium text-muted-foreground">Initializing academic deck...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <RollNumberGate />;
  }

  return (
    <Routes>
      {/* Immersive Slide Deck Viewer outside of dashboard layout */}
      <Route
        path={ROUTE_PATHS.SLIDE_NESTED}
        element={
          <LectureRouteGuard>
            <ClickStepsProvider>
              <SlideViewer />
            </ClickStepsProvider>
          </LectureRouteGuard>
        }
      />
      <Route
        path={ROUTE_PATHS.LECTURE_VIEW}
        element={
          <LectureRouteGuard>
            <ClickStepsProvider>
              <SlideViewer />
            </ClickStepsProvider>
          </LectureRouteGuard>
        }
      />
      <Route
        path={ROUTE_PATHS.BLOG_VIEW}
        element={
          <LectureRouteGuard>
            <ClickStepsProvider>
              <SlideViewer />
            </ClickStepsProvider>
          </LectureRouteGuard>
        }
      />
      <Route
        path={ROUTE_PATHS.SHAPES_PLAYGROUND}
        element={
          <AdminRouteGuard>
            <ShapeBuilderPlayground />
          </AdminRouteGuard>
        }
      />

      {/* PageLayout wraps all authenticated routes with app sidebar and headers */}
      <Route element={<PageLayout />}>
        {/* Main Lecture Portal Dashboard */}
        <Route path={ROUTE_PATHS.PORTAL} element={<LecturePortal />} />
        <Route path={ROUTE_PATHS.ADMIN_DASHBOARD} element={<AdminClassDashboard />} />
        <Route path={ROUTE_PATHS.PORTAL_LEGACY} element={<Navigate to={ROUTE_PATHS.PORTAL} replace />} />
        <Route path={ROUTE_PATHS.SLIDE_FLAT} element={<FlatSlideRedirect />} />
        <Route path={ROUTE_PATHS.DOCS} element={<SlideCustomizationDocs />} />

        {/* Global Fallback Redirect to Dashboard */}
        <Route path="*" element={<Navigate to={ROUTE_PATHS.PORTAL} replace />} />
      </Route>
    </Routes>
  );
};
