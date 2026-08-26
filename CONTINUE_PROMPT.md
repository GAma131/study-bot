# Prompt para continuar mejoras del proyecto Study Bot

## Contexto del proyecto

Study Bot es un bot de Telegram para estudiar la certificación de Anthropic. Envía preguntas de opción múltiple cada cierto tiempo, espera la respuesta del usuario (reaccionando con emoji), y minutos después revela la respuesta correcta con explicación.

## Stack técnico

- **Lenguaje:** TypeScript 5.x (modo strict con `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`)
- **Bot framework:** grammY
- **Base de datos:** MongoDB (colección `questions`)
- **Validación:** Zod
- **Tests:** Vitest
- **Documentación:** Docusaurus (deploy a GitHub Pages)
- **Container:** Docker multi-stage + docker-compose (servicios `bot` y `mongo`)
- **Deploy:** Railway.app
- **CI/CD:** GitHub Actions (`ci.yml`, `deploy-docs.yml`)

## Estado actual (sesión anterior completada)

- ✅ Lint limpio (24/24 tests pasan)
- ✅ Migración de `data.json` a MongoDB completada
- ✅ Anti-repetición de preguntas por sesión (`Map<chatId, string[]>` + `$nin`)
- ✅ Docusaurus configurado y deployado a https://GAma131.github.io/study-bot/
- ✅ Workflows con `workflow_dispatch` habilitado en los 3 workflows
- ✅ Tests con mock objects (sin `mongodb-memory-server`)

## Estructura del proyecto

```
src/
├── bot/
│   ├── commands/      # study, study-stop, topics, help, format-*, escape-html
│   └── bot.ts
├── config/            # mongo.ts
├── domain/            # question.ts (Zod schema)
├── questions/         # repository.ts
├── scheduler/         # study-scheduler.ts
└── index.ts
test/                  # repository.test.ts, bot.test.ts, integration.test.ts, etc.
docs/                  # Docusaurus con docusaurus.config.ts y sidebars.ts
.github/workflows/     # ci.yml, deploy-docs.yml
```

## Features pendientes por implementar

1. **Comando `/settings`** — Configurar intervalo entre preguntas y delay de revelación desde Telegram (sin reiniciar el bot)
2. **Comando `/add-question`** — Agregar preguntas desde Telegram sin editar código
3. **Configuración desde MongoDB** — Settings collection en vez de hardcoded

## Convenciones del proyecto

- **Commits:** conventional commits en español (`feat:`, `fix:`, `docs:`, `ci:`, `build:`)
- **Tests:** usar mocks simples para MongoDB (objetos con `find`, `aggregate`, `findOne`, `countDocuments`)
- **Documentación:** todo en español
- **ESLint:** reglas `@typescript-eslint/recommended`, sin `any` explícito
- **Estilo:** sin emojis en código (solo en preguntas/contenido del bot)

## Comandos útiles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TS
npm run lint         # ESLint
npm run typecheck    # Verificar tipos
npm test             # Tests
npm run docs         # Docusaurus dev server
npm run docs:build   # Build de docs
```

## URLs importantes

- **Repo:** https://github.com/GAma131/study-bot
- **Docs:** https://GAma131.github.io/study-bot/
- **Bot en producción:** Railway.app

## Variables de entorno

```env
BOT_TOKEN=<token de @BotFather>
MONGODB_URI=mongodb://mongodb:27017/study-bot
```

## Valores hardcodeados actuales

| Valor | Ubicación | Default |
|-------|-----------|---------|
| Intervalo entre preguntas | `src/bot/commands/study.ts:38` | `30` min |
| Delay de revelación | `src/scheduler/study-scheduler.ts:11` | `5` min |

## Formato de preguntas en MongoDB

Colección `questions`:

```json
{
  "id": "tu-001",
  "topic": "tool-use",
  "text": "¿Pregunta?",
  "options": [
    { "key": "👍", "label": "Opción A" },
    { "key": "❤️", "label": "Opción B" },
    { "key": "😂", "label": "Opción C" },
    { "key": "🤣", "label": "Opción D" }
  ],
  "correctKey": "👍",
  "explanation": "Explicación de la respuesta"
}
```

## Prompt sugerido para nueva sesión

> "Continuemos con [feature específica]. El proyecto está en `/path/to/study-bot`. Lee primero el README.md, este archivo y revisa los tests para entender el estado actual. Antes de implementar, dame un plan paso a paso para que pueda aprobar cada cambio. Muestra los archivos completos cuando los crees, no resúmenes."

## Notas importantes

- Siempre confirmar antes de hacer commit/push
- Para features grandes, dividir en pasos pequeños
- Después de cambios, correr `npm run lint && npm run typecheck && npm test`
- Los cambios en docs triggerean el workflow de GitHub Pages automáticamente
- Los pushes a `main` triggerean auto-deploy en Railway.app
