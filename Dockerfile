FROM node:14

WORKDIR /usr/src/app

RUN git clone https://github.com/seongland/pointland .
RUN  curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
RUN  apt install git-lfs
RUN git lfs pull

RUN yarn --only=production

CMD [ "yarn", "start" ]
