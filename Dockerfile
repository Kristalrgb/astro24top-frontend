# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.

FROM node:23-slim AS base

# Install dependencies only when needed
FROM base AS deps
# В Debian (slim) уже есть glibc.
WORKDIR /app

# Install dependencies based on the preferred package manager
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

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# --- ВАЖНО 1: Копируем папку с миграциями ---
# (Если у вас нет папки src/migrations, закомментируйте эту строку, иначе сборка упадет)
COPY --from=builder --chown=nextjs:nodejs /app/src/migrations ./src/migrations

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Копируем package.json и lock файл, чтобы npm команды работали в runner
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# --- ВАЖНО 2: Запускаем миграции перед стартом сервера ---
# Мы используем 'sh -c', чтобы объединить две команды через &&.
# Сначала выполняется migrate. Если успешно -> запускается server.js
CMD ["sh", "-c", "npm run migrate && node server.js"]