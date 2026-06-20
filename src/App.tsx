import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, FirebaseProvider, UserProvider, LectureStatusProvider } from '@/context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppRoutes } from '@/routes';
import { GoeyToaster } from 'goey-toast';
import 'goey-toast/styles.css';

export const App: React.FC = () => {
  return (
    <FirebaseProvider>
      <UserProvider>
        <LectureStatusProvider>
          <ThemeProvider defaultTheme="system" defaultColorScheme="green">
            <TooltipProvider delayDuration={150}>
              <Router>
                <AppRoutes />
              </Router>
              <GoeyToaster position="top-right" duration={4000} />
            </TooltipProvider>
          </ThemeProvider>
        </LectureStatusProvider>
      </UserProvider>
    </FirebaseProvider>
  );
};
