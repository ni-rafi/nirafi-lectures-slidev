import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Presentation, ChevronLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useUserContext } from '@/context/UserContext';
import { SUBJECTS } from '@/config/lectures';

/**
 * AppSidebar displays navigation, subjects list, active lecture slide TOC, and student status.
 */
export const AppSidebar: React.FC = () => {
  const { subjectId, sessionId, lectureId, slideNo } = useParams<{
    subjectId?: string;
    sessionId?: string;
    lectureId?: string;
    slideNo?: string;
  }>();
  const navigate = useNavigate();
  const { rollNumber, session, logout } = useUserContext();
  const { setOpenMobile } = useSidebar();

  const isSlideMode = !!(subjectId && sessionId && lectureId);
  const currentSlideInt = slideNo ? parseInt(slideNo, 10) : 1;

  // Find current subject and lecture detail from registry
  const currentSubject = SUBJECTS.find((sub) => sub.id === subjectId);
  const currentSession = currentSubject?.sessions.find((sess) => sess.id === sessionId);
  const currentLecture = currentSession?.lectures.find((lec) => lec.id === lectureId);

  // Helper to change slide
  const handleSlideClick = (slideIndex: number) => {
    if (isSlideMode) {
      navigate(`/${subjectId}/${sessionId}/${lectureId}/${slideIndex}`);
      setOpenMobile(false); // Close sidebar on mobile after clicking
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header - Portal Branding */}
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground hover:opacity-90">
          <GraduationCap className="h-6 w-6 text-primary shrink-0" />
          <span className="truncate text-sm tracking-tight font-bold">CEE Lectures</span>
        </Link>
      </SidebarHeader>

      <Separator />

      {/* Main Sidebar Contents */}
      <SidebarContent>
        {isSlideMode ? (
          // Slide viewer specific navigation (Table of Contents / Jump list)
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 flex items-center justify-between">
              <span className="truncate max-w-[120px] uppercase font-mono font-bold">
                {currentSubject?.courseCode || 'Deck Slides'}
              </span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                {currentLecture?.title}
              </span>
            </SidebarGroupLabel>

            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                {/* Back to Portal button */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="default" className="text-muted-foreground hover:text-foreground">
                    <Link to="/" onClick={() => setOpenMobile(false)}>
                      <ChevronLeft className="h-4 w-4 shrink-0" />
                      <span>Back to Portal</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <Separator className="my-2" />

                {/* Generate standard slide index links (1 to 10 for TOC) */}
                {Array.from({ length: 10 }, (_, i) => i + 1).map((idx) => {
                  const isActive = currentSlideInt === idx;
                  return (
                    <SidebarMenuItem key={idx}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => handleSlideClick(idx)}
                        className={`w-full justify-start text-xs font-medium ${
                          isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-accent'
                        }`}
                      >
                        <Presentation className="h-3.5 w-3.5 shrink-0" />
                        <span>Slide {idx}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          // Main Portal Dashboard view list
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 font-semibold">
              Subjects
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={true}>
                    <Link to="/">
                      <LayoutDashboard className="h-4 w-4 shrink-0" />
                      <span>Lecture Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {SUBJECTS.map((sub) => (
                  <SidebarMenuItem key={sub.id}>
                    <SidebarMenuButton asChild className="hover:bg-accent text-xs">
                      <a href={`#subject-${sub.id}`}>
                        <BookOpen className="h-4 w-4 shrink-0" />
                        <span className="truncate">{sub.courseTitle}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer - Student details and log out */}
      <SidebarFooter className="p-4 border-t bg-card">
        {rollNumber ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground leading-none">
                Logged Student
              </p>
              <p className="text-xs font-semibold text-foreground leading-tight truncate">
                Reg: {rollNumber}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Sess: {session}
              </p>
            </div>
            
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive justify-start text-xs font-medium mt-1 border border-destructive/20"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Log out</span>
            </SidebarMenuButton>
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground text-center">
            Session unverified
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
