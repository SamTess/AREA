# AREA Mobile (Expo React Native)

Simple mobile app inspired by the web frontend. It authenticates with GitHub (via backend) and manages Todos.

## Env

Option A — Sync from backend env:

```
cd ../scripts
chmod +x sync-mobile-env.sh
# Android emulator
./sync-mobile-env.sh --android
# or iOS simulator
./sync-mobile-env.sh --ios
```

Option B — Create `.env` manually:

```
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080/api
EXPO_PUBLIC_GITHUB_CLIENT_ID=<value of GITHUB_APP_CLIENT_ID from backend env>
```

## Run

Install dependencies then start Expo:

```
npm install
npm run start
```

Open on Android/iOS emulator or Expo Go. Ensure the backend is reachable from the device using the API base URL above.

Notes for emulators:

- Android Emulator: use `http://10.0.2.2:8080/api` instead of `localhost`.
- iOS Simulator: `http://localhost:8080/api` works. On a real device, use your computer's LAN IP.

OAuth (GitHub):

- The app opens GitHub to obtain a code, then calls your backend `/api/auth/github/exchange` which sets an `HttpOnly` cookie (`area_auth`).
- For a smooth flow in development, add the Expo proxy redirect to your GitHub OAuth App Allowed Callback URLs: `https://auth.expo.io/@anonymous/area-mobile` (or your EAS owner slug). If you don't, configure your GitHub app redirect to the URL returned by `AuthSession.makeRedirectUri()` printed on the login screen).
