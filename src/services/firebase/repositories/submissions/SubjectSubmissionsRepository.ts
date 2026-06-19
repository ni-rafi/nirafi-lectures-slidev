import { BaseFirestoreRepository } from '../base/BaseFirestoreRepository';
import { SubjectSubmissionsDefinition } from '../../firebase.definitions';
import type { SubjectSubmissions } from '../../IFirebaseService';
import { firestoreService } from '../../firestoreService';

export class SubjectSubmissionsRepository extends BaseFirestoreRepository<SubjectSubmissions> {
  protected readonly definition = SubjectSubmissionsDefinition;

  private getCollectionPath(subjectId: string, sessionId: string): string {
    return `quiz_submissions/${subjectId}/${sessionId}`;
  }

  public async getStudentSubmission(
    subjectId: string,
    sessionId: string,
    studentUid: string
  ): Promise<SubjectSubmissions | null> {
    const path = this.getCollectionPath(subjectId, sessionId);
    return firestoreService.getById(this.definition, studentUid, path);
  }

  public async saveStudentSubmission(
    subjectId: string,
    sessionId: string,
    studentUid: string,
    data: Omit<SubjectSubmissions, 'id'>
  ): Promise<SubjectSubmissions> {
    const path = this.getCollectionPath(subjectId, sessionId);
    return firestoreService.set(this.definition, studentUid, data, path);
  }

  public async getAllSessionSubmissions(
    subjectId: string,
    sessionId: string
  ): Promise<SubjectSubmissions[]> {
    const path = this.getCollectionPath(subjectId, sessionId);
    return firestoreService.getAll(this.definition, path);
  }

  public subscribeAllSessionSubmissions(
    subjectId: string,
    sessionId: string,
    callback: (submissions: SubjectSubmissions[]) => void
  ): () => void {
    const path = this.getCollectionPath(subjectId, sessionId);
    return firestoreService.subscribe(this.definition, callback, path);
  }
}
