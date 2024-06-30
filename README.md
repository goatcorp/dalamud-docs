# Dalamud Documentation

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern
static website generator.

## Installation

```shell
pnpm install
```

## Local Development

```shell
pnpm start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

### Docker Development

If you want to use Docker for local dev, it's a bit cursed, but it works:

```shell
docker compose run workspace pnpm install
docker compose up
```

## Build

```shell
pnpm build --dev
```

This command generates static content into the `build` directory and can be
served using any static contents hosting service.

## Deployment

Documentation deployment is automatic through GitHub Actions. Any doc changes on
the `main` branch will automatically be deployed.
