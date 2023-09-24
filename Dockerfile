FROM node:lts-alpine

WORKDIR /app

RUN apk --no-cache add git
RUN npm install --global pnpm

EXPOSE 3000