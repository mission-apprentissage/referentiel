FROM node:16.13.1-stretch

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile && \
    yarn global add local-web-server

# Map arguments to react-scripts env variables
ARG REFERENTIEL_SENTRY_DSN
ARG REFERENTIEL_ENV
ENV REACT_APP_REFERENTIEL_ENV=$REFERENTIEL_ENV
ENV REACT_APP_REFERENTIEL_SENTRY_DSN=$REFERENTIEL_SENTRY_DSN

# Build site
SHELL ["bash", "-c"]
COPY . ./
RUN mkdir -p /site
RUN if [[ "$REFERENTIEL_ENV" == "dev" ]] ; then \
      echo "[WARNING] Site has not been built. You must start this container with command 'yarn start'" ; \
    else \
      INLINE_RUNTIME_CHUNK=false yarn build && mv /app/build /site ; \
    fi

EXPOSE 3000
CMD ws --port 3000 -d /site --log.format dev --spa index.html
