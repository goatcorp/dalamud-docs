FROM node:lts-alpine AS base
RUN corepack enable
WORKDIR /app


FROM base AS deps

# This PNPM_VERSION is used to install the dependencies. Those include a possibly different version of pnpm
# that is to be used for the package. Found in package.json - packageManager
ENV PNPM_VERSION=8.6.2

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -

COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


FROM base
COPY --from=deps /app/node_modules /app/node_modules

EXPOSE 3000
ENTRYPOINT [ "pnpm", "start", "--host", "0.0.0.0", "--poll", "1000"]