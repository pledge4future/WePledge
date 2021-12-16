FROM node:12.13-buster-slim AS development
USER node
RUN mkdir /home/node/app && mkdir ~/.vscode-server
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN npm install
EXPOSE 4000
CMD ["entrypoint.sh"]