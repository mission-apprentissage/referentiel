FROM node:14.17-stretch

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile && \
    yarn global add local-web-server

# Build site
COPY . ./
ARG ANNUAIRE_SENTRY_DSN
ARG ANNUAIRE_ENV
ENV REACT_APP_ANNUAIRE_ENV=$ANNUAIRE_ENV
ENV REACT_APP_ANNUAIRE_SENTRY_DSN=$ANNUAIRE_SENTRY_DSN
RUN INLINE_RUNTIME_CHUNK=false yarn build && \
    mv /app/build /site

EXPOSE 3000
CMD ws --port 3000 -d /site --log.format dev --spa index.html
