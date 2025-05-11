FROM node:22.15.0

WORKDIR /home/backend_app

RUN apt-get update

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]