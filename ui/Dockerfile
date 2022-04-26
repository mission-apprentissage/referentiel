# Defining environment
ARG REFERENTIEL_ENV=production

FROM node:18-bullseye as base
#https://github.com/webpack/webpack/issues/14532
ENV NODE_OPTIONS=--openssl-legacy-provider
EXPOSE 3000
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./

FROM base as cra-production
RUN yarn global add local-web-server
RUN INLINE_RUNTIME_CHUNK=false yarn build && mv /app/build /site
RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]

FROM base as cra-dev
CMD yarn start

FROM cra-${REFERENTIEL_ENV} as final
