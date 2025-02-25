FROM node:22

WORKDIR /gps_service_node

COPY . .

RUN rm -rf node_modules
RUN npm i

CMD ["npm", "start"]

EXPOSE 3050