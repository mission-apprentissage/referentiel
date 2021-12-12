FROM node:16.13.1-stretch

#Install and cache node_modules
COPY package.json yarn.lock /app/
RUN yarn install --cwd /app --frozen-lockfile

COPY ./ /app

VOLUME /data
EXPOSE 5000
WORKDIR /app
CMD ["yarn", "start"]
