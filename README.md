# Karsa

A private, responsive personal project-management prototype. UI language: Indonesian.

## Run locally

Requires Node.js 20+ only for checks; serving the static app needs no dependencies.

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Or use `sites-preview start` in a managed Sites environment.

## Included

- Overview with derived active project, open task and completed task totals.
- Project creation, editing, deletion, active/paused/completed statuses, grid/list filters.
- Manual Continue links open project details without generating or starting tasks.
- Manual task creation, editing, priorities, optional dates, notes, and checklists.
- Task completion/reopening; project progress is completed tasks divided by all tasks.
- Global search, per-page search, task status and project filters.
- Browser-local persistence, JSON backup export/import, cross-tab updates, empty workspace.
- Responsive desktop, tablet, and phone layouts, keyboard dialogs, reduced-motion support.

## Data and privacy

Website access is restricted by Sites to its owner. The application stores records in localStorage in each browser, not on a shared server. Devices and origins have separate data. Back up through Data & preferences before changing devices or clearing browser data. The first launch includes clearly labelled sample data. Clear it through Data to start a blank workspace. No analytics, external fonts, plugins, or third-party API calls.

## Checks

```sh
npm test
node --check dist/app.js
```

See QA.md for browser flow validation. The tracked `.openai/hosting.json` binds this checkout to its private Site. Use the Sites workflow helper to sync source and package the static `dist` assets before deploying.
