FROM node:16.14.2
MAINTAINER andres.r.oyarce@gmail.com

COPY package.json /src/package.json
RUN cd /src; npm install

COPY . /src/

EXPOSE 1337

WORKDIR /src
CMD ["npm", "start"]


# Create an artifact.package.json with the dependencies we want to preBuild
# More info using Balena base images: https://www.balena.io/docs/reference/base-images/base-images
FROM balenalib/raspberrypi3-alpine-node:12.16.3-build as builder

ARG NPM_TOKEN
ARG NPM_HOST=registry.npmjs.org
ARG NPM_HOST_PROTOCOL=https
ARG NODE_BINARIES_MIRROR

RUN npm config set "//$NPM_HOST/:_authToken=$NPM_TOKEN"
RUN npm config set @miroculus:registry="$NPM_HOST_PROTOCOL://$NPM_HOST"

RUN ["cross-build-start"]

WORKDIR /src

ENV NODE_ENV=production

COPY bin/artifact-package-json bin/artifact-package-json

# Create a cached layer with serialport native build
COPY package*.json /src/
RUN bin/artifact-package-json package.json @miroculus/anaconda-io-comm
RUN npm install

# Install all remaining dependencies
COPY package*.json /src/
RUN npm install --node_sqlite3_binary_host_mirror=${NODE_BINARIES_MIRROR}

RUN rm -rf ~/.npmrc

RUN ["cross-build-end"]

# ---

FROM balenalib/raspberrypi3-alpine-node:12.16.3-run

ENV NODE_ENV=production

WORKDIR /src

RUN install_packages logrotate tini tzdata moreutils \
  && rm /etc/logrotate.conf && rm -r /etc/logrotate.d \
  && rm /etc/periodic/daily/logrotate

COPY --from=builder /src/node_modules /src/node_modules

COPY package*.json /src/
COPY ./src /src/src
COPY ./bin /src/bin
COPY ./entrypoint.sh /src/entrypoint.sh
COPY ./index.js /src/index.js
COPY ./calibrationData.json /src/calibrationData.json
COPY ./cocoscript-config.json /src/cocoscript-config.json

ARG BUILD_IMAGE=${BUILD_IMAGE}
ENV BUILD_IMAGE=$BUILD_IMAGE

ARG BUILD_VERSION=${BUILD_VERSION}
ENV BUILD_VERSION=$BUILD_VERSION

# Do not remove /usr/bin/entry.sh, is the default entrypoint of the balena image.
# More info: https://www.balena.io/docs/reference/base-images/base-images/#features-overview
ENTRYPOINT ["tini", "--", "/usr/bin/entry.sh", "/src/entrypoint.sh"]

CMD ["node", "."]
