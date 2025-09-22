# AREA

## Mobile (NativeScript) - Liste de Tâches (Todos)

Une fonctionnalité simple de gestion de tâches a été ajoutée dans l'application mobile (`Mobile/`).

### Accès
Depuis la page d'accueil, appuyer sur le bouton `Todos` dans la barre d'action.

### Fonctionnalités
- Ajouter une tâche via le champ texte + bouton "Ajouter" ou la touche entrée.
- Marquer une tâche comme terminée (tap sur l'icône cercle / check).
- Supprimer une tâche (icône poubelle).
- Effacer toutes les tâches terminées (bouton "Supprimer terminées").
- Persistance locale via `ApplicationSettings` (les tâches restent après redémarrage de l'appareil).

### Structure du code
- `app/todos/todo-model.ts` : interface `TodoItem`, création et persistance.
- `app/todos/todos-view-model.ts` : logique (ajout, toggle, suppression, clear, sauvegarde).
- `app/todos/todos-page.xml|ts` : UI et handlers d'événements.

### Lancer l'application (exemple Android)
Dans le dossier `Mobile/` :

```bash
ns run android
```

Ou pour iOS (sur macOS) :

```bash
ns run ios
```

### Améliorations possibles
- Édition inline du titre.
- Filtrage (Tous / Actifs / Terminés).
- Synchronisation distante (API backend).
- Tests unitaires du ViewModel.
