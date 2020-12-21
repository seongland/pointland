FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY src ./src/
COPY yarn.lock ./

RUN yarn
RUN yarn global install pm2
RUN yarn start

EXPOSE 8080

CMD [ "yarn", "production" ]
