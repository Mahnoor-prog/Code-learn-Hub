FROM ubuntu:22.04
RUN apt-get update
COPY install.sh .
RUN bash install.sh
WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
