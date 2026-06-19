import type { FeedbackPayload } from './IFirebaseService';
import { FeedbackRepository } from './repositories/feedback/FeedbackRepository';

export class FirebaseFeedbackService {
  private repository: FeedbackRepository | null = null;

  constructor(private authService: { isOfflineMode: boolean }) {}

  public initialize(): void {
    if (!this.authService.isOfflineMode) {
      try {
        this.repository = new FeedbackRepository();
      } catch (e) {
        console.warn('[FirebaseFeedbackService] Failed to initialize repository:', e);
      }
    }
  }

  public async submitFeedback(payload: FeedbackPayload): Promise<void> {
    if (this.authService.isOfflineMode || !this.repository) {
      const feedback = JSON.parse(localStorage.getItem('offline_feedback') || '[]');
      feedback.push(payload);
      localStorage.setItem('offline_feedback', JSON.stringify(feedback));
      return;
    }
    try {
      await this.repository.create(payload);
    } catch (error) {
      console.warn('[FirebaseFeedbackService] Failed to submit feedback, logging offline:', error);
      const feedback = JSON.parse(localStorage.getItem('offline_feedback') || '[]');
      feedback.push(payload);
      localStorage.setItem('offline_feedback', JSON.stringify(feedback));
    }
  }
}
