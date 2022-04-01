FROM cypress/browsers:node12.6.0-chrome77

# avoid too many progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1

ARG NPM_TOKEN
ARG NPM_HOST=registry.npmjs.org
ARG NPM_HOST_PROTOCOL=https

RUN npm config set "//$NPM_HOST/:_authToken=$NPM_TOKEN"
RUN npm config set @miroculus:registry="$NPM_HOST_PROTOCOL://$NPM_HOST"

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY . ./

CMD ["npm", "run" "e2e:ci"]
