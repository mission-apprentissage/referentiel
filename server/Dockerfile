FROM node:18.4.0-bullseye

#Install and cache node_modules
COPY package.json yarn.lock /app/
RUN yarn install --cwd /app --frozen-lockfile

COPY ./ /app

VOLUME /data
EXPOSE 5000
WORKDIR /app
CMD ["yarn", "start"]
