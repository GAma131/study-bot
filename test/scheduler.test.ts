import { describe, it, expect, vi, afterEach, beforeEach} from "vitest";
import { SchedulerService } from "../src/scheduler/study-scheduler.js";
import type { Question } from "../src/domain/question.js";

const fakeQuestion: Question = {
  id: 'test-001',
  topic: 'Test topic',
  text: '¿Cuál es la respuesta?',
  options: [
    { key: 'A', label: 'Opción A'},
    { key: 'B', label: 'Opción B'},
    { key: 'C', label: 'Opción C'},
    { key: 'D', label: 'Opción D'},
  ],
  correctKey: 'A',
  explanation: 'Porque si',
}

describe('SchedulerService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('ejecuta el callback después del delay', () => {
    const scheduler = new SchedulerService()
    const cb = vi.fn()

    scheduler.scheduleReveal('chat-1', fakeQuestion, cb, 1000)

    expect(cb).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('cancela el timer previo si se programa uno nuevo con la misma key', () => {
    const scheduler = new SchedulerService()
    const cb1 = vi.fn()
    const cb2 = vi.fn()

    scheduler.scheduleReveal('chat-1', fakeQuestion, cb1, 1000)
    scheduler.scheduleReveal('chat-1', fakeQuestion, cb2, 2000)

    vi.advanceTimersByTime(2000)

    expect(cb1).not.toHaveBeenCalled()
    expect(cb2).toHaveBeenCalledTimes(1)
  })

  it('ejecuta el callback cada intervalo', () => {
    const scheduler = new SchedulerService()
    const cb = vi.fn()

    scheduler.scheduleRecurring('chat-1', cb, 1000)

    vi.advanceTimersByTime(2500)

    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('cancela el recurrente con cancelRecurring', () => {
    const scheduler = new SchedulerService()
    const cb = vi.fn()

    scheduler.scheduleRecurring('chat-1', cb, 1000)
    vi.advanceTimersByTime(1500)
    expect(cb).toHaveBeenCalledTimes(1)

    scheduler.cancelRecurring('chat-1')
    vi.advanceTimersByTime(3000)

    expect(cb).toHaveBeenCalledTimes(1)
  })
})
