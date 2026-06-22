import type { ThemeConfigPayload } from './IFirebaseService';
import { ThemesRepository } from './repositories/themes/ThemesRepository';

export class FirebaseThemeService {
  private repository: ThemesRepository | null = null;

  constructor() {}

  public initialize(): void {
    try {
      this.repository = new ThemesRepository();
    } catch (e) {
      console.warn('[FirebaseThemeService] Failed to initialize repository:', e);
    }
  }

  public async getThemeConfig(id: string): Promise<ThemeConfigPayload | null> {
    if (!this.repository) {
      const saved = localStorage.getItem(`offline_theme_${id}`);
      return saved ? JSON.parse(saved) : null;
    }
    try {
      return await this.repository.getById(id);
    } catch (error) {
      console.warn('[FirebaseThemeService] Failed to load theme config, trying offline cache:', error);
      const saved = localStorage.getItem(`offline_theme_${id}`);
      return saved ? JSON.parse(saved) : null;
    }
  }

  public async setThemeConfig(id: string, config: Omit<ThemeConfigPayload, 'id'>): Promise<ThemeConfigPayload> {
    const payload = { id, ...config };
    if (!this.repository) {
      localStorage.setItem(`offline_theme_${id}`, JSON.stringify(payload));
      return payload;
    }
    try {
      return await this.repository.set(id, config);
    } catch (error) {
      console.warn('[FirebaseThemeService] Failed to save theme config in Firestore, saving locally:', error);
      localStorage.setItem(`offline_theme_${id}`, JSON.stringify(payload));
      return payload;
    }
  }

  public async deleteThemeConfig(id: string): Promise<void> {
    if (!this.repository) {
      localStorage.removeItem(`offline_theme_${id}`);
      return;
    }
    try {
      await this.repository.delete(id);
    } catch (error) {
      console.warn('[FirebaseThemeService] Failed to delete theme config in Firestore, deleting locally:', error);
      localStorage.removeItem(`offline_theme_${id}`);
    }
  }
}
