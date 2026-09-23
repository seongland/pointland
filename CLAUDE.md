# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pointland is an interactive 3D point cloud viewer built with React 19, Vite, and TypeScript (pnpm). It streams point clouds via the LayerSpace library with touchscreen-friendly joystick navigation.

## Architecture

- **3D Stack**: LayerSpace → Potree → Three.js
- **Hooks** (`src/hooks/`): `usePointland.ts` (scene init via LayerSpace), `useController.ts` (nipplejs joysticks), `useKeyboardController.ts`
- **State**: effector stores in `src/store/` (`ls.ts` persists camera position to localStorage)
- **Entry**: `App.tsx` with react-router; UI components are Radix + Tailwind CSS 4 (`src/components/`, includes a Gaussian-splat viewer switch)
- **E2E**: Playwright tests in `e2e/`

## Git Conventions

**Branch naming**: `<type>/#<issue>-<description>`

- Types: feature, bug, document, style, refactor, test, deps
- Example: `feature/#123-add-dark-mode`

**Commit format**: `<type>(<scope>): <subject>`

- Types: feat, fix, docs, style, refactor, test, ci, cd, build, meta, pr, lint, typing, perf, deps, merge
- Example: `feat(3d): add cloud point filtering`
