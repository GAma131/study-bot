import { Question } from '../domain/question.js';

export class SchedulerService {
  private revealTimers: Map<string, NodeJS.Timeout> = new Map();
  private recurringTimers: Map<string, NodeJS.Timeout> = new Map();

  async scheduleReveal(
    key: string,
    _question: Question,
    callback: () => Promise<void>,
    delayMs: number = 5 * 60 * 1000, // Delay para enviar respuesta (5 min)
  ): Promise<void> {
    this.cancelReveal(key);

    const timer = setTimeout(async () => {
      this.revealTimers.delete(key);

      try {
        await callback();
      } catch (err) {
        console.error('Reveal callback failed:', err);
      }
    }, delayMs);

    this.revealTimers.set(key, timer);
  }

  async scheduleRecurring(key: string, callback: () => void, intervalMs: number): Promise<void> {
    this.cancelRecurring(key);

    const timer = setInterval(() => {
      try {
        callback();
      } catch (err) {
        console.error('Recurring callback failed:', err);
      }
    }, intervalMs);

    this.recurringTimers.set(key, timer);
  }

  cancelReveal(key: string): void {
    const existing = this.revealTimers.get(key);
    if (existing) {
      clearTimeout(existing);
      this.revealTimers.delete(key);
    }
  }

  cancelRecurring(key: string): void {
    const existing = this.recurringTimers.get(key);
    if (existing) {
      clearInterval(existing);
      this.revealTimers.delete(key);
    }
  }

  cancelAll(): void {
    for (const timer of this.revealTimers.values()) {
      clearTimeout(timer);
    }
    this.revealTimers.clear();

    for (const timer of this.recurringTimers.values()) {
      clearInterval(timer);
    }
    this.recurringTimers.clear();
  }

  hasPending(key: string): boolean {
    return this.revealTimers.has(key);
  }
}
