import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Presentation, ChevronLeft, Calculator, Compass, User, ChevronsUpDown } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const location = useLocation();
  const { rollNumber, session, logout, userProfile } = useUserContext();
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
    <Sidebar collapsible="icon" variant="sidebar" className="border-r-border/50">
      <SidebarHeader className="flex h-16 items-center px-4 justify-start group-data-[collapsible=icon]:justify-center transition-all duration-200">
        <Link to="/" className="flex h-full items-center justify-start group-data-[collapsible=icon]:justify-center font-semibold text-foreground hover:opacity-90 w-full">
          <span className="truncate text-sm tracking-tight font-bold group-data-[collapsible=icon]:hidden">Rafi's Workspace</span>
          <span className="hidden group-data-[collapsible=icon]:inline text-sm tracking-tight font-extrabold text-primary select-none">RW</span>
        </Link>
      </SidebarHeader>

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
                {/* Back to Workspace button */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="default" className="text-muted-foreground hover:text-foreground">
                    <Link to="/" onClick={() => setOpenMobile(false)}>
                      <ChevronLeft className="h-4 w-4 shrink-0" />
                      <span>Back to Workspace</span>
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
                        className={`w-full justify-start text-xs font-medium ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-accent'
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
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 font-semibold">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                      <Link to="/" onClick={() => setOpenMobile(false)}>
                        <LayoutDashboard className="h-4 w-4 shrink-0" />
                        <span>Workspace Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/docs'}>
                      <Link to="/docs" onClick={() => setOpenMobile(false)}>
                        <BookOpen className="h-4 w-4 shrink-0" />
                        <span>Documentation</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="px-2 font-semibold">
                Subjects
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  {SUBJECTS.map((sub) => {
                    let SubjectIcon = BookOpen;
                    if (sub.id === 'quantity-surveying') {
                      SubjectIcon = Calculator;
                    } else if (sub.id === 'engineering-mechanics') {
                      SubjectIcon = Compass;
                    }
                    return (
                      <SidebarMenuItem key={sub.id}>
                        <SidebarMenuButton asChild className="hover:bg-accent text-xs">
                          <a href={`/#subject-${sub.id}`}>
                            <SubjectIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{sub.courseTitle}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer - Student details and log out */}
      <SidebarFooter className="p-2 border-t bg-card transition-all duration-200">
        {rollNumber ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full justify-start gap-2 hover:bg-accent cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
              >
                {/* User avatar/initials or icon */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0 select-none">
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </div>

                {/* Expanded metadata */}
                <div className="flex flex-col text-left min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-xs font-bold text-foreground truncate">
                    {userProfile?.name || 'User'}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {userProfile?.email || `Reg: ${rollNumber}`}
                  </span>
                </div>

                {/* Chevron */}
                <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-56 p-2 flex flex-col gap-1.5 bg-card">
              <div className="flex flex-col px-2 py-1.5 text-xs border-b">
                <span className="font-bold text-foreground truncate">
                  {userProfile?.name || 'User'}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider mt-0.5">
                  {userProfile?.role === 'admin' ? 'Logged Admin' : 'Logged Student'}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Reg: {rollNumber}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Session: {session}
                </span>
                {userProfile?.email && (
                  <span className="text-[10px] text-muted-foreground font-mono mt-1 break-all select-all">
                    {userProfile.email}
                  </span>
                )}
              </div>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive text-xs py-1.5"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="text-[10px] text-muted-foreground text-center py-2 group-data-[collapsible=icon]:hidden">
            Session unverified
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
