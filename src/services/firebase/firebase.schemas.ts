import { z } from 'zod';

export const QuizResponsePayloadSchema = z.object({
  id: z.string().optional(),
  studentUid: z.string().min(1, 'Student UID is required'),
  studentName: z.string().min(1, 'Student Name is required'),
  studentRegistration: z.string().min(1, 'Student Registration is required'),
  quizId: z.string().min(1, 'Quiz ID is required'),
  questionText: z.string().min(1, 'Question text is required'),
  selectedOptionIndex: z.number().int().nonnegative('Selected option index must be non-negative'),
  isCorrect: z.boolean(),
  timestamp: z.union([z.date(), z.number()]),
});

export type QuizResponsePayload = z.infer<typeof QuizResponsePayloadSchema>;

export const FeedbackPayloadSchema = z.object({
  id: z.string().optional(),
  studentUid: z.string().min(1, 'Student UID is required'),
  studentName: z.string().min(1, 'Student Name is required'),
  studentRegistration: z.string().min(1, 'Student Registration is required'),
  lectureId: z.string().min(1, 'Lecture ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comments: z.string(),
  timestamp: z.union([z.date(), z.number()]),
});

export type FeedbackPayload = z.infer<typeof FeedbackPayloadSchema>;

export const ThemePreferencesSchema = z.object({
  accentHue: z.number().min(0).max(360),
  fontSans: z.string(),
  fontHeader: z.string(),
  borderRadius: z.number().int().min(0).max(24),
  bulletStyle: z.enum(['dot', 'square', 'check', 'chevron', 'arrow', 'dash']),
  equationBg: z.enum(['default', 'none', 'tinted', 'bordered']),
  footerStyle: z.enum(['fraction', 'prefixed', 'progress-bar', 'hidden']),
  updatedAt: z.number(),
  bgType: z.enum(['solid', 'gradient', 'custom']).optional().default('solid'),
  customBgValue: z.string().optional().default(''),
  borderSide: z.preprocess((val) => val === 'top' ? 'left' : val, z.enum(['all', 'left', 'bottom']).optional().default('left')),
  headerFontSize: z.number().int().min(12).max(32).optional().default(30),
});

export type ThemePreferences = z.infer<typeof ThemePreferencesSchema>;

export const UserPayloadSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  registration: z.string().optional().nullable(),
  session: z.string().optional().nullable(),
  role: z.enum(['student', 'admin']),
  isGuest: z.boolean().optional(),
  themePreferences: z.record(z.string(), ThemePreferencesSchema).optional().nullable(),
});

export type UserPayload = z.infer<typeof UserPayloadSchema>;

export const ThemeConfigPayloadSchema = z.object({
  id: z.string().optional(),
  isLocked: z.boolean().optional().default(false),
  accentHue: z.number().min(0).max(360),
  fontSans: z.string(),
  fontHeader: z.string(),
  borderRadius: z.number().int().min(0).max(24),
  bulletStyle: z.enum(['dot', 'square', 'check', 'chevron', 'arrow', 'dash']),
  equationBg: z.enum(['default', 'none', 'tinted', 'bordered']),
  footerStyle: z.enum(['fraction', 'prefixed', 'progress-bar', 'hidden']),
  updatedAt: z.union([z.date(), z.number()]),
  bgType: z.enum(['solid', 'gradient', 'custom']).optional().default('solid'),
  customBgValue: z.string().optional().default(''),
  borderSide: z.preprocess((val) => val === 'top' ? 'left' : val, z.enum(['all', 'left', 'bottom']).optional().default('left')),
  headerFontSize: z.number().int().min(12).max(32).optional().default(30),
});

export type ThemeConfigPayload = z.infer<typeof ThemeConfigPayloadSchema>;

export const LectureStatusSchema = z.object({
  locked: z.boolean(),
  hash: z.string(),
  updatedAt: z.number(),
});

export type LectureStatus = z.infer<typeof LectureStatusSchema>;

export const SessionStatusPayloadSchema = z.object({
  id: z.string().optional(),
  lectures: z.record(z.string(), LectureStatusSchema),
});

export type SessionStatusPayload = z.infer<typeof SessionStatusPayloadSchema>;

