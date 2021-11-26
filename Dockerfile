FROM node:14-alpine
MAINTAINER Yuuki-Sakura <admin@zy.ci>

ADD . /app

WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.js | node - add --global pnpm@6
RUN pnpm config set store-dir ~/.pnpm-store
RUN pnpm install
RUN pnpm run build

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

EXPOSE 4000
EXPOSE 3000

CMD pnpm run start
