package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"log"
	"bytes"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type TodoCreatedTrigger func(todo Todo)
type TodoCompletedHook func(todo Todo)

var todoCreatedTriggers []TodoCreatedTrigger
var todoCompletedHooks []TodoCompletedHook

func registerTodoCreatedTrigger(trigger TodoCreatedTrigger) {
	todoCreatedTriggers = append(todoCreatedTriggers, trigger)
}

func registerTodoCompletedHook(hook TodoCompletedHook) {
	todoCompletedHooks = append(todoCompletedHooks, hook)
}

func fireTodoCreated(todo Todo) {
	for _, trigger := range todoCreatedTriggers {
		go trigger(todo)
	}
}

func fireTodoCompleted(todo Todo) {
	for _, hook := range todoCompletedHooks {
		go hook(todo)
	}
}

type Todo struct {
	ID          uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description" gorm:"type:text"`
	Completed   bool   `json:"completed" gorm:"default:false"`
}


var db *gorm.DB
var oauthConfig *oauth2.Config

func main() {
	registerTodoCreatedTrigger(func(todo Todo) {
		log.Printf("[TRIGGER] New Todo created: ID=%d, Title=%s", todo.ID, todo.Title)
	})

	registerTodoCompletedHook(func(todo Todo) {
		if todo.Completed {
			webhookURL := os.Getenv("TODO_WEBHOOK_URL")
			if webhookURL != "" {
				payload, _ := json.Marshal(todo)
				http.Post(webhookURL, "application/json", bytes.NewBuffer(payload))
			}
		}
	})
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	db, err = gorm.Open(sqlite.Open("todos.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&Todo{})

	oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  "http://localhost:8080/callback",
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}

	r := mux.NewRouter()

	r.HandleFunc("/todos", getTodos).Methods("GET")
	r.HandleFunc("/todos", createTodo).Methods("POST")
	r.HandleFunc("/todos/{id}", updateTodo).Methods("PUT")
	r.HandleFunc("/todos/{id}", deleteTodo).Methods("DELETE")

	r.HandleFunc("/login", handleLogin).Methods("GET")
	r.HandleFunc("/callback", handleCallback).Methods("GET")

	http.ListenAndServe(":8080", r)
}

func getTodos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var todos []Todo
	result := db.Find(&todos)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(todos)
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	url := oauthConfig.AuthCodeURL("state", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func handleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")
	if state != "state" {
		http.Error(w, "Invalid state", http.StatusBadRequest)
		return
	}
	token, err := oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Failed to exchange code", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(token)
}

func createTodo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var todo Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	result := db.Create(&todo)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	fireTodoCreated(todo)
	json.NewEncoder(w).Encode(todo)
}

func updateTodo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])
	var todo Todo
	if err := db.First(&todo, id).Error; err != nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}
	originalCompleted := todo.Completed
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	todo.ID = uint(id)
	if err := db.Save(&todo).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !originalCompleted && todo.Completed {
		fireTodoCompleted(todo)
	}
	json.NewEncoder(w).Encode(todo)
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])
	var todo Todo
	if err := db.First(&todo, id).Error; err != nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}
	if err := db.Delete(&todo).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"result": "success"})
}