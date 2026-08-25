---
sidebar_position: 2
---

# Instalación

## Requisitos

- Node.js 20+
- MongoDB (local o en la nube)
- Token de Telegram (vía @BotFather)

## Pasos

### 1. Clonar el repositorio

```bash
git clone https://github.com/GAma131/study-bot.git
cd study-bot
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env`:

```env
BOT_TOKEN=tu_token_de_telegram
MONGODB_URI=mongodb://mongodb:27017/study-bot
```

### 4. Iniciar el bot

```bash
npm run dev
```
