# Mobile Architecture

This document describes the structure and rationale of the AREA Mobile app.

## Overview
- UI components are presentational and stateless where possible.
- Business logic and state are encapsulated in hooks.
- Styling uses a small theme module for consistent colors/spacing.

## Entry
- `index.ts` registers `App` via Expo.
- `App.tsx` composes the screen using:
  - `KeyboardAvoidingView` (keyboard handling)
  - `ScrollView` (vertical scrolling)
  - `TodoInput` + `TodoList` for the Todo feature
  - `HttpCat` to display an http.cat image (status code driven by UI state)

## Components
- `TodoInput`: Controlled input and submit button; accepts `value`, `onChangeText`, `onSubmit`, `showError`.
- `TodoItem`: Renders a single todo with toggle and remove actions; controlled by parent.
- `TodoList`: Maps todos to `TodoItem`; shows empty state when needed.
- `HttpCat`: Displays an image from `https://http.cat/[status]`.

## Hooks
- `useTodos`:
  - State: `value`, `toDoList`, `error`.
  - Actions: `handleSubmit`, `removeItem`, `toggleComplete`, `showError`.
  - Keeps the component tree simple and declarative.

## Types
- `interfaces/IToDo.interface.ts` defines the `IToDo` shape: `{ text: string; completed: boolean }`.

## Styles & Theming
- `styles/theme.ts`: primitive design tokens (`colors`, `spacing`, `typography`).
- `styles/appStyles.ts`: screen-level styles; `container`, `title`, `subtitle`, `screen`.

## TypeScript
- `tsconfig.json` extends Expo base and uses `moduleResolution: bundler` to support `customConditions`.

## Conventions
- Prefer hooks for logic reuse.
- Keep components small and focused.
- Avoid one-letter variable names.
- No inline comments in code unless necessary.

## Future Enhancements
- Persist todos (AsyncStorage or backend API).
- Add navigation and split screens (e.g., `screens/` + `navigation/`).
- Dark mode via theme toggling.
- Tests for hooks and components.
