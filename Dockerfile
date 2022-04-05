FROM node:16.14.2

LABEL MAINTAINER = "andres.r.oyarce@gmail.com"
LABEL version="1.0.0"

#ENV NODE_ENV=production

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD ["npm", "start"]

