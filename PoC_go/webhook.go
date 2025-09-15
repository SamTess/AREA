package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/webhook", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		fmt.Println("[WEBHOOK RECEIVED]:", string(body))
		w.WriteHeader(http.StatusOK)
	})
	log.Println("Webhook server listening on :9000/webhook")
	http.ListenAndServe(":9000", nil)
}
