FROM node:latest
# RUN apt-get update && apt-get -y install nodejs npm
RUN npm install -g npm
#RUN npm install nodemon

WORKDIR /usr/src/app
RUN npm install --no-bin-links express

EXPOSE 3000
#CMD [ "npm", "run", "start.dev" ]
CMD [ "nodejs", "server.js" ]