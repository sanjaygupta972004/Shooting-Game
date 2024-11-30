package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
)

const (
	LightDamage = 10
	HeavyDamage = 25
)

type Player struct {
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	Radius float64 `json:"radius"`
	Color  string  `json:"color"`
}

type Enemy struct {
	X         float64 `json:"x"`
	Y         float64 `json:"y"`
	Radius    float64 `json:"radius"`
	Color     string  `json:"color"`
	VelocityX float64 `json:"velocityX"`
	VelocityY float64 `json:"velocityY"`
}

type GameState struct {
	Player     Player  `json:"player"`
	Enemies    []Enemy `json:"enemies"`
	Score      int     `json:"score"`
	Difficulty int     `json:"difficulty"`
}

var (
	upgrader  = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}
	clients   = make(map[*websocket.Conn]bool)
	broadcast = make(chan GameState)
	mutex     = sync.Mutex{}
	gameState = GameState{}
)

func main() {

	gameState = GameState{
		Player: Player{X: 400, Y: 300, Radius: 18, Color: "red"},
		Enemies: []Enemy{
			{X: 200, Y: 150, Radius: 20, Color: "green", VelocityX: 1.5, VelocityY: 1.0},
		},
		Score:      0,
		Difficulty: 2,
	}

	http.Handle("/", http.FileServer(http.Dir("static")))
	//http.HandleFunc("/ws", handleConnections)

	go handleBroadcast()

	log.Println("Server starting on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}
	defer ws.Close()

	mutex.Lock()
	clients[ws] = true
	mutex.Unlock()

	for {

		var updatedState GameState
		err := ws.ReadJSON(&updatedState)
		if err != nil {
			log.Println("Error reading JSON:", err)
			mutex.Lock()
			delete(clients, ws)
			mutex.Unlock()
			break
		}

		mutex.Lock()
		gameState = updatedState
		mutex.Unlock()
		broadcast <- gameState
	}
}

func handleBroadcast() {
	for {
		state := <-broadcast
		mutex.Lock()
		for client := range clients {
			err := client.WriteJSON(state)
			if err != nil {
				log.Println("Error writing JSON:", err)
				client.Close()
				delete(clients, client)
			}
		}
		mutex.Unlock()
	}
}
