FROM node:16.14.2 as base

LABEL MAINTAINER = "andres.r.oyarce@gmail.com"
LABEL version="1.0.0"

WORKDIR /app
COPY ["package.json", "package-lock.json*", ".env", "./"]

from base as test
RUN npm ci
COPY . .
RUN npm run test

