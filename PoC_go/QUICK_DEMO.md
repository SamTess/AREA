# AREA Go Backend PoC: Triggers & Hooks Demo

This document explains how to use and test the trigger/hook system in your Go backend, including example commands and expected results.

---

## 1. Start the Webhook Server (for hook testing)

```bash
cd /home/toujourspasmoi/tek3/Area_project/AREA/App/Back
# In a new terminal:
go run webhook.go
```
**Expected output:**
```
2025/09/15 15:51:24 Webhook server listening on :9000/webhook
```

---

## 2. Set the Webhook URL (in the terminal where you run your backend)

```bash
export TODO_WEBHOOK_URL="http://localhost:9000/webhook"
```

---

## 3. Start the Main Backend

```bash
cd /home/toujourspasmoi/tek3/Area_project/AREA/App/Back
go run main.go
```

---

## 4. Create a Todo (Test the Trigger)

```bash
curl -X POST http://localhost:8080/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Trigger Test", "description": "This should log to console", "completed": false}'
```
**Expected backend output:**
```
2025/09/15 15:52:07 [TRIGGER] New Todo created: ID=2, Title=Trigger Test
```

---

## 5. Complete a Todo (Test the Hook)

```bash
curl -X PUT http://localhost:8080/todos/2 \
  -H "Content-Type: application/json" \
  -d '{"title": "Trigger Test", "description": "This should log to console", "completed": true}'
```
**Expected webhook server output:**
```
[WEBHOOK RECEIVED]: {"id":2,"title":"Trigger Test","description":"This should log to console","completed":true}
```

**Note:** If you use the wrong ID, you may see an error like:
```
/home/toujourspasmoi/tek3/Area_project/AREA/App/Back/main.go:156 record not found
[0.117ms] [rows:0] SELECT * FROM `todos` WHERE `todos`.`id` = 0 ORDER BY `todos`.`id` LIMIT 1
```
This is normal—just use the correct ID from the POST response.

---

## 6. What is a Trigger? What is a Hook?

- **Trigger:** An internal action (e.g., log to console) when something happens (like creating a todo).
- **Hook:** An external notification (e.g., HTTP POST to another service) when something happens (like completing a todo).

---

## 7. How to Add More Triggers/Hooks

- In `main.go`, use `registerTodoCreatedTrigger(func(todo Todo) { ... })` to add a trigger for creation.
- Use `registerTodoCompletedHook(func(todo Todo) { ... })` to add a hook for completion.
- Triggers and hooks can do anything: log, send emails, call APIs, etc.

---

## 8. Advanced: Test with a Real Webhook Service

- Use https://webhook.site/ to get a public URL and set it as your `TODO_WEBHOOK_URL`.
- Complete a todo and see the POSTed data in your browser.

---

If you have questions or want to see more advanced examples, just ask!
