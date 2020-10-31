FROM node:lts

COPY . .

RUN mv .env.example .env
RUN npm install

CMD [ "npm", "start" ]