import { describe, test, expect } from 'vitest';
import { z } from 'zod';
import * as ConcreteLecture from '@/lectures/quantity-surveying/session-2026/lecture-1-concrete/lecture';
import * as BrickworkLecture from '@/lectures/quantity-surveying/session-2026/lecture-2-brickwork/lecture';
import * as SteelLecture from '@/lectures/quantity-surveying/session-2026/lecture-3-steel/lecture';
import * as SlidevIntroLecture from '@/lectures/web-development/session-2026/lecture-1-slidev-intro/lecture';
import * as EngineeringMechanicsOutline from '@/lectures/engineering-mechanics/session-2024/course-outline/lecture';

// Zod schema matching SlideMetadata type requirements
const slideMetadataSchema = z.object({
  title: z.union([z.string().min(1), z.function()]),
  type: z.union([z.string().min(1), z.function()]),
  section: z.string().min(1),
  transition: z.enum(['morph', 'slide', 'fade', 'zoom', 'none']).optional(),
  quizId: z.string().optional(),
  quizVisibilityMode: z.enum(['stealth', 'placeholder']).optional(),
});

describe('Academic Slide Decks Registry & Schema Verification', () => {
  const lectureDecks = {
    'concrete': ConcreteLecture,
    'brickwork': BrickworkLecture,
    'steel': SteelLecture,
    'slidev_intro': SlidevIntroLecture,
    'course-outline': EngineeringMechanicsOutline,
  };

  Object.entries(lectureDecks).forEach(([lectureId, deck]) => {
    describe(`Lecture Deck: ${lectureId}`, () => {
      test('should export both slides and slideMetadata', () => {
        expect(deck).toBeDefined();
        expect(deck.slides).toBeDefined();
        expect(deck.slideMetadata).toBeDefined();
      });

      test('should have exact match between slides and slideMetadata keys', () => {
        const slideKeys = Object.keys(deck.slides).map(Number).sort();
        const metaKeys = Object.keys(deck.slideMetadata).map(Number).sort();
        expect(slideKeys).toEqual(metaKeys);
      });

      test('should conform to metadata schema validation', () => {
        Object.entries(deck.slideMetadata).forEach(([slideNum, meta]) => {
          const parseResult = slideMetadataSchema.safeParse(meta);
          expect(parseResult.success, `Slide ${slideNum} failed metadata validation: ${parseResult.error?.message}`).toBe(true);
        });
      });
    });
  });
});
