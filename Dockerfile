FROM node:14

WORKDIR /usr/src/app

RUN git clone git@github.com:seongland/pointland.git .
RUN git lfs pull

RUN yarn --only=production

CMD [ "yarn", "start" ]
