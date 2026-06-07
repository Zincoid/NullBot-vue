# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm run dev      # Start Vite dev server with hot reload
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

No test framework or linter is currently configured.

## Architecture

NullBot is a Vue 3 admin dashboard with Element Plus UI (dark mode). The backend is a Java Spring Boot service; the frontend communicates via REST APIs proxied through `/api`.

### Routing & layout

- `/` and `/login` → Login page; `/regist` → Register page
- `/index` → Main layout ([Index.vue](src/views/Index.vue)) wrapping a header, sidebar nav, and nested `<router-view />`
- All functional pages live under `/index/*` as children of the Index route: File, Center, Saying, Stats, User, Group, Item, System

### Data flow

- `src/utils/request.js` — Axios instance with `/api` base URL, auto-attaches `token` header from localStorage, unwraps `response.data`
- `src/api/` — One module per domain (system, user, file, group, item, inventory, saying, stats). Each exports functions that call the Axios instance.
- Backend responses follow the pattern `{ code: 1, message: "", data: {} }` where code `1` means success.
- Auth tokens are stored in `localStorage` under key `"token"`.

### Cross-component state

The Index layout uses Vue `provide`/`inject` to share state with child views:
- `searchKey` / `searchTrigger` — for the file search bar in the header
- `syncTrigger` — incremented after sync to notify children to refresh
- `userType` (0=guest, 1=admin) and `info` (user profile object)

### API proxy

- **Dev**: Vite dev server rewrites `/api/*` → `/nullbot/*` and forwards to `http://101.200.136.96:8080`
- **Production**: Nginx at [nginx.conf](nginx.conf) does the same rewrite, with additional `/ws` WebSocket proxy for monitoring

### Path aliases

`@` maps to `src/`, configured in both [vite.config.js](vite.config.js) and [jsconfig.json](jsconfig.json).

### Key dependencies

- **Element Plus** — UI component library, dark mode via `element-plus/theme-chalk/dark/css-vars.css`, all icons globally registered
- **ECharts 6** — Charts via [BarChart.vue](src/components/BarChart.vue) and [LineChart.vue](src/components/LineChart.vue) wrapper components
- **Vue Router 5** — Client-side routing with HTML5 history mode
