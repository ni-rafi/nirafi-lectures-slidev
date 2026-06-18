import { BaseFirestoreRepository } from '../base/BaseFirestoreRepository';
import { SessionStatusDefinition } from '../../firebase.definitions';
import type { SessionStatusPayload } from '../../firebase.schemas';

export class SessionStatusRepository extends BaseFirestoreRepository<SessionStatusPayload> {
  protected readonly definition = SessionStatusDefinition;
}
