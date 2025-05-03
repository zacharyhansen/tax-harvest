ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base
ARG PROJECT=api
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PNPM_STORE_PATH=/pnpm/store
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable
RUN pnpm install turbo@2.5.2 --global 

FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune ${PROJECT} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/turbo.json ./turbo.json
COPY --from=builder /app/out/full/apps/${PROJECT}/prisma ./prisma
COPY --from=builder /app/out/full/apps/${PROJECT}/scripts ./scripts
RUN pnpm install --frozen-lockfile --store-dir=${PNPM_STORE_PATH} --ignore-scripts

FROM base AS sourcer
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN ls
ENV NODE_ENV=production
RUN pnpm turbo run build

FROM base AS runner
WORKDIR /app
COPY --from=sourcer /app/ .
WORKDIR /app/apps/${PROJECT}
RUN ls

CMD ["node", "dist/main"]
