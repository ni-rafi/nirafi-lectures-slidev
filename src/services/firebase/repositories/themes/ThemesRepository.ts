import { BaseFirestoreRepository } from '../base/BaseFirestoreRepository';
import { ThemeConfigDefinition } from '../../firebase.definitions';
import type { ThemeConfigPayload } from '../../firebase.schemas';

export class ThemesRepository extends BaseFirestoreRepository<ThemeConfigPayload> {
  protected readonly definition = ThemeConfigDefinition;
}
