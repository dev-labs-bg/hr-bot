FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/github
RUN mkdir -p /usr/src/github/app
WORKDIR /usr/src/github

# Install app dependencies
COPY app/package.json /usr/src/github/
RUN npm install

# Install nodemon. We use it for server auto reloading on a file change
RUN npm install --global nodemon

EXPOSE 8080

CMD [ "npm", "start" ]
