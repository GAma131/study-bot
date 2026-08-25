---
sidebar_position: 1
---

# QuestionRepository

## Métodos

### getAll()

Retorna todas las preguntas de MongoDB.

```typescript
async getAll(): Promise<Question[]>
```

### getRandom(chatId)

Retorna una pregunta aleatoria para un chat específico. No repite preguntas en la misma sesión.

```typescript
async getRandom(chatId: number): Promise<Question>
```

### getById(id)

Busca una pregunta por su ID.

```typescript
async getById(id: string): Promise<Question | null>
```

### getByTopic(topic)

Retorna todas las preguntas de un tema específico.

```typescript
async getByTopic(topic: string): Promise<Question[]>
```
