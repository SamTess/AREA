## Frontend (Web + Mobile)

This repo contains two frontends:

- Web (Next.js) in `Poc/frontend`
- Mobile (Expo React Native) in `Poc/mobile` — see `MOBILE.md` for details

Below are the steps to run the Web app; for Mobile, read `MOBILE.md` in the same folder.

---

## Web Frontend (Next.js)

Prerequisites:

- Backend running and reachable (default `http://localhost:8080`)
- Node.js + npm

Environment:

- Copy the example env and set the variables:
	```bash
	cd Poc/frontend
	cp example.env .env.local
	# Edit .env.local as needed
	```
- Required variables in `.env.local`:
	- `NEXT_PUBLIC_API_BASE_URL` (ex: `http://localhost:8080/api`)
	- `NEXT_PUBLIC_GITHUB_CLIENT_ID` (from your GitHub OAuth App)

Run locally:

```bash
cd Poc/frontend
npm install
npm run dev
# open http://localhost:3000
```

GitHub OAuth (Web):

- Ensure your GitHub OAuth App has a callback URL like:
	- `http://localhost:3000/auth/github/callback`
- The web app will redirect you back to that page then call the backend `/api/auth/github/exchange` which sets the `area_auth` HttpOnly cookie.

Mobile docs: see `Poc/documentation/MOBILE.md`.
