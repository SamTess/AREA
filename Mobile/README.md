# AREA Mobile (Expo + React Native)

This is the React Native (Expo) mobile client for AREA.

## Quick Start

```bash
cd Mobile
npm install
npm start
# press 'a' for Android, 'w' for Web, or scan the QR code
```

If Android emulator fails with SDK errors:
- Install Android Studio + SDK.
- Set `ANDROID_HOME` and add `platform-tools` to your `PATH`.

```bash
# Example (adjust paths as needed)
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools/bin' >> ~/.bashrc
source ~/.bashrc
```

## Scripts
- `npm start`: start Expo (Metro bundler)
- `npm run android`: open Android
- `npm run ios`: open iOS (on macOS)
- `npm run web`: open web

## Project Structure
```
Mobile/
  App.tsx                # Root screen (uses ScrollView + KeyboardAvoidingView)
  index.ts               # Expo entry (registers App)
  components/
    HttpCat.tsx          # Displays https://http.cat/[status_code]
    TodoInput.tsx        # Input + add button + error message
    TodoItem.tsx         # Single todo row
    TodoList.tsx         # Maps todos to TodoItem
  hooks/
    useTodos.ts          # Todo business logic/state
  interfaces/
    IToDo.interface.ts   # Types
  styles/
    appStyles.ts         # Screen-level styles
    theme.ts             # Colors, spacing, typography
  assets/                # Icons, images
```

## Tech Notes
- TypeScript module resolution uses `"bundler"` to support Expo + `customConditions` from `expo/tsconfig.base`.
- React Native version: see `package.json`.
- Remote image rendering via `Image` with `uri`.
- Scroll behavior: `ScrollView` with `contentContainerStyle` and `KeyboardAvoidingView` for better keyboard UX.

## Patterns
- Keep UI dumb (components) and move logic into hooks.
- Reuse styles via `theme.ts` and `appStyles.ts`.

## Troubleshooting
- Android SDK: ensure `adb` is in `PATH`.
- "Asset not found": verify any local `require('...')` paths exist; remote images via `uri` are fine.
- TS complaints about `customConditions`: set `moduleResolution: "bundler"` in `tsconfig.json`.

## License
See repository root `LICENSE`.
