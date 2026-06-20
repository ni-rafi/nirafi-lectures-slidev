import { describe, test, expect, beforeAll } from 'vitest';
import { z } from 'zod';

// Zod schema matching SlideMetadata type requirements
const slideMetadataSchema = z.object({
  title: z.union([z.string().min(1), z.function()]),
  type: z.union([z.string().min(1), z.function()]),
  section: z.string().min(1),
  transition: z.enum(['morph', 'slide', 'fade', 'zoom', 'none']).optional(),
  transitionDuration: z.number().optional(),
  quizId: z.string().optional(),
  quizVisibilityMode: z.enum(['stealth', 'placeholder']).optional(),
});

describe('Academic Slide Decks Registry & Schema Verification', () => {
  // Eagerly scan all lecture files across the codebase
  const deckModules = import.meta.glob<{
    slides: Record<number, React.ComponentType<{ slideNo: number; subject: unknown; lecture: unknown; session?: unknown }>>;
    slideMetadata: Record<number, z.infer<typeof slideMetadataSchema>>;
  }>('/src/subjects/**/lectures/*/*/lecture.tsx');

  Object.entries(deckModules).forEach(([path, loadDeck]) => {
    // Extract a clean display name (e.g. quantity-surveying/lecture-1-concrete or engineering-mechanics/course-outline)
    const match = path.match(/\/subjects\/(.+?\/lectures\/.+?\/.+?)\/lecture\.tsx$/);
    const displayName = match ? match[1] : path;

    describe(`Lecture Deck: ${displayName}`, () => {
      let deck: {
        slides: Record<number, React.ComponentType<{ slideNo: number; subject: unknown; lecture: unknown; session?: unknown }>>;
        slideMetadata: Record<number, z.infer<typeof slideMetadataSchema>>;
      };

      beforeAll(async () => {
        deck = await loadDeck();
      });

      test('should load the deck successfully and export slides and slideMetadata', () => {
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
          expect(
            parseResult.success,
            `Slide ${slideNum} failed metadata validation: ${parseResult.error?.message}`
          ).toBe(true);
        });
      });
    });
  });
});
