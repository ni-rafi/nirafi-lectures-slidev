import React from 'react';

interface GlobalTopProps {
  subjectName: string;
  subjectCode: string;
  lectureTitle: string;
  hide?: boolean;
}

/**
 * GlobalTop renders a persistent header layer inside the slide canvas sheet.
 * Hidden on cover layout pages.
 */
export const GlobalTop: React.FC<GlobalTopProps> = ({
  subjectName,
  subjectCode,
  lectureTitle,
  hide = false,
}) => {
  if (hide) {
    return null;
  }

  return (
    <div
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-1.5 pb-1 select-none pointer-events-none"
      data-global-top
    >
      <div className="text-[9px] font-bold tracking-wider text-muted-foreground/75 uppercase">
        {subjectCode} • {subjectName}
      </div>
      <div className="text-[9px] font-medium tracking-wider text-muted-foreground/60 uppercase">
        {lectureTitle}
      </div>
    </div>
  );
};

export default GlobalTop;
