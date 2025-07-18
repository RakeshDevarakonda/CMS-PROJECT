FROM node:20-alpine

WORKDIR /cmsbackend

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]
