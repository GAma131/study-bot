import { type Bot, type Context } from 'grammy';

const HELP_TEXT = `📚 <b>Study Bot - Comandos</b>\n
  \n
  /study - Inicia el modo estudio (preguntas cada 30 minutos)
  /study [minutos] - Intervalo personalizado (ej. /study 15)
  /study_stop - Detiene el modo estudio
  /topics - Lista de los temas disponibles
  /help - Muestra este mensaje
  \n
  `;

export function registerHelpCommand(bot: Bot<Context>): void {
  bot.command('help', (ctx) => {
    ctx.reply(HELP_TEXT, { parse_mode: 'HTML' });
  });
}
