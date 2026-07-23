# app/api/

Route Handlers go here (`app/api/<name>/route.ts`) — for webhooks,
third-party integrations, or any endpoint that can't be a Server Action.
Prefer Server Actions for form submissions and mutations triggered from
within the app; reach for a Route Handler when you need a stable URL for
an external caller (webhook, public API, non-JS client).
