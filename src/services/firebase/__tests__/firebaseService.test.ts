import { vi, describe, test, expect, beforeEach } from 'vitest';
import { FirebaseService } from '../firebaseService';
import { FirebaseAuthService } from '../firebaseAuthService';
import { FirebaseSubmissionsService } from '../firebaseSubmissionsService';
import { signInAnonymously } from 'firebase/auth';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: {
      uid: 'student_123'
    }
  })),
  signInAnonymously: vi.fn().mockResolvedValue({
    user: { uid: 'mock_anonymous_uid' }
  })
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({}))
}));

// Mock localStorage for Node test environment
const mockLocalStorage: Record<string, string> = {};
global.localStorage = {
  getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockLocalStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockLocalStorage[key];
  }),
  clear: vi.fn(() => {
    for (const key in mockLocalStorage) {
      delete mockLocalStorage[key];
    }
  }),
  length: 0,
  key: vi.fn((index: number) => Object.keys(mockLocalStorage)[index] || null),
} as unknown as Storage;

Object.defineProperty(global.localStorage, 'length', {
  get: () => Object.keys(mockLocalStorage).length
});

describe('FirebaseAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should initialize and authenticate user anonymously', async () => {
    import.meta.env['VITE_FIREBASE_API_KEY'] = 'test-api-key';
    const authService = new FirebaseAuthService();
    authService.initialize();
    
    // We should not be in offline mode if apiKey is present and initialize succeeds
    expect(authService.isOfflineMode).toBe(false);

    const uid = await authService.anonymousSignIn();
    expect(uid).toBe('mock_anonymous_uid');
    expect(signInAnonymously).toHaveBeenCalled();
    import.meta.env['VITE_FIREBASE_API_KEY'] = 'MOCK_API_KEY';
  });

  test('should fallback to offline mode if apiKey is mock key', async () => {
    import.meta.env['VITE_FIREBASE_API_KEY'] = 'MOCK_API_KEY';
    const authService = new FirebaseAuthService();
    authService.initialize();
    
    expect(authService.isOfflineMode).toBe(true);

    const uid = await authService.anonymousSignIn();
    expect(uid).toBe('offline_mock_uid');
  });
});

describe('FirebaseSubmissionsService (Offline Mode)', () => {
  let authService: FirebaseAuthService;
  let submissionsService: FirebaseSubmissionsService;

  beforeEach(() => {
    localStorage.clear();
    authService = new FirebaseAuthService();
    authService.setOfflineMode(true); // force offline mode
    submissionsService = new FirebaseSubmissionsService(authService);
    submissionsService.initialize();
  });

  test('should submit and read quiz responses in offline localStorage mode', async () => {
    const payload = {
      studentUid: 'student_456',
      studentName: 'Alice',
      studentRegistration: 'REG001',
      quizId: 'quiz_1',
      questionText: 'Test Question',
      selectedOptionIndex: 2,
      isCorrect: true,
      timestamp: Date.now()
    };

    await submissionsService.submitQuizResponse(payload);
    
    const stored = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].studentName).toBe('Alice');
  });

  test('should submit student quiz answer and perform manual grading overrides', async () => {
    const subjectId = 'math';
    const sessionId = '2026';
    const studentUid = 'student_789';
    const studentInfo = { name: 'Bob', reg: 'REG002' };

    // Submit initial student answer (ungraded/false)
    await submissionsService.submitQuizAnswer(subjectId, sessionId, studentUid, studentInfo, 'quiz_1', '2.50', false);

    // Retrieve it and verify initial state
    let sub = await submissionsService.getSubjectSubmissions(subjectId, sessionId, studentUid);
    expect(sub).not.toBeNull();
    if (!sub) throw new Error('sub is null');
    const ans1 = sub.answers['quiz_1'];
    if (!ans1) throw new Error('ans1 is undefined');
    expect(ans1.answer).toBe('2.50');
    expect(ans1.isCorrect).toBe(false);
    expect(ans1.isOverridden).toBeUndefined();

    // Now instructor performs grading override
    await submissionsService.overrideQuizAnswer(subjectId, sessionId, studentUid, 'quiz_1', true, 5.0, true);

    // Retrieve again and verify overrides applied
    sub = await submissionsService.getSubjectSubmissions(subjectId, sessionId, studentUid);
    if (!sub) throw new Error('sub is null');
    const ans2 = sub.answers['quiz_1'];
    if (!ans2) throw new Error('ans2 is undefined');
    expect(ans2.isCorrect).toBe(true);
    expect(ans2.score).toBe(5.0);
    expect(ans2.isOverridden).toBe(true);

    // Verify getAllSubmissions extracts Bob's record
    const all = await submissionsService.getAllSubmissions(subjectId, sessionId);
    expect(all).toHaveLength(1);
    const bobRecord = all[0];
    if (!bobRecord) throw new Error('bobRecord is undefined');
    expect(bobRecord.studentName).toBe('Bob');
  });
});

describe('FirebaseService Facade Delegation', () => {
  test('should delegate initialization and calls to sub-services', async () => {
    const service = new FirebaseService();
    expect(() => service.initializeFirebase()).not.toThrow();
  });
});
