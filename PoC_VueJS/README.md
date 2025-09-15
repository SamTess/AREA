# PoC Vue.js

Application Vue 3 initialisée avec Vite pour des essais rapides dans `PoC_VueJS`.

## Démarrage

Dev server (HMR) sur http://localhost:5173:

```sh
npm run dev
```

## Scripts

- npm run dev – lance le serveur de dev
- npm run build – build de production dans `dist/`
- npm run preview – prévisualise le build localement

## Structure

- src/ – code source (entrée: `src/main.js`)
- index.html – template HTML Vite
- vite.config.js – configuration Vite

## Prérequis

- Node.js 18+ recommandé (détecté: 20.x)

## Notes

Ce dossier est isolé du reste du mono-repo. Aucune intégration back n'est configurée.

## Configuration API

Créez un fichier `.env` à la racine avec, par exemple:

```
VITE_API_URL=http://localhost:3000
VITE_JWT_STORAGE_KEY=poc_jwt
VITE_REFRESH_ENDPOINT=/auth/refresh
```

## Vues clés

- `/login` – Formulaire de login. Appel POST `/auth/login` attendu pour récupérer `{ accessToken, refreshToken }`.
- `/todos` – Appels GET/POST `/todos`, affiche le payload JWT.
- `/api` – API Inspector (méthode, chemin, corps JSON, avec/sans auth) + affichage des réponses.

## JWT & Refresh

- Intercepteurs Axios: ajout d'`Authorization: Bearer <token>`, refresh auto (401 et proactif si <30s).
- Persistance locale via `localStorage` (clé `VITE_JWT_STORAGE_KEY`).
