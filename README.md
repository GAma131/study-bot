### Librerias proyecto y su función
- fastify → framework web
- zod → validación de datos
- @fastify/cors → permite que frontends en otros dominios consuman tu API
- pino-pretty → hace legibles los logs de Fastify en desarrollo
- tsx → corre TypeScript directamente sin compilar manualmente  - vitest → framework de tests
- supertest → hace requests HTTP a tu app en los tests (similar a curl pero desde código)
- eslint + @typescript-eslint/* → linter para encontrar problemas y mantener estilo
- prettier → formateador automático de código

### Arquitectura
- domain/ → reglas de negocio puras (número de días seguidos, cálculos de rachas, etc.). Sin imports de Fastify, ni de DB. Aquí escribirías calculateStreak() el día 2.
- app/ → casos de uso. Orquestan dominio + repositorios. Ej: createHabit, logHabit. Tampoco sabe nada de HTTP.
- infrastructure/ → cosas del mundo exterior: conexión a SQLite, implementación de repositorios.
- http/ → todo lo relacionado con Fastify: rutas, schemas de validación (Zod), plugins.
La idea: las dependencias apuntan hacia adentro. http puede importar de app, app puede importar de domain, pero domain nunca importa de http. Esto te permite cambiar Fastify por Hono o SQLite por Postgres sin tocar el dominio.
Esto se llama Clean Architecture simplificada (o arquitectura hexagonal si quieres sonar fancy). En entrevistas se valora mucho.
