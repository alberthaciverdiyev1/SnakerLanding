# Agent Instructions

## Project Snapshot

Snaker is a Node.js/Express promotional website for an ecommerce platform.
The server entry point is `src/app.js`, routing lives in `src/routes`, page logic in `src/controllers`, templates in `src/views`, locale strings in `src/locales`, and static assets in `src/public` plus `public`.

## Commands

- Install dependencies with `npm install`.
- Run locally with `npm run dev`.
- Run production-style with `npm start`.
- There is no test script configured yet; if adding tests, add the script to `package.json`.

## Working Rules

- Keep changes scoped to the requested feature or fix.
- Preserve the existing Express and Handlebars structure unless a task explicitly asks for a larger refactor.
- Do not commit generated dependencies, logs, build output, or environment files.
- Do not read, print, or modify `.env*` files unless the user explicitly asks.
- Prefer existing locale/config files over hardcoded page copy.
- When adding visible text, update all relevant locale files: `az`, `tr`, `en`, and `ru`.
- Keep static assets lightweight and place site assets under `src/public` unless the root `public` path is specifically required.

## Style Notes

- Use CommonJS style to match the current codebase.
- Keep JavaScript straightforward and dependency-light.
- Keep Handlebars markup semantic and avoid adding inline scripts/styles when an existing CSS or JS file can hold the change.
- Maintain responsive behavior across mobile and desktop.

