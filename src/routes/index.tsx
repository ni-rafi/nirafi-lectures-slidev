import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ROUTE_PATHS } from './paths';
import { useUserContext } from '@/context/UserContext';
import { PageLayout } from '@/shared/components/Layout/PageLayout';
import { ClickStepsProvider } from '@/features/presentation/context/ClickStepsContext';
import LecturePortal from '@/features/portal';
import SlideViewer from '@/features/presentation';
import RollNumberGate from '@/features/gate/components/RollNumberGate';

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
          <ClickStepsProvider>
            <SlideViewer />
          </ClickStepsProvider>
        }
      />
      <Route
        path={ROUTE_PATHS.LECTURE_VIEW}
        element={
          <ClickStepsProvider>
            <SlideViewer />
          </ClickStepsProvider>
        }
      />
      <Route
        path={ROUTE_PATHS.BLOG_VIEW}
        element={
          <ClickStepsProvider>
            <SlideViewer />
          </ClickStepsProvider>
        }
      />

      {/* PageLayout wraps all authenticated routes with app sidebar and headers */}
      <Route element={<PageLayout />}>
        {/* Main Lecture Portal Dashboard */}
        <Route path={ROUTE_PATHS.PORTAL} element={<LecturePortal />} />
        <Route path={ROUTE_PATHS.PORTAL_LEGACY} element={<Navigate to={ROUTE_PATHS.PORTAL} replace />} />
        <Route path={ROUTE_PATHS.SLIDE_FLAT} element={<FlatSlideRedirect />} />

        {/* Global Fallback Redirect to Dashboard */}
        <Route path="*" element={<Navigate to={ROUTE_PATHS.PORTAL} replace />} />
      </Route>
    </Routes>
  );
};
