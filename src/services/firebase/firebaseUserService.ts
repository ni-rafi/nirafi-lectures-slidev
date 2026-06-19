import type { UserPayload } from './IFirebaseService';
import { UsersRepository } from './repositories/users/UsersRepository';

export class FirebaseUserService {
  private repository: UsersRepository | null = null;

  constructor(private authService: { isOfflineMode: boolean }) {}

  public initialize(): void {
    if (!this.authService.isOfflineMode) {
      try {
        this.repository = new UsersRepository();
      } catch (e) {
        console.warn('[FirebaseUserService] Failed to initialize repository:', e);
      }
    }
  }

  public async getUserProfile(uid: string): Promise<UserPayload | null> {
    if (this.authService.isOfflineMode || !this.repository || uid === 'offline_mock_uid') {
      const cached = localStorage.getItem('offline_student_profile');
      return cached ? JSON.parse(cached) : null;
    }
    try {
      return await this.repository.getById(uid);
    } catch (error) {
      console.warn('[FirebaseUserService] Failed to fetch user profile, trying offline cache:', error);
      const cached = localStorage.getItem('offline_student_profile');
      return cached ? JSON.parse(cached) : null;
    }
  }

  public async setUserProfile(uid: string, profile: Omit<UserPayload, 'id'>): Promise<UserPayload> {
    if (this.authService.isOfflineMode || !this.repository || uid === 'offline_mock_uid') {
      const userProfile = { id: uid, ...profile };
      localStorage.setItem('offline_student_profile', JSON.stringify(userProfile));
      return userProfile;
    }
    try {
      return await this.repository.set(uid, profile);
    } catch (error) {
      console.warn('[FirebaseUserService] Failed to set user profile in Firestore, saving locally:', error);
      const userProfile = { id: uid, ...profile };
      localStorage.setItem('offline_student_profile', JSON.stringify(userProfile));
      return userProfile;
    }
  }
}
