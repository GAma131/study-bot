---
sidebar_position: 2
---

# SchedulerService

## Métodos

### scheduleReveal(key, question, callback, delayMs)

Programa el envío de la respuesta después de un delay.

```typescript
async scheduleReveal(
  key: string,
  question: Question,
  callback: () => Promise<void>,
  delayMs: number = 5 * 60 * 1000
): Promise<void>
```

### scheduleRecurring(key, callback, intervalMs)

Programa un envío recurrente de preguntas.

```typescript
async scheduleRecurring(
  key: string,
  callback: () => void,
  intervalMs: number
): Promise<void>
```

### cancelReveal(key)

Cancela un timer de revelación pendiente.

### cancelRecurring(key)

Cancela un timer recurrente.

### cancelAll()

Cancela todos los timers.
