import React from 'react';
import { usePresentation } from '@/features/presentation/context/PresentationContext';
import { Book, Bookmark, ExternalLink } from 'lucide-react';

export interface ReferenceBookItem {
  id: number;
  title: string;
  author: string;
  edition?: string;
  publisher?: string;
  url?: string;
}

interface ReferenceBooksListProps {
  title?: string;
  references: ReferenceBookItem[];
}

export const ReferenceBooksList: React.FC<ReferenceBooksListProps> = ({
  title = 'Recommended Reference Books & Material',
  references,
}) => {
  const presentation = usePresentation();
  const isBlog = presentation?.viewMode === 'blog';

  const renderBookItem = (book: ReferenceBookItem, index: number) => {
    return (
      <div
        key={book.id}
        className="flex items-start gap-4 p-3 border border-border/40 rounded-lg bg-card/10 hover:bg-card/30 hover:border-primary/30 transition-all duration-150 relative overflow-hidden"
      >
        <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 border border-primary/20 text-primary">
          <Book className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs md:text-sm font-extrabold text-foreground tracking-tight leading-snug">
              {index + 1}. {book.title}
            </h4>
            {book.url && (
              <a
                href={book.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:text-primary/80 transition-colors p-0.5 rounded shrink-0"
                title="View Book Online"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground mt-0.5">
            By {book.author}
          </span>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-muted-foreground/80 font-mono">
            {book.edition && (
              <span className="flex items-center gap-1">
                <span className="font-bold uppercase text-[8px] text-primary/80">Edition:</span> {book.edition}
              </span>
            )}
            {book.publisher && (
              <span className="flex items-center gap-1 border-l border-border/40 pl-3">
                <span className="font-bold uppercase text-[8px] text-primary/80">Publisher:</span> {book.publisher}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isBlog) {
    return (
      <div className="flex flex-col gap-4 py-4 text-left">
        <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-b pb-2">
          <Bookmark className="h-5 w-5" />
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {references.map((book, idx) => renderBookItem(book, idx))}
        </div>
      </div>
    );
  }

  // Slide Mode Layout (16:9 optimized layout)
  return (
    <div className="flex flex-col h-full select-text text-left">
      <h3 className="text-sm font-extrabold flex items-center gap-2 border-b pb-2 mb-3">
        <Bookmark className="h-4 w-4 text-primary" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 overflow-y-auto max-h-[310px] pr-1 pb-2">
        {references.map((book, idx) => renderBookItem(book, idx))}
      </div>
    </div>
  );
};

export default ReferenceBooksList;
