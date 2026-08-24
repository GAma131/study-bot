import type { Question } from '../../domain/question.js';
import { escapeHtml } from './escape-html.js';

export function formatAnswer(q: Question): string {
  // right question
  const rq = q.options.find((o) => o.key === q.correctKey);
  if(!rq) throw new Error(`No se encontró la opción correcta ${q.correctKey}`)

  const msg = `
  ✅ <b>Respuesta correcta</b> \n
  \n
  <b>${rq.key} - ${escapeHtml(rq.label)}</b> \n
  \n
  💡 ${escapeHtml(q.explanation)}
  `;

  return msg;
}
