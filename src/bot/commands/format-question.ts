import { Question } from '../../domain/question.js';
import { escapeHtml } from './escape-html.js';

export function formatQuestion(q: Question) {
  const opciones = q.options.map((opt) => {
    const linea = `\n<b>${opt.key}</b> - ${escapeHtml(opt.label)}`;
    return linea;
  });
  const bloqueOpciones = opciones.join();

  const msg = `
  📚 <b>${escapeHtml(q.topic)}</b>

  ${q.text}
  ${bloqueOpciones}\n

  Reacciona con tu respuesta 🫪
  `;

  return msg;
}
