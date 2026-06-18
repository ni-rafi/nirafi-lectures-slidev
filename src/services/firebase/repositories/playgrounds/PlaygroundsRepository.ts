import { BaseFirestoreRepository } from '../base/BaseFirestoreRepository';
import { PlaygroundCanvasDefinition } from '../../firebase.definitions';
import type { PlaygroundCanvasPayload } from '../../firebase.schemas';

export class PlaygroundsRepository extends BaseFirestoreRepository<PlaygroundCanvasPayload> {
  protected readonly definition = PlaygroundCanvasDefinition;
}
