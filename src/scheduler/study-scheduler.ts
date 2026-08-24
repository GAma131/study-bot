import { Question } from '../domain/question';

export class SchedulerService {
  private timers: Map<string, NodeJS.Timeout> = new Map();

  async scheduleReveal(
    key: string,
    _question: Question,
    callback: () => Promise<void>,
    delayMs: number = 5 * 6 * 1000,
  ): Promise<void> {
    this.cancel(key);

    const timer = setTimeout(async () => {
      this.timers.delete(key);

      try {
        await callback();
      } catch (err) {
        console.error('Reveal callback failed:', err);
      }
    }, delayMs);

    this.timers.set(key, timer);
  }

  cancel(key: string): void {
    const existing = this.timers.get(key);
    if (existing) {
      clearTimeout(existing);
      this.timers.delete(key);
    }
  }

  cancelAll(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }

  hasPending(key: string): boolean {
    return this.timers.has(key);
  }
}
