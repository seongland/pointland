FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY nuxt.config.js ./
COPY src ./src/
COPY yarn.lock ./
COPY .env ./

RUN yarn

EXPOSE 8080

CMD [ "yarn", "start" ]
