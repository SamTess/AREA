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
    CatImage.tsx        # Fetches a random cat image from TheCatAPI
    HttpCat.tsx          # Displays https://http.cat/[status_code]
    TodoInput.tsx        # Input + add button + error message
    TodoItem.tsx         # Single todo row
    TodoList.tsx         # Maps todos to TodoItem
  hooks/
    useTodos.ts          # Todo business logic/state
  interfaces/
    IToDo.interface.ts   # Types
  context/
    ThemeContext.tsx     # Light/Dark scheme provider
  styles/
    theme.ts             # Colors, spacing, typography (legacy constants)
  assets/                # Icons, images
```

## Tech Notes
- Styling now uses **NativeWind** (Tailwind for React Native). See `tailwind.config.js`.
- Dark mode supported via `darkMode: 'class'` and a custom `ThemeProvider`.
- TypeScript module resolution uses `"bundler"` to support Expo + `customConditions` from `expo/tsconfig.base`.
- Remote image rendering via `Image` with `uri`.
- Scroll behavior: `ScrollView` with `contentContainerStyle` and `KeyboardAvoidingView` for better keyboard UX.

### NativeWind Usage
Utility classes are applied via the `className` prop. We use conditional concatenation (JS) instead of `dark:` variants inside components for clarity:
```tsx
const isDark = scheme === 'dark';
<View className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background'} px-6`}>
  <Text className={isDark ? 'text-text-dark font-bold text-2xl' : 'text-text font-bold text-2xl'}>Hello</Text>
</View>
```

Tailwind config defines color tokens: `background`, `text`, `muted`, plus dark counterparts `background-dark`, `text-dark`, `muted-dark`.

### Dark Mode Toggle
`ThemeToggle` flips the internal `scheme` in `ThemeProvider`. Components read `scheme` and choose classes accordingly (no reliance on adding a global `.dark` class). This avoids edge cases with nested scroll views.

To switch to variant syntax later, reintroduce `dark:` classes and put `className={isDark ? 'dark flex-1' : 'flex-1'}` at the app root.

If you prefer system-only behavior, remove the toggle and listen to `Appearance.addChangeListener` to update `scheme`.

### TheCatAPI (API Key)
The app includes a helper and component to display a random cat image from TheCatAPI.

1) Set your API key (public Expo env var):
```bash
export EXPO_PUBLIC_CAT_API_KEY=your_thecatapi_key
```

2) Use the component (already rendered in `App.tsx`):
```tsx
import CatImage from './components/CatImage';
<CatImage mimeTypes="jpg,png" size="med" />
```

3) Or call the service directly:
```ts
import { fetchRandomCatImage } from './services/catapi';
const img = await fetchRandomCatImage({ mime_types: 'jpg,png', size: 'med' });
console.log(img.url);
```

Notes:
- TheCatAPI expects the API key in header `x-api-key`.
- If no key is set, requests may be rate-limited or fail.

## Patterns
- Keep UI dumb (components) and move logic into hooks.
- Prefer Tailwind utility classes; `theme.ts` remains for potential JS-calculated spacing.
- Avoid reintroducing StyleSheet unless performance-critical edge cases arise.

## Troubleshooting
- Android SDK: ensure `adb` is in `PATH`.
- "Asset not found": verify any local `require('...')` paths exist; remote images via `uri` are fine.
- TS complaints about `customConditions`: set `moduleResolution: "bundler"` in `tsconfig.json`.

## License
See repository root `LICENSE`.
