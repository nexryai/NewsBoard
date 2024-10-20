# Build npmrun
FROM rust:1-alpine as npmrun-builder
WORKDIR /src

RUN apk add --no-cache git alpine-sdk

RUN git clone https://github.com/nexryai/npmrun.git .
RUN cargo build --release

FROM node:22-alpine AS builder

WORKDIR /app
COPY . ./

RUN apk add --no-cache ca-certificates git alpine-sdk g++ build-base cmake clang libressl-dev python3
RUN yarn build:install
RUN yarn build:compile

FROM node:22-alpine AS deps_builder

WORKDIR /app
COPY . ./

RUN apk add --no-cache ca-certificates git alpine-sdk g++ build-base cmake clang libressl-dev python3
RUN yarn install --prod --frozen-lockfile && yarn cache clean

FROM node:22-alpine AS runner


RUN apk add --no-cache ca-certificates tini \
	&& addgroup -g 640 app \
	&& adduser -u 640 -G app -D -h /app app

USER app
WORKDIR /app

COPY --chown=app:app --from=builder /app/built ./built
COPY --chown=app:app --from=builder /app/client/build client/build
COPY --chown=app:app --from=deps_builder /app/node_modules ./node_modules
COPY --chown=app:app package.json ./
COPY --chown=app:app prisma ./prisma

COPY --from=npmrun-builder /src/target/release/npmrun /usr/local/bin/npmrun

ENV NODE_ENV=production
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npmrun", "docker:start"]
