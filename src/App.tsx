import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, FirebaseProvider, UserProvider, LectureStatusProvider } from '@/context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppRoutes } from '@/routes';

export const App: React.FC = () => {
  return (
    <FirebaseProvider>
      <UserProvider>
        <LectureStatusProvider>
          <ThemeProvider defaultTheme="system" defaultColorScheme="neutral">
            <TooltipProvider delayDuration={150}>
              <Router>
                <AppRoutes />
              </Router>
            </TooltipProvider>
          </ThemeProvider>
        </LectureStatusProvider>
      </UserProvider>
    </FirebaseProvider>
  );
};
