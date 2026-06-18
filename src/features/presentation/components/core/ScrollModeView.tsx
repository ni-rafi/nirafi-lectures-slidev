import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Sun, Moon, ChevronDown, Printer, FileDown, Palette, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageMetadata from './PageMetadata';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TwoWayGridOrchestrator from './TwoWayGridOrchestrator';
import BlogOrchestrator from './BlogOrchestrator';
import { useSlideViewerOrchestrator } from '../../hooks/useSlideViewerOrchestrator';
import ThemePlaygroundPanel from '../tools/ThemePlaygroundPanel';
import OnThisPage from '../layers/OnThisPage';

interface ScrollModeViewProps {
  orchestrator: ReturnType<typeof useSlideViewerOrchestrator>;
}

export const ScrollModeView: React.FC<ScrollModeViewProps> = ({ orchestrator }) => {
  const navigate = useNavigate();
  const [isThemePlaygroundOpen, setIsThemePlaygroundOpen] = React.useState(false);
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  const {
    activeSub,
    activeSession,
    activeLec,
    totalSlidesCount,
    activeSlide,
    activeTheme,
    subjectId,
    sessionId,
    lectureId,
    presenterFeatures,
    navigateWithTransition,
  } = orchestrator;

  if (!activeSub || !activeLec) return null;

  return (
    <div className="relative flex h-screen w-full flex-col bg-background overflow-hidden animate-in fade-in duration-300">
      <PageMetadata title={activeLec.title} subjectCode={activeSub.courseCode} slideNo={activeSlide} />

      {/* Sticky blurred header panel */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Portal</span>
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-foreground">
              {activeLec.title}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {activeSub.courseCode} • {activeSub.courseTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme customizer button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsThemePlaygroundOpen(true)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="Customize Theme"
          >
            <Palette className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={presenterFeatures.handleToggleDark}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            {presenterFeatures.isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Blog Mode Toggle */}
          <Button
            variant={orchestrator.viewMode === 'blog' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (orchestrator.viewMode === 'blog') {
                navigateWithTransition(`/${subjectId}/${sessionId}/${lectureId}`);
              } else {
                navigateWithTransition(`/${subjectId}/${sessionId}/${lectureId}/blog`);
              }
            }}
            className="flex items-center gap-1.5 font-semibold shadow-xs"
            title={orchestrator.viewMode === 'blog' ? 'Switch to Slide View' : 'Switch to Blog Mode'}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              {orchestrator.viewMode === 'blog' ? 'Slide View' : 'Blog Mode'}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 font-semibold shadow-xs"
              >
                <span>Export PDF</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <a
                  href={`/${subjectId}/${sessionId}/${lectureId}?print=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 cursor-pointer w-full text-xs"
                >
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Export PDF (Normal)</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`/${subjectId}/${sessionId}/${lectureId}?print=true&annotations=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 cursor-pointer w-full text-xs"
                >
                  <FileDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Export with Annotations</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            onClick={() => {
              navigateWithTransition(`/${subjectId}/${sessionId}/${lectureId}/1`);
            }}
            className="flex items-center gap-1.5 font-semibold shadow-xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Start Presentation</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto relative">
          {orchestrator.viewMode === 'blog' ? (
            <BlogOrchestrator
              subject={activeSub}
              lecture={activeLec}
              session={activeSession}
              viewMode="blog"
              theme={activeTheme}
              totalSlides={totalSlidesCount}
              collapsedSections={collapsedSections}
              setCollapsedSections={setCollapsedSections}
            />
          ) : (
            <TwoWayGridOrchestrator
              subject={activeSub}
              lecture={activeLec}
              session={activeSession}
              viewMode="scroll"
              theme={activeTheme}
              totalSlides={totalSlidesCount}
              onSelectSlide={(num) => {
                navigateWithTransition(`/${subjectId}/${sessionId}/${lectureId}/${num}`);
              }}
              currentSlide={activeSlide}
              collapsedSections={collapsedSections}
              setCollapsedSections={setCollapsedSections}
            />
          )}
        </main>
        <aside className="hidden xl:block w-72 shrink-0 border-l border-border bg-card/30 p-6 flex flex-col min-h-0 overflow-hidden">
          <OnThisPage
            subject={activeSub}
            lecture={activeLec}
            session={activeSession}
            totalSlides={totalSlidesCount}
            activeSlide={activeSlide}
            scrollContainerRef={scrollContainerRef}
            collapsedSections={collapsedSections}
            setCollapsedSections={setCollapsedSections}
          />
        </aside>
      </div>

      <ThemePlaygroundPanel
        isOpen={isThemePlaygroundOpen}
        onClose={() => setIsThemePlaygroundOpen(false)}
      />
    </div>
  );
};

export default ScrollModeView;
