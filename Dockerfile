FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321
WORKDIR /app
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
USER node
EXPOSE 4321
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  --start-period=10s \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:4321/api/health || exit 1
CMD ["node", "./dist/server/entry.mjs"]
