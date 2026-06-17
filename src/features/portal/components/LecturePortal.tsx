import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Lock, Play, Sparkles, ChevronDown, Printer, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUBJECTS } from '@/config/lectures';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * LecturePortal renders the main student dashboard listing registered subjects,
 * academic sessions, and individual lecture decks.
 */
export const LecturePortal: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Academic Session 2026-27</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome to CEE Lectures Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore interactive presentation slides, run civil engineering calculations in real-time wizards, and verify concepts in active quizzes.
          </p>
        </div>
      </div>

      {/* Subjects Catalog */}
      <div className="flex flex-col gap-10">
        {SUBJECTS.map((subject) => (
          <section
            key={subject.id}
            id={`subject-${subject.id}`}
            className="scroll-mt-20 flex flex-col gap-4"
          >
            {/* Subject Info Header */}
            <div className="flex items-center gap-3 border-b pb-2">
              <span className="text-2xl" role="img" aria-label={subject.title}>
                {subject.iconEmoji}
              </span>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-foreground">
                  {subject.title} ({subject.code})
                </h2>
                <p className="text-xs text-muted-foreground">{subject.description}</p>
              </div>
            </div>

            {/* Sessions & Lecture Cards list */}
            {subject.sessions.map((session) => (
              <div key={session.id} className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {session.label}
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {session.lectures.map((lecture) => {
                    const deckUrl = `/${subject.id}/${session.id}/${lecture.id}`;
                    
                    return (
                      <div
                        key={lecture.id}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 shadow-xs transition-all duration-300 ${
                          lecture.locked
                            ? 'opacity-75 border-muted bg-muted/20'
                            : 'hover:scale-[1.01] hover:shadow-md hover:border-primary/30'
                        }`}
                      >
                        {/* Subject Top Theme Accent border */}
                        <div
                          className="absolute top-0 left-0 h-1 w-full"
                          style={{ backgroundColor: subject.color }}
                        />

                        {/* Lecture Meta info */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
                              {lecture.title}
                            </h4>
                            {lecture.locked && (
                              <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {lecture.description}
                          </p>
                        </div>

                        {/* Card bottom actions/tags */}
                        <div className="mt-5 flex items-center justify-between border-t pt-3 gap-2">
                          {/* Duration Badge */}
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span>{lecture.durationMins} mins</span>
                          </span>

                          {/* Action Button */}
                          {lecture.locked ? (
                            <span className="inline-flex items-center gap-1 rounded bg-muted-foreground/10 px-2 py-1 text-[10px] font-semibold text-muted-foreground font-mono">
                              LOCKED
                            </span>
                          ) : (
                            <div className="flex items-center">
                              {/* Main Launch Button */}
                              <Button
                                asChild
                                size="sm"
                                variant="default"
                                className="h-8 text-[11px] font-semibold gap-1.5 px-3 shadow-xs rounded-r-none"
                              >
                                <Link to={deckUrl}>
                                  <Play className="h-3 w-3 fill-current shrink-0" />
                                  <span>Launch Slides</span>
                                </Link>
                              </Button>

                              {/* Dropdown Menu Trigger Button */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="h-8 px-1.5 shadow-xs rounded-l-none border-l border-primary-foreground/10"
                                  >
                                    <ChevronDown className="h-3.5 w-3.5" />
                                    <span className="sr-only">Export Options</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={`${deckUrl}?print=true`}
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
                                      href={`${deckUrl}?print=true&annotations=true`}
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
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

export default LecturePortal;
