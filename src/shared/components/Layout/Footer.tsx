import React from 'react';

/**
 * Footer renders the branding and institutional details at the bottom of the page.
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-background py-4 px-6 text-center text-xs text-muted-foreground">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row max-w-7xl mx-auto">
        <div className="flex flex-col items-center sm:items-start">
          <span className="font-semibold text-foreground">Md. Nazmul Islam Rafi's Workspace</span>
          <span>Lecturer, Civil and Environmental Engineering</span>
          <span>Shahjalal University of Science & Technology</span>
        </div>
        <div className="flex flex-col items-center sm:items-end">
          <span>&copy; {currentYear} Md. Nazmul Islam Rafi. All rights reserved.</span>
          <span>Developed for lectures, calculations, and engineering tools.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
