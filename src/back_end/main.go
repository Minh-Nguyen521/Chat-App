package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// WebSocket upgrader
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Message struct represents the message sent from the frontend
type Message struct {
	UserID  string `json:"user_id"`
	Content string `json:"content"`
}

var conns []*websocket.Conn

// WebSocket handler
func websocketEndpoint(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	} // to allow connection from any origin

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("error roi", err)
	}

	conns = append(conns, ws)
	// log.Println(len(conns))

	// Infinite loop checking for message
	for {
		// Read message from browser
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		for _, conn := range conns {
			if conn != ws {
				var NewMessage Message
				if err = json.Unmarshal(msg, &NewMessage); err != nil {
					log.Println("error", err)
					return
				}

				message := fmt.Sprint(string(NewMessage.UserID), " sent: ", string(NewMessage.Content))
				conn.WriteMessage(websocket.TextMessage, []byte(message))
			}
		}
		// Print the message to the console
		log.Printf("%s\n", msg)

		// Write message back to browser
		// if err = ws.WriteMessage(websocket.TextMessage, msg); err != nil {
		// 	log.Println(err)
		// 	return
		// }
	}
}

func setupRoutes() {
	http.HandleFunc("/ws", websocketEndpoint)
}

func main() {
	fmt.Println("Go WebSockets")
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8080", nil))
}
