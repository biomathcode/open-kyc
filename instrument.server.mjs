import * as Sentry from "@sentry/tanstackstart-react";
Sentry.init({
    dsn: "https://b1728c20e4ac827cae3162eaf89aad7c@o4504789994373120.ingest.us.sentry.io/4510331224129536",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
});