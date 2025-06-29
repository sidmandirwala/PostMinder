FROM node:20-alpine

ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /usr/src/postminder
RUN mkdir -p /usr/src/postminder/server
RUN mkdir -p /usr/src/postminder/server/uploads

WORKDIR /usr/src/postminder/server

COPY package.json yarn.lock ./

RUN yarn install

COPY . .


EXPOSE 3000

CMD ["node", "index.js"]