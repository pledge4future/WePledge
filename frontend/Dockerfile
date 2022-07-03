FROM node:12.13-buster-slim AS development

RUN addgroup --gid 1006 developers \
    && usermod -a -G developers node
USER node
RUN mkdir ~/app && mkdir ~/.vscode-server
WORKDIR /home/node/app
#COPY package.json ./
RUN yarn install
EXPOSE 3000

# CMD ["sh", "-c", "./wait-for.sh cube:4000 -- ./entryPoint.sh"]
CMD ["sh", "./entryPoint.sh"]

#FROM development AS build
#COPY . .
#RUN npm run build


# FROM nginx:1.17-alpine AS production
# RUN apk update && apk add apache2-utils
# COPY --from=build /home/node/app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
