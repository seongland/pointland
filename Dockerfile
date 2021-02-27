FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY nuxt.config.js ./
COPY src ./src/
COPY yarn.lock ./
COPY .git ./
RUN  curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
RUN  apt install git-lfs
RUN git lfs pull

RUN yarn --only=production

CMD [ "yarn", "start" ]
