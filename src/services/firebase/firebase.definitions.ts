import type { FirestoreDefinition } from './firestoreService';
import { 
  QuizResponsePayloadSchema, 
  FeedbackPayloadSchema,
  UserPayloadSchema,
  ThemeConfigPayloadSchema,
  SessionStatusPayloadSchema,
  type QuizResponsePayload,
  type FeedbackPayload,
  type UserPayload,
  type ThemeConfigPayload,
  type SessionStatusPayload
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



