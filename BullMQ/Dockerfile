FROM node:20-alpine

ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /usr/src/postminder
RUN mkdir -p /usr/src/postminder/BullMQ

WORKDIR /usr/src/postminder/BullMQ

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]