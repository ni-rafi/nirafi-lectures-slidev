import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Header from './Header';
import Footer from './Footer';


interface PageLayoutProps {
  children?: React.ReactNode;
}

/**
 * PageLayout coordinates the global dashboard frame, sidebar panel, breadcrumb header, and dynamic themes.
 */
export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { subjectId } = useParams<{ subjectId?: string }>();

  // Determine dynamic subject theme class
  const themeClass =
    subjectId === 'quantity-surveying'
      ? 'theme-green'
      : subjectId === 'web-development'
      ? 'theme-blue'
      : 'theme-neutral';

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full ${themeClass}`}>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <Header />
          
          {/* Main Content Pane */}
          <main className="flex-1 overflow-y-auto">
            {children ?? <Outlet />}
          </main>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default PageLayout;
