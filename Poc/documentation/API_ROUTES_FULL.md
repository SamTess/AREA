# Todo API Routes (Detailed)

This document describes the HTTP API used by the frontend for the Todo app. Endpoints are written relative to the API base (for example `/todos`). If your backend runs on another origin, set `NEXT_PUBLIC_API_URL` in the frontend to that base URL (e.g. `http://localhost:4000`).

Base todo object

```json
{
  "id": "string",
  "title": "Buy milk",
  "completed": false
}
```

Summary table

| Method | Path | Purpose |
|---|---|---|
| GET | /todos | List todos (optionally filter by completed) |
| GET | /todos/:id | Get a single todo |
| POST | /todos | Create a new todo |
| PATCH | /todos/:id | Partially update a todo (toggle completed, update title) |
| PUT | /todos/:id | Replace a todo (optional) |
| DELETE | /todos/:id | Delete a todo |
| PATCH | /todos/order | Reorder todos (optional) |
| POST | /todos/clear-completed | Delete all completed todos (optional) |

Endpoints (detailed)

- GET /todos
  - Query parameters (optional):
    - `completed=true|false` — filter by completion status
  - Response: `200 OK`
    - Body: JSON array of todo objects.
  - Example:
    ```bash
    curl -sS http://localhost:3000/todos
    ```

- GET /todos/:id
  - Response: `200 OK` with the todo object, or `404 Not Found` if the id doesn't exist.
  - Example:
    ```bash
    curl -sS http://localhost:3000/todos/abc123
    ```

- POST /todos
  - Purpose: Create a new todo.
  - Request body (JSON):
    - `title` (string) — required
    - `completed` (boolean) — optional, defaults to `false`
  - Response: `201 Created`
    - Body: the created todo object (must include `id`).
  - Example:
    ```bash
    curl -sS -X POST http://localhost:3000/todos \
      -H "Content-Type: application/json" \
      -d '{"title":"Write docs"}'
    ```

  - Example response:
    ```json
    {
      "id": "abc123",
      "title": "Write docs",
      "completed": false
    }
    ```

- PATCH /todos/:id
  - Purpose: Partial update. Useful for toggling completion or renaming.
  - Request body (JSON): any subset of todo fields, e.g. `{ "completed": true }` or `{ "title": "New" }`.
  - Response: `200 OK` with the updated todo object.
  - Example:
    ```bash
    curl -sS -X PATCH http://localhost:3000/todos/abc123 \
      -H "Content-Type: application/json" \
      -d '{"completed": true}'
    ```

- PUT /todos/:id
  - Purpose: Replace the todo entirely. Not required by the frontend but supported by some backends.
  - Request body: complete todo object.
  - Response: `200 OK` or `204 No Content`.

- DELETE /todos/:id
  - Purpose: Remove a todo.
  - Response: `204 No Content` when removed, or `404 Not Found` if not present.
  - Example:
    ```bash
    curl -sS -X DELETE http://localhost:3000/todos/abc123
    ```

Optional endpoints (useful extras)

- PATCH /todos/order
  - Purpose: Persist a new order for todos.
  - Request body (JSON): array of ids in the desired order, e.g. `["id1","id2","id3"]`.
  - Response: `200 OK` (maybe with updated list) or `204 No Content`.

- POST /todos/clear-completed
  - Purpose: Delete all completed todos.
  - Response: `204 No Content`.

Error handling & status codes

- 200 OK — successful GET/PATCH/PUT with a response body
- 201 Created — successful POST returning the created resource
- 204 No Content — successful DELETE or PUT without response body
- 400 Bad Request — malformed JSON or validation error (e.g., missing `title` on create)
- 404 Not Found — resource not found
- 500 Internal Server Error — unexpected server error

Examples (fetch from browser)

Create a todo:

```js
await fetch(`${API_BASE}/todos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Buy milk' })
});
```

Toggle a todo:

```js
await fetch(`${API_BASE}/todos/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ completed: true })
});
```

Notes & recommendations

- Return the complete todo object on create/update so the frontend can rely on the authoritative `id` and any server-populated fields.
- If frontend and backend are on different origins, enable CORS on the backend and/or set `NEXT_PUBLIC_API_URL` for the frontend.
- Consider adding pagination or limits to `GET /todos` if the list may grow large.

If you want, I can also generate a tiny example backend (Express) that implements these endpoints for local testing. Do you want me to add that to the repo?
