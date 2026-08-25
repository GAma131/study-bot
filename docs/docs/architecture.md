---
sidebar_position: 4
---

# Arquitectura

## Estructura del proyecto

```
src/
├── bot/              # Configuración de grammY
│   ├── commands/     # Un archivo por comando
│   └── bot.ts        # buildBot() factory
├── config/           # Configuración (MongoDB, settings)
├── domain/           # Tipos puros (Question, QuestionSchema)
├── questions/        # QuestionRepository (MongoDB)
├── scheduler/        # SchedulerService (timers)
└── index.ts          # Entry point
```

## Flujo de un comando /study

1. Usuario envía `/study`
2. Bot selecciona una pregunta aleatoria (sin repetir en la misma sesión)
3. Bot envía la pregunta al chat
4. Después de 5 minutos, bot envía la respuesta
5. Si hay intervalo configurado, repite el proceso
