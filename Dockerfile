FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY nuxt.config.js ./
COPY src ./src/
COPY yarn.lock ./

RUN yarn --only=production

CMD [ "yarn", "start" ]
