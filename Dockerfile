FROM node:20-alpine

ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /usr/src/postminder
RUN mkdir -p /usr/src/postminder/frontend

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# RUN yarn build

EXPOSE 8080

# CMD ["yarn", "preview"]
CMD ["yarn", "dev"]