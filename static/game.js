
const socket = new WebSocket("https://space-shoot-production.up.railway.app/ws");


let gameState = {
  player: { x: canvas.width / 2, y: canvas.height / 2, radius: 18, color: "red" },
  enemies: [],
  score: 0,
  difficulty: 2,
};

0
socket.onmessage = (event) => {
  const updatedState = JSON.parse(event.data);
  gameState = updatedState;
  updateGameWithServerData();
};


const sendGameState = () => {
  socket.send(JSON.stringify(gameState));
};

const updateGameWithServerData = () => {

  context.clearRect(0, 0, canvas.width, canvas.height);


  const player = gameState.player;
  context.beginPath();
  context.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);
  context.fillStyle = player.color;
  context.fill();

  // Draw enemies
  gameState.enemies.forEach((enemy) => {
    context.beginPath();
    context.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2, false);
    context.fillStyle = enemy.color;
    context.fill();
  });

 
  scoreboard.innerHTML = `Score: ${gameState.score}`;
};

addEventListener("keydown", (event) => {
  const step = 10;
  if (event.key === "ArrowUp") gameState.player.y -= step;
  if (event.key === "ArrowDown") gameState.player.y += step;
  if (event.key === "ArrowLeft") gameState.player.x -= step;
  if (event.key === "ArrowRight") gameState.player.x += step;

  sendGameState();
});


const spawnEnemy = () => {
  const radius = Math.random() * (40 - 10) + 10;
  const x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
  const y = Math.random() * canvas.height;
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  const angle = Math.atan2(gameState.player.y - y, gameState.player.x - x);
  const velocity = { x: Math.cos(angle) * gameState.difficulty, y: Math.sin(angle) * gameState.difficulty };

  gameState.enemies.push({ x, y, radius, color, velocityX: velocity.x, velocityY: velocity.y });
  sendGameState();
};

// Set interval for spawning enemies
setInterval(spawnEnemy, 2000);

// Initialize Game
function animate() {
  requestAnimationFrame(animate);
  updateGameWithServerData();
}
animate();
