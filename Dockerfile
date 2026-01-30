# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.

FROM node:23-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создаем пользователя
RUN groupadd -r -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nextjs

# Права на кэш
RUN mkdir .next
RUN chown nextjs:nodejs .next

# --- [1] ВАЖНО: Копируем папку с миграциями ---
# Без этой строки команда 'npm run migrate' не найдет файлы миграций
COPY --from=builder --chown=nextjs:nodejs /app/src/migrations ./src/migrations

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# --- [2] ВАЖНО: Копируем package.json, чтобы работали npm скрипты ---
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
# Lock-файл не обязателен для запуска (run), но полезен для версий
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# --- [3] ВАЖНО: Команда запуска с миграциями ---
# sh -c позволяет выполнить цепочку команд (&&)
# Сначала 'npm run migrate' применяет изменения к базе
# Если успешно (&&) -> запускается 'node server.js'
CMD ["sh", "-c", "npm run migrate && node server.js"]