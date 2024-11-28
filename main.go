package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

// Game constants
const (
	LightDamage = 10
	HeavyDamage = 25
)

// Player represents the game player
type Player struct {
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	Radius float64 `json:"radius"`
	Color  string  `json:"color"`
}

// GameState represents the current state of the game
type GameState struct {
	Player     Player   `json:"player"`
	Enemies    []Enemy  `json:"enemies"`
	Weapons    []Weapon `json:"weapons"`
	Score      int      `json:"score"`
	Difficulty int      `json:"difficulty"`
}

// Enemy represents game enemies
type Enemy struct {
	X         float64 `json:"x"`
	Y         float64 `json:"y"`
	Radius    float64 `json:"radius"`
	Color     string  `json:"color"`
	VelocityX float64 `json:"velocityX"`
	VelocityY float64 `json:"velocityY"`
}

// Weapon represents player weapons
type Weapon struct {
	X         float64 `json:"x"`
	Y         float64 `json:"y"`
	Radius    float64 `json:"radius"`
	Color     string  `json:"color"`
	VelocityX float64 `json:"velocityX"`
	VelocityY float64 `json:"velocityY"`
	Damage    int     `json:"damage"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections in development
	},
}

func main() {
	// Serve static files
	http.Handle("/", http.FileServer(http.Dir("static")))

	// WebSocket endpoint
	http.HandleFunc("/ws", handleConnections)

	log.Println("Server starting on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
		return
	}
	defer ws.Close()

	// Initialize game state
	gameState := GameState{
		Player: Player{
			X:      400,
			Y:      300,
			Radius: 18,
			Color:  "red",
		},
		Difficulty: 2,
		Score:      0,
	}

	// Game loop
	for {
		// Read message from browser
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}

		// Update game state based on message
		// For now, just log the received message
		log.Printf("Received message: %s", message)

		// Send updated game state back to client
		err = ws.WriteJSON(gameState)
		if err != nil {
			log.Println("Error writing message:", err)
			break
		}
	}
}
