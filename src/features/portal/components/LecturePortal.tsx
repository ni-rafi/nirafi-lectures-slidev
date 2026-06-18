import React from 'react';
import { Sparkles } from 'lucide-react';
import { SUBJECTS } from '@/config/lectures';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import LectureCard from './LectureCard';

/**
 * LecturePortal renders the main student dashboard listing registered subjects,
 * academic sessions, and individual lecture decks.
 */
export const LecturePortal: React.FC = () => {
  const latestSessionLabel = React.useMemo(() => {
    let latestYear = 0;
    let latestLabel = '';
    
    SUBJECTS.forEach((subject) => {
      subject.sessions.forEach((session) => {
        const match = session.label.match(/\d+/);
        if (match) {
          const year = parseInt(match[0], 10);
          if (year > latestYear) {
            latestYear = year;
            latestLabel = session.label;
          }
        }
      });
    });
    
    return latestLabel || 'Session 2026–27';
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Latest: {latestSessionLabel}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome to Md. Nazmul Islam Rafi's Workspace
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
            {/* Subject Info Header Banner */}
            <div className="relative overflow-hidden rounded-lg border bg-linear-to-r from-card to-muted/20 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ backgroundColor: subject.color }}
              />
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background border shadow-xs text-2xl" role="img" aria-label={subject.courseTitle}>
                  {subject.iconEmoji}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-md font-bold tracking-tight text-foreground">
                    {subject.courseTitle}
                  </h2>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    {subject.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0">
                <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold font-mono tracking-wider border bg-primary/10 text-primary uppercase">
                  {subject.courseCode}
                </span>
              </div>
            </div>

            {/* Sessions Accordion List */}
            <Accordion
              type="multiple"
              defaultValue={subject.sessions.map((s) => s.id)}
              className="w-full gap-3 flex flex-col"
            >
              {subject.sessions.map((session) => (
                <AccordionItem
                  key={session.id}
                  value={session.id}
                  className="border rounded-lg bg-card overflow-hidden"
                >
                  <AccordionTrigger className="px-5 py-3 hover:no-underline bg-muted/10 hover:bg-muted/20 transition-colors flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {session.label}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pt-5 pb-5">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {session.lectures.map((lecture) => {
                        const deckUrl = `/${subject.id}/${session.id}/${lecture.id}`;
                        return (
                          <LectureCard
                            key={lecture.id}
                            lecture={lecture}
                            deckUrl={deckUrl}
                            subjectColor={subject.color}
                          />
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
};

export default LecturePortal;
