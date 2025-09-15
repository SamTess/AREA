package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"log"
	"bytes"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/crypto/bcrypt"
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
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description" gorm:"type:text"`
	Completed   bool      `json:"completed" gorm:"default:false"`
	Due         time.Time `json:"due" gorm:"type:datetime"`
}

type User struct {
	ID       uint   `gorm:"primaryKey;autoIncrement"`
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
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
	db.AutoMigrate(&User{})

	oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  "http://localhost:8080/callback",
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}

	r := mux.NewRouter()

	r.HandleFunc("/todos", authRequired(getTodos)).Methods("GET")
	r.HandleFunc("/todos", authRequired(createTodo)).Methods("POST")
	r.HandleFunc("/todos/{id}", authRequired(updateTodo)).Methods("PATCH")
	r.HandleFunc("/todos/{id}", authRequired(deleteTodo)).Methods("DELETE")

	r.HandleFunc("/login", handleLogin).Methods("GET")
	r.HandleFunc("/callback", handleCallback).Methods("GET")

	r.HandleFunc("/register", registerUser).Methods("POST")
	r.HandleFunc("/login", loginUser).Methods("POST")

	r.HandleFunc("/about.json", authRequired(getAbout)).Methods("GET")
	r.HandleFunc("/health", getHealth).Methods("GET")

	http.ListenAndServe(":8080", r)
}

func getTodos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	page := 1
	limit := 10
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	offset := (page - 1) * limit
	var todos []Todo
	var total int64
	db.Model(&Todo{}).Count(&total)
	result := db.Limit(limit).Offset(offset).Find(&todos)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	response := map[string]interface{}{
		"data": todos,
		"pagination": map[string]interface{}{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	}
	json.NewEncoder(w).Encode(response)
}

func getAbout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	host := r.Host
	currentTime := time.Now().Format(time.RFC3339)
	services := []map[string]interface{}{
		{
			"name":      "todo",
			"actions":   []string{"create_todo"},
			"reactions": []string{"send_webhook"},
		},
	}
	response := map[string]interface{}{
		"client": map[string]string{"host": host},
		"server": map[string]string{"current_time": currentTime},
		"services": services,
	}
	json.NewEncoder(w).Encode(response)
}

func getHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"status":  "ok",
		"version": "1.0.0",
	}
	json.NewEncoder(w).Encode(response)
}

func registerUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if len(req.Password) < 8 {
		http.Error(w, "Password must be at least 8 characters", http.StatusBadRequest)
		return
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	user := User{Username: req.Username, Password: string(hashed)}
	if err := db.Create(&user).Error; err != nil {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created"})
}

func loginUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var user User
	if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "user_id",
		Value:    strconv.Itoa(int(user.ID)),
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})
	json.NewEncoder(w).Encode(map[string]string{"message": "Logged in"})
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
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    token.AccessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})
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
	json.NewEncoder(w).Encode(map[string]string{"message": "Todo deleted"})
}

func authRequired(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err1 := r.Cookie("access_token")
		_, err2 := r.Cookie("user_id")
		if err1 != nil && err2 != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		handler(w, r)
	}
}