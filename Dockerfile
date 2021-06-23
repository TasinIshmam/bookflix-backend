FROM node:14-slim

RUN apt-get update
RUN apt-get install -y --no-install-recommends gcc libc-dev python3-dev libssl-dev

RUN mkdir /app
COPY ./app /app
WORKDIR /app

RUN npm install

RUN npm run build

RUN cp src/schema.graphql dist/schema.graphql

RUN useradd user
RUN chown -R user:user /app
RUN chmod -R 755 /app
USER user

CMD ["npm", "start"]


