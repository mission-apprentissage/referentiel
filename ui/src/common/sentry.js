import { captureException, init } from "@sentry/browser";

let isEnabled = !!process.env.REACT_APP_ANNUAIRE_SENTRY_DSN;

export const sendError = (e) => {
  if (!isEnabled) {
    console.error("[SENTRY] An error occurred", e);
  } else {
    return captureException(e);
  }
};

export const initialize = () => {
  if (!isEnabled) {
    return;
  }

  init({
    dsn: process.env.REACT_APP_ANNUAIRE_SENTRY_DSN,
    environment: process.env.REACT_APP_ANNUAIRE_ENV || "dev",
    beforeSend(event) {
      console.log(event);
      return event;
    },
  });

  console.log(`Sentry enabled`);
};
