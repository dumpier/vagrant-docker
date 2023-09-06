FROM node:latest
# RUN apt-get update && apt-get -y install nodejs npm
RUN npm install -g npm
RUN cd /usr && npm install nodemon

WORKDIR /usr/src/app
RUN npm install --no-bin-links express
RUN npm install --no-bin-links socket.io

EXPOSE 3000
CMD [ "npm", "run", "start.dev" ]
#CMD [ "nodejs", "server.js" ]