FROM node:14-alpine
MAINTAINER Outre dev@outrespace.com

ENV PORT=3000
ENV CONFIG_URL=https://s3.eu-central-1.amazonaws.com/auto-ci.outrespace.com/config.yml

WORKDIR /app
COPY package.json ./

RUN npm install --production

COPY . .
EXPOSE 3000

CMD npm start
