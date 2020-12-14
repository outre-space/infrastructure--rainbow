FROM node:14-alpine
MAINTAINER Outre dev@outrespace.com

WORKDIR /app
COPY package.json ./

RUN npm install --production

COPY . .

CMD PORT = 3000 & npm start
EXPOSE 3000
