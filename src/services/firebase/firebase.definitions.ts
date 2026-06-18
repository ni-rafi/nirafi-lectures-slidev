import type { FirestoreDefinition } from './firestoreService';
import { 
  QuizResponsePayloadSchema, 
  FeedbackPayloadSchema,
  UserPayloadSchema,
  ThemeConfigPayloadSchema,
  SessionStatusPayloadSchema,
  QuizStateSchema,
  SubjectSubmissionsSchema,
  PlaygroundCanvasPayloadSchema,
  type QuizResponsePayload,
  type FeedbackPayload,
  type UserPayload,
  type ThemeConfigPayload,
  type SessionStatusPayload,
  type QuizState,
  type SubjectSubmissions,
  type PlaygroundCanvasPayload
} from './firebase.schemas';

export const SubmissionsDefinition: FirestoreDefinition<QuizResponsePayload> = {
  collectionPath: 'submissions',
  schema: QuizResponsePayloadSchema,
  roles: {
    read: ['admin'],
    write: ['student', 'admin']
  }
};

export const FeedbackDefinition: FirestoreDefinition<FeedbackPayload> = {
  collectionPath: 'feedback',
  schema: FeedbackPayloadSchema,
  roles: {
    read: ['admin'],
    write: ['student', 'admin']
  }
};

export const UsersDefinition: FirestoreDefinition<UserPayload> = {
  collectionPath: 'users',
  schema: UserPayloadSchema,
  roles: {
    read: ['student', 'admin'],
    write: ['student', 'admin']
  }
};

export const ThemeConfigDefinition: FirestoreDefinition<ThemeConfigPayload> = {
  collectionPath: 'themes',
  schema: ThemeConfigPayloadSchema,
  roles: {
    read: ['student', 'admin'],
    write: ['student', 'admin']
  }
};

export const SessionStatusDefinition: FirestoreDefinition<SessionStatusPayload> = {
  collectionPath: 'lecture_status',
  schema: SessionStatusPayloadSchema,
  roles: {
    read: ['student', 'admin'],
    write: ['admin']
  }
};

export const QuizStatesDefinition: FirestoreDefinition<QuizState> = {
  collectionPath: 'quiz_states',
  schema: QuizStateSchema,
  roles: {
    read: ['student', 'admin'],
    write: ['admin']
  }
};

export const SubjectSubmissionsDefinition: FirestoreDefinition<SubjectSubmissions> = {
  collectionPath: 'quiz_submissions',
  schema: SubjectSubmissionsSchema,
  roles: {
    read: ['student', 'admin'],
    write: ['student', 'admin']
  }
};

export const PlaygroundCanvasDefinition: FirestoreDefinition<PlaygroundCanvasPayload> = {
  collectionPath: 'playgrounds',
  schema: PlaygroundCanvasPayloadSchema,
  roles: {
    read: ['student', 'admin'],
    write: ['admin']
  }
};





