import type { QuizResponsePayload, SubjectSubmissions } from './IFirebaseService';
import { SubmissionsRepository } from './repositories/submissions/SubmissionsRepository';
import { SubjectSubmissionsRepository } from './repositories/submissions/SubjectSubmissionsRepository';

export class FirebaseSubmissionsService {
  private submissionsRepo: SubmissionsRepository | null = null;
  private subjectSubmissionsRepo: SubjectSubmissionsRepository | null = null;

  constructor(private authService: { isOfflineMode: boolean }) {}

  public initialize(): void {
    if (!this.authService.isOfflineMode) {
      try {
        this.submissionsRepo = new SubmissionsRepository();
        this.subjectSubmissionsRepo = new SubjectSubmissionsRepository();
      } catch (e) {
        console.warn('[FirebaseSubmissionsService] Failed to initialize repositories:', e);
      }
    }
  }

  public async submitQuizResponse(payload: QuizResponsePayload): Promise<void> {
    if (this.authService.isOfflineMode || !this.submissionsRepo) {
      const submissions = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
      submissions.push(payload);
      localStorage.setItem('offline_submissions', JSON.stringify(submissions));
      return;
    }
    try {
      await this.submissionsRepo.create(payload);
    } catch (error) {
      console.warn('[FirebaseSubmissionsService] Failed to submit quiz response, logging offline:', error);
      const submissions = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
      submissions.push(payload);
      localStorage.setItem('offline_submissions', JSON.stringify(submissions));
    }
  }

  public async getSubjectSubmissions(
    subjectId: string,
    sessionId: string,
    studentUid: string
  ): Promise<SubjectSubmissions | null> {
    if (this.authService.isOfflineMode || !this.subjectSubmissionsRepo) {
      const saved = localStorage.getItem(`offline_submissions_${subjectId}_${sessionId}_${studentUid}`);
      return saved ? JSON.parse(saved) : null;
    }
    try {
      return await this.subjectSubmissionsRepo.getStudentSubmission(subjectId, sessionId, studentUid);
    } catch (error) {
      console.warn('[FirebaseSubmissionsService] Failed to load submissions, using local cache:', error);
      const saved = localStorage.getItem(`offline_submissions_${subjectId}_${sessionId}_${studentUid}`);
      return saved ? JSON.parse(saved) : null;
    }
  }

  public async submitQuizAnswer(
    subjectId: string,
    sessionId: string,
    studentUid: string,
    studentInfo: { name: string; reg: string },
    questionId: string,
    answer: string,
    isCorrect: boolean
  ): Promise<void> {
    let submission = await this.getSubjectSubmissions(subjectId, sessionId, studentUid);
    if (!submission) {
      submission = {
        studentUid,
        studentName: studentInfo.name,
        studentRegistration: studentInfo.reg,
        answers: {},
      };
    }
    submission.answers[questionId] = {
      answer,
      isCorrect,
      submittedAt: Date.now(),
    };

    if (this.authService.isOfflineMode || !this.subjectSubmissionsRepo) {
      localStorage.setItem(`offline_submissions_${subjectId}_${sessionId}_${studentUid}`, JSON.stringify(submission));
      return;
    }
    try {
      await this.subjectSubmissionsRepo.saveStudentSubmission(subjectId, sessionId, studentUid, {
        studentUid: submission.studentUid,
        studentName: submission.studentName,
        studentRegistration: submission.studentRegistration,
        answers: submission.answers,
      });
    } catch (error) {
      console.warn('[FirebaseSubmissionsService] Failed to save in Firestore, saving locally:', error);
      localStorage.setItem(`offline_submissions_${subjectId}_${sessionId}_${studentUid}`, JSON.stringify(submission));
    }
  }

  public async overrideQuizAnswer(
    subjectId: string,
    sessionId: string,
    studentUid: string,
    quizId: string,
    isCorrect: boolean,
    score: number,
    isOverridden: boolean
  ): Promise<void> {
    const submission = await this.getSubjectSubmissions(subjectId, sessionId, studentUid);
    if (!submission) return;

    submission.answers[quizId] = {
      answer: submission.answers[quizId]?.answer || '',
      isCorrect,
      score,
      isOverridden,
      submittedAt: submission.answers[quizId]?.submittedAt || Date.now(),
    };

    if (this.authService.isOfflineMode || !this.subjectSubmissionsRepo) {
      localStorage.setItem(`offline_submissions_${subjectId}_${sessionId}_${studentUid}`, JSON.stringify(submission));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: `offline_submissions_${subjectId}_${sessionId}_${studentUid}`,
            newValue: JSON.stringify(submission),
          })
        );
      }
      return;
    }
    try {
      await this.subjectSubmissionsRepo.saveStudentSubmission(subjectId, sessionId, studentUid, {
        studentUid: submission.studentUid,
        studentName: submission.studentName,
        studentRegistration: submission.studentRegistration,
        answers: submission.answers,
      });
    } catch (error) {
      console.warn('[FirebaseSubmissionsService] Failed to save override:', error);
    }
  }

  public async getAllSubmissions(subjectId: string, sessionId: string): Promise<SubjectSubmissions[]> {
    if (this.authService.isOfflineMode || !this.subjectSubmissionsRepo) {
      return this.getOfflineSubmissions(subjectId, sessionId);
    }
    try {
      return await this.subjectSubmissionsRepo.getAllSessionSubmissions(subjectId, sessionId);
    } catch (error) {
      console.warn('[FirebaseSubmissionsService] Failed to fetch all, using local storage:', error);
      return this.getOfflineSubmissions(subjectId, sessionId);
    }
  }

  private getOfflineSubmissions(subjectId: string, sessionId: string): SubjectSubmissions[] {
    const results: SubjectSubmissions[] = [];
    const prefix = `offline_submissions_${subjectId}_${sessionId}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          results.push(JSON.parse(localStorage.getItem(key) || '{}'));
        } catch {}
      }
    }
    return results;
  }

  public subscribeAllSubmissions(
    subjectId: string,
    sessionId: string,
    callback: (submissions: SubjectSubmissions[]) => void
  ): () => void {
    if (this.authService.isOfflineMode || !this.subjectSubmissionsRepo) {
      const getOffline = () => callback(this.getOfflineSubmissions(subjectId, sessionId));
      getOffline();
      const interval = setInterval(getOffline, 4000);
      return () => clearInterval(interval);
    }
    return this.subjectSubmissionsRepo.subscribeAllSessionSubmissions(subjectId, sessionId, callback);
  }
}
