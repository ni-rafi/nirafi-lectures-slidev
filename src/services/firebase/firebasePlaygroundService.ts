import type { PlaygroundCanvasPayload } from './IFirebaseService';
import { PlaygroundsRepository } from './repositories/playgrounds/PlaygroundsRepository';

export class FirebasePlaygroundService {
  private repository: PlaygroundsRepository | null = null;

  constructor() {}

  public initialize(): void {
    try {
      this.repository = new PlaygroundsRepository();
    } catch (e) {
      console.warn('[FirebasePlaygroundService] Failed to initialize repository:', e);
    }
  }

  public async getPlaygroundCanvas(id: string): Promise<PlaygroundCanvasPayload | null> {
    if (!this.repository) {
      const stored = localStorage.getItem(`offline_playground_${id}`);
      return stored ? JSON.parse(stored) : null;
    }
    try {
      return await this.repository.getById(id);
    } catch (error) {
      console.warn(`[FirebasePlaygroundService] Failed to fetch playground ${id}, falling back locally:`, error);
      const stored = localStorage.getItem(`offline_playground_${id}`);
      return stored ? JSON.parse(stored) : null;
    }
  }

  public async setPlaygroundCanvas(
    id: string,
    payload: Omit<PlaygroundCanvasPayload, 'id'>
  ): Promise<PlaygroundCanvasPayload> {
    const document = { ...payload, id };
    if (!this.repository) {
      localStorage.setItem(`offline_playground_${id}`, JSON.stringify(document));
      return document;
    }
    try {
      await this.repository.set(id, payload);
      return document;
    } catch (error) {
      console.warn(`[FirebasePlaygroundService] Failed to set playground ${id} in Firestore, saving locally:`, error);
      localStorage.setItem(`offline_playground_${id}`, JSON.stringify(document));
      return document;
    }
  }
}
