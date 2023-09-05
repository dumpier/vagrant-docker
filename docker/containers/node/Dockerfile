FROM node:latest
RUN apt-get update && apt-get -y install nodejs npm
RUN npm update -g

WORKDIR /usr/src/app

# RUN npm install nodemon
# RUN nodemon /usr/src/app/app.js
CMD nodejs /usr/src/app/app.js