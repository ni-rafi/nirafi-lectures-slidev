import React from 'react';
import { SlideParagraph } from './SlideParagraph';
import { SlideBullet } from './SlideBullet';
import { SlideEquation } from './SlideEquation';
import { SlideTable } from './SlideTable';
import { SlideList } from './SlideList';

export { SlideParagraph, SlideBullet, SlideEquation, SlideTable, SlideList };

export type ContentBlockType =
  | { type: 'paragraph'; title?: string; text: React.ReactNode; revealAt?: number | string; revealPreset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none'; variant?: 'info' | 'warning' | 'error' | 'success' | 'callout' | 'plain' | 'default' }
  | { type: 'bullet'; title?: React.ReactNode; text: React.ReactNode; revealAt?: number | string; revealPreset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none'; icon?: React.ReactNode }
  | { type: 'equation'; math: string; block?: boolean; label?: string; revealAt?: number | string; revealPreset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none' }
  | { type: 'table'; headers: Array<string | { label: string; align?: 'left' | 'center' | 'right' }>; rows: Array<Array<React.ReactNode>>; striped?: boolean; bordered?: boolean; hoverable?: boolean; revealAt?: number | string; revealPreset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none' }
  | { type: 'list'; listTitle?: string; description?: string; items: Array<{ title?: React.ReactNode; text: React.ReactNode; revealAt?: number | string; revealPreset?: 'fade' | 'fade-in' | 'up' | 'down' | 'scale' | 'none'; icon?: React.ReactNode }>; variant?: 'default' | 'plain' };

interface SlideContentProps {
  blocks: ContentBlockType[];
  className?: string;
}

export const SlideContent: React.FC<SlideContentProps> = ({ blocks, className = '' }) => {
  const rendered: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      rendered.push(
        <ul key={`list-${key}`} className="space-y-3 text-left my-2">
          {...currentList}
        </ul>
      );
      currentList = [];
    }
  };

  blocks.forEach((block, idx) => {
    if (block.type === 'bullet') {
      currentList.push(
        <SlideBullet
          key={idx}
          title={block.title}
          text={block.text}
          revealAt={block.revealAt}
          revealPreset={block.revealPreset}
          icon={block.icon}
        />
      );
    } else {
      flushList(idx);
      if (block.type === 'paragraph') {
        rendered.push(
          <SlideParagraph
            key={idx}
            title={block.title}
            text={block.text}
            revealAt={block.revealAt}
            revealPreset={block.revealPreset}
            variant={block.variant}
          />
        );
      } else if (block.type === 'equation') {
        rendered.push(
          <SlideEquation
            key={idx}
            math={block.math}
            block={block.block}
            label={block.label}
            revealAt={block.revealAt}
            revealPreset={block.revealPreset}
          />
        );
      } else if (block.type === 'table') {
        rendered.push(
          <SlideTable
            key={idx}
            headers={block.headers}
            rows={block.rows}
            striped={block.striped}
            bordered={block.bordered}
            hoverable={block.hoverable}
            revealAt={block.revealAt}
            revealPreset={block.revealPreset}
          />
        );
      } else if (block.type === 'list') {
        rendered.push(
          <SlideList
            key={idx}
            title={block.listTitle}
            description={block.description}
            items={block.items}
            variant={block.variant}
          />
        );
      }
    }
  });
  flushList(blocks.length);

  return <div className={`space-y-4 text-left select-text ${className}`}>{rendered}</div>;
};

export default SlideContent;
