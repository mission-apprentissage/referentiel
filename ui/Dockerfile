FROM node:16.13.1-stretch

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile && \
    yarn global add local-web-server

# Build site
COPY . ./
ARG REFERENTIEL_SENTRY_DSN
ARG REFERENTIEL_ENV
ARG REFERENTIEL_NO_BUILD
ENV REACT_APP_REFERENTIEL_ENV=$REFERENTIEL_ENV
ENV REACT_APP_REFERENTIEL_SENTRY_DSN=$REFERENTIEL_SENTRY_DSN
RUN if [ -z "$REFERENTIEL_NO_BUILD" ] ; then \
      INLINE_RUNTIME_CHUNK=false yarn build && mv /app/build /site ; \
    else \
      echo "No Build" ; \
    fi

EXPOSE 3000
CMD ws --port 3000 -d /site --log.format dev --spa index.html
