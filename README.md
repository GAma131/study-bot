# Study Bot 📚

Bot de Telegram para estudiar. Te envía preguntas de opción múltiple cada cierto tiempo, esperas tu respuesta mentalmente, y 5 minutos después te revela la respuesta correcta con explicación.

Pensado para practicar en chats privados o de estudio grupal: cada quien reacciona con su emoji, nadie ve lo que votaron los demás, y la respuesta correcta llega después para que cada quien compare con su propio razonamiento.

## ✨ Features

- **`/study [minutos]`** — Inicia el modo estudio. Manda una pregunta inmediatamente y agenda envío automático cada N minutos (default 30).
- **`/study_stop`** — Detiene el modo estudio.
- **`/topics`** — Lista los temas disponibles.
- **`/help`** — Muestra la ayuda.
- **Emojis aleatorios por pregunta** — Cada pregunta se ve con una combinación distinta de emojis para que el estudio se sienta fresco.
- **Reacciones con emojis, no polls** — Respondes reaccionando al mensaje con 🅰️🅱️🅲🅳. Privado: nadie ve lo que votaste.
- **Funciona en grupos y privado** — Misma API, mismas features.

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| Lenguaje | TypeScript 5.x (modo `strict` con `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`) |
| Bot framework | [grammY](https://grammy.dev/) |
| Validación runtime | [Zod](https://zod.dev/) |
| Tests | [Vitest](https://vitest.dev/) |
| Env management | dotenv |
| Container | Docker multi-stage |
| Deploy | [Railway.app](https://railway.app/) |
| CI | GitHub Actions |

## 🏗️ Arquitectura

Estructura por capas (clean architecture simplificada). Las dependencias apuntan hacia adentro: `bot` puede importar de `domain`, `app`, `scheduler`; pero `domain` no importa de nada externo (cero dependencias).

```
src/
├── bot/              # Configuración de grammY
│   ├── commands/     # Un archivo por comando (/study, /help, /topics, /study_stop)
│   └── bot.ts        # buildBot() factory
├── domain/           # Tipos puros (Question, QuestionSchema con Zod)
├── questions/        # QuestionRepository que lee de data.json
├── scheduler/        # SchedulerService: timers one-shot y recurrentes
└── index.ts          # Entry point
test/                 # Tests con Vitest
```

## 🚀 Setup local

### Requisitos
- Node.js 20+
- npm

### Instalación

```bash
git clone https://github.com/TU_USUARIO/study-bot.git
cd study-bot
npm install
echo "BOT_TOKEN=tu_token_aqui" > .env
```

### Crear el bot en Telegram

1. Habla con [@BotFather](https://t.me/BotFather) en Telegram
2. Manda `/newbot`, sigue los pasos
3. Copia el token que te da
4. Pégalo en tu `.env`

### Comandos de desarrollo

```bash
npm run dev          # Desarrollo con hot-reload (tsx watch)
npm run build        # Compila TS a dist/
npm start            # Corre el bot desde dist/
npm run typecheck    # Verifica tipos sin emitir
npm run lint         # ESLint
npm test             # Corre los tests
npm run test:watch   # Tests en modo watch
```

## 🐳 Setup con Docker

### Requisitos
- Docker
- Docker Compose (o `docker compose` v2)

### Correr

```bash
docker compose up --build       # Build + arrancar en foreground
docker compose up --build -d    # En background
docker logs -f study-course-bot-1  # Ver logs
docker compose down             # Parar
```

El `Dockerfile` usa multi-stage builds para una imagen final pequeña (~150MB) sin TypeScript ni devDependencies.
## ☁️ Deploy en Railway.app

### Requisitos

- Cuenta en [Railway.app](https://railway.app/) (gratis con $5 USD/mes de crédito)
- Repositorio en GitHub

### Pasos

1. Crea un proyecto en Railway desde tu repo de GitHub
2. Agrega un servicio de MongoDB desde Railway
3. Configura las variables de entorno en el servicio del bot:
   - `BOT_TOKEN` = token de @BotFather
   - `MONGODB_URI` = referencia a `${{ MongoDB.MONGO_URL }}`
4. Railway hace auto-deploy en cada push a `main`

### Monitoreo

Los logs en tiempo real están disponibles en el dashboard de Railway: **Deployments → View Logs**.

Tu bot consumirá ~$1-2 USD/mes, dentro del crédito gratis de $5.

## ✅ Tests

```bash
npm test
```

Cobertura actual:
- Validación de tipos con Zod (`QuestionSchema`)
- `QuestionRepository` (carga, `getRandom`, `getById`, `getByTopic`)
- Formato de preguntas y respuestas (`formatQuestion`, `formatAnswer`)
- `SchedulerService` (timers one-shot y recurrentes con `vi.useFakeTimers`)
- Integración end-to-end con mocking de la API de Telegram

## 📚 Aprendizajes

Este proyecto se construyó como ejercicio de aprendizaje en una semana. Conceptos aplicados:

- **TypeScript estricto:** `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, mode `strict`
- **Zod schemas:** validación runtime + inferencia de tipos con `z.infer<typeof Schema>`
- **ESM moderno:** imports con extensión `.js`, `__dirname` con `fileURLToPath`
- **grammY:** creación de bots, comandos, mocking de la API con `bot.api.config.use`
- **Timers en Node:** `setTimeout` para one-shots, `setInterval` para recurrentes, `vi.useFakeTimers` para tests determinísticos
- **Docker multi-stage:** separación de build vs runtime para imágenes mínimas
- **CI con GitHub Actions:** lint + typecheck + test en cada push

## 🤝 Adaptar a tus propios estudios

Si quieres usarlo para estudiar otra cosa:

1. Edita `src/questions/data.json` con tus preguntas (formato: `{ id, topic, text, options[{key,label}], correctKey, explanation }`)
2. Ajusta el intervalo default en `src/bot/commands/study.ts` (línea con `Number(arg) || 30`)
3. Cambia el delay de revelación (5 min) en `src/scheduler/study-scheduler.ts` (línea con `5 * 60 * 1000`)

## 📄 Licencia

MIT
