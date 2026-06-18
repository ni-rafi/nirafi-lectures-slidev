import { vi, describe, test, expect, beforeEach } from 'vitest';
import { SessionStatusRepository } from '../SessionStatusRepository';
import { SessionStatusPayloadSchema } from '../../../firebase.schemas';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: {
      uid: 'admin_123',
      getIdTokenResult: vi.fn().mockResolvedValue({
        claims: { is_admin: true }
      })
    }
  }))
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({
    exists: () => true,
    id: 'subject_session_1',
    data: () => ({
      lectures: {
        concrete: {
          locked: false,
          updatedAt: 1718712345000,
          hash: 'mock-hash-signature'
        }
      }
    })
  }),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn())
}));

describe('SessionStatusRepository and Zod Schemas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('SessionStatusPayloadSchema validation succeeds for valid payload', () => {
    const validPayload = {
      id: 'qs_session-2026',
      lectures: {
        concrete: {
          locked: false,
          updatedAt: 1718712345000,
          hash: 'mock-hash-value'
        }
      }
    };

    const parsed = SessionStatusPayloadSchema.parse(validPayload);
    expect(parsed.lectures['concrete']?.locked).toBe(false);
  });

  test('SessionStatusPayloadSchema validation rejects invalid shape', () => {
    const invalidPayload = {
      lectures: {
        concrete: {
          locked: 'not-a-boolean',
          updatedAt: 'not-a-number',
          hash: 12345
        }
      }
    };

    expect(() => SessionStatusPayloadSchema.parse(invalidPayload)).toThrow();
  });

  test('SessionStatusRepository retrieves and parses session status document', async () => {
    const repo = new SessionStatusRepository();
    const doc = await repo.getById('subject_session_1');
    
    expect(doc).not.toBeNull();
    expect(doc?.id).toBe('subject_session_1');
    expect(doc?.lectures['concrete']?.locked).toBe(false);
  });
});
