FROM node:12-alpine

RUN apk add --no-cache --virtual .gyp  python make g++

WORKDIR /src

COPY package.json yarn.lock /src/

RUN yarn

CMD yarn dev