# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pointland is an interactive 3D point cloud viewer built with Nuxt 2, Vue 2, and TypeScript. It's a PWA that streams point clouds from Google Cloud Storage using the Potree library, featuring touchscreen-friendly joystick navigation.

## Build & Development Commands

```bash
yarn dev        # Development server at localhost:8080
yarn build      # Production build
yarn generate   # Generate static site (includes favicon generation)
yarn lint       # ESLint for .ts and .vue files
yarn format     # Prettier formatting
```

Note: Build uses `NODE_OPTIONS=--openssl-legacy-provider` for legacy Node compatibility.

## Architecture

### Source Structure (`src/`)

- **composables/**: Vue 3 Composition API logic
  - `useController.js`: Touchscreen/joystick navigation via nipplejs
  - `usePointland.js`: 3D scene initialization with LayerSpace/Potree
- **components/**: Vue components (`PointLand.vue` is the main 3D viewer)
- **store/**: Vuex store with localStorage persistence
- **pages/**: Nuxt auto-routed pages (single `index.vue`)
- **layouts/**: App layouts with Vuetify shell

### Key Technologies

- **3D Stack**: LayerSpace → Potree → Three.js
- **UI**: Vuetify 1.x with dark theme
- **Input**: nipplejs virtual joysticks (4-zone touchscreen controls)
- **State**: Vuex with nuxt-vuex-localstorage

### Configuration

- **SSR disabled**: Static site generation (`target: 'static'`)
- **srcDir**: `src/`
- **TypeScript**: Strict mode, ESNext target
- **Port**: 8080

## Git Conventions

**Branch naming**: `<type>/#<issue>-<description>`

- Types: feature, bug, document, style, refactor, test, deps
- Example: `feature/#123-add-dark-mode`

**Commit format**: `<type>(<scope>): <subject>`

- Types: feat, fix, docs, style, refactor, test, ci, cd, build, meta, pr, lint, typing, perf, deps, merge
- Example: `feat(3d): add cloud point filtering`
