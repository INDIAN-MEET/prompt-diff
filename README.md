# PromptDiff

> See exactly what changed in your prompt. Instantly.

PromptDiff is a free, no-login web app that helps AI/ML developers and backend developers compare an old prompt with a new prompt and instantly see what changed — with special focus on JavaScript-style `${placeholder}` detection.

## Screenshot

<!-- Add screenshots here -->
![PromptDiff Screenshot](screenshot.png)

## Problem

When prompts are updated on a shared board, developers must manually compare old vs new to find what changed — especially `${placeholders}`, because a changed placeholder can break the code. PromptDiff does that comparison automatically, like GitHub's split diff view, and is simple enough for any non-technical person to use.

## Features

- **Side-by-side diff** — GitHub-style split view with line numbers and word-level highlighting
- **Placeholder detection** — Automatically finds all `${...}` template placeholders
- **Placeholder summary** — See new, removed, and unchanged placeholders at a glance
- **Change counter** — Line and placeholder change statistics with configurable warning threshold
- **Rename detection** — Pairs removed and added placeholders at similar positions
- **Copy buttons** — Copy summary or diff to clipboard with one click
- **Dark mode** — Light/dark theme toggle with preference persistence
- **Private & secure** — Everything runs in the browser. Nothing is ever uploaded or stored
- **Free, no login** — No account, no signup, no tracking

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run tests

```bash
npm run test
```

### Build for production

```bash
npm run build
```

The output is in the `dist/` folder — a static site ready to deploy.

## Deploy

### Vercel

```bash
npx vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

Or drag-and-drop the `dist/` folder at [netlify.com](https://app.netlify.com/drop).

### GitHub Pages

1. Add `base: '/prompt-diff/'` to `vite.config.js`
2. Run `npm run build`
3. Deploy the `dist/` folder using GitHub Pages

## Tech Stack

- React + Vite + Tailwind CSS
- [jsdiff](https://github.com/kpdecker/jsdiff) for line-level and word-level comparison
- Vitest for unit tests
- 100% frontend — no backend, no database

## Privacy

**Your prompts never leave your browser.** PromptDiff runs entirely client-side. No data is sent to any server, no cookies are set, and nothing is stored. The only thing saved in your browser is your theme preference (light/dark).

## License

[MIT](LICENSE)
