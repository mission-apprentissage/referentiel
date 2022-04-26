FROM node:18-bullseye

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && \
    yarn global add local-web-server

#https://github.com/webpack/webpack/issues/14532
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build site
COPY . ./
RUN INLINE_RUNTIME_CHUNK=false yarn build && mv /app/build /site


EXPOSE 3000
RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]
