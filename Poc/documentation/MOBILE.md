## Mobile (Expo React Native)

The mobile app lives in `Poc/mobile` and talks to the backend at `/api`.

### Prerequisites

- Backend running and reachable from the device/emulator
- Node.js + npm
- Expo Go app installed on your phone (or Android/iOS emulator)

### Environment

Option A — Generate from backend env (recommended):

```bash
cd Poc/scripts
chmod +x sync-mobile-env.sh
# Android emulator
./sync-mobile-env.sh --android
# or iOS simulator
./sync-mobile-env.sh --ios
```

This creates `Poc/mobile/.env` with:

- `EXPO_PUBLIC_API_BASE_URL` (includes `/api`)
- `EXPO_PUBLIC_GITHUB_CLIENT_ID` (from backend `GITHUB_APP_CLIENT_ID`)

Option B — Manual `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080/api   # Android emulator
EXPO_PUBLIC_GITHUB_CLIENT_ID=<your_github_client_id>
```

Notes:

- Android emulator: use `10.0.2.2` instead of `localhost`.
- iOS simulator: `http://localhost:8080/api` works; on real device use your computer's LAN IP.

### GitHub OAuth Setup

- Because GitHub requires HTTPS redirect for production, we use the Expo proxy in development.
- Ensure your GitHub OAuth App has the callback URL:
  - `https://auth.expo.io/@anonymous/area-mobile` (or your EAS owner/slug if not anonymous)
- The app calls `/api/auth/github/exchange` which sets the `area_auth` HttpOnly cookie.

### Run the App

```bash
cd Poc/mobile
npm install
npm run start
```

Then scan the QR code with Expo Go, or press `a`/`i` to open in emulator.

Quick scripts from mobile package.json:

```bash
cd Poc/mobile
# Generate env depending on target
npm run env:android   # or npm run env:ios
# Start bundler
npm run start
```

### Troubleshooting

- Button disabled: ensure `EXPO_PUBLIC_GITHUB_CLIENT_ID` is set in `.env`.
- After login 401 on `/auth/me`: verify API base URL (emulator host), backend CORS allows credentials, and that the backend returns a `Set-Cookie` header.
- Expo Go SDK mismatch: upgrade the SDK in `package.json` (`expo`), then re-install.
