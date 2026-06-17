import React from 'react';

export const SlideViewer: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto my-6 bg-card text-card-foreground border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Academic Slide Presentation View</h2>
      <p className="text-sm text-muted-foreground">Slide view and navigation controls.</p>
    </div>
  );
};
export default SlideViewer;
