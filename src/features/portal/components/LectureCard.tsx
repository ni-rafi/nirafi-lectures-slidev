import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Lock, Play, ChevronDown, Printer, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Lecture } from '@/config/lectures';

interface LectureCardProps {
  lecture: Lecture;
  deckUrl: string;
  subjectColor: string;
}

/**
 * LectureCard renders a single lecture item on the dashboard with body padding,
 * and a theme-tinted colored actions footer.
 */
export const LectureCard: React.FC<LectureCardProps> = ({
  lecture,
  deckUrl,
  subjectColor,
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-lg border bg-card shadow-xs transition-all duration-300 ${
        lecture.locked
          ? 'opacity-75 border-muted bg-muted/20'
          : 'hover:border-primary/25'
      }`}
    >
      {/* Subject Top Theme Accent border */}
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ backgroundColor: subjectColor }}
      />

      {/* Lecture Meta info */}
      <div className="p-5 flex-1 flex flex-col gap-2">
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
      <div className="px-5 py-3.5 bg-primary/[0.04] dark:bg-primary/[0.08] flex items-center justify-between gap-2 mt-auto">
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
              variant="ghost"
              className="h-8 text-[11px] font-bold gap-1.5 px-3 rounded-r-none bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 border-r-0"
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
                  variant="ghost"
                  className="h-8 px-1.5 rounded-l-none bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 border-l border-primary/10"
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
};

export default LectureCard;
