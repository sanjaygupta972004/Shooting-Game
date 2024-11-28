// Importing sound effects
const shootingsong = new Audio("./Music/shooting.mp3");
const killenemy = new Audio("./Music/killEnemy.mp3");
const gameover = new Audio("./Music/gameOver.mp3");
const hugeweapon = new Audio("./Music/hugeWeapon.mp3");
const heavyweapon = new Audio("./Music/heavyWeapon.mp3");

// Basic Environment Setup
const canvas = document.createElement("canvas");
document.querySelector(".MyGame").appendChild(canvas);
canvas.height = innerHeight;
canvas.width = innerWidth;
const context = canvas.getContext("2d");

// Game Variables
let difficulty = 2;
const lightdamage = 10;
const heavydamage = 25;
let playerscore = 0;
const form = document.querySelector("form");
const scoreboard = document.querySelector(".scoreboard");

document.querySelector(".play-key").addEventListener("click", (e) => {
  e.preventDefault();
  form.style.display = "none";
  scoreboard.style.display = "block";
  const uservalue = document.getElementById("difficulty").value;
  if (uservalue === "Easy") {
    setInterval(SpameEnemy, 2000);
    difficulty = 3;
  } else if (uservalue === "Medium") {
    setInterval(SpameEnemy, 1500);
    difficulty = 5;
  } else if (uservalue === "Hard") {
    setInterval(SpameEnemy, 1200);
    difficulty = 7;
  } else if (uservalue === "Insane") {
    setInterval(SpameEnemy, 1000);
    difficulty = 9;
  }
});

// End Screen Logic
const gameoverloader = () => {
  const gameoverBanner = document.createElement("div");
  const gameoverButton = document.createElement("button");
  const highscore = document.createElement("div");

  const oldHighScore = localStorage.getItem("highscore") || 0;
  const newHighScore = Math.max(oldHighScore, playerscore);
  localStorage.setItem("highscore", newHighScore);

  highscore.innerHTML = `High Score: ${newHighScore}`;
  gameoverButton.innerHTML = "Play Again";
  gameoverButton.onclick = () => window.location.reload();

  gameoverBanner.appendChild(highscore);
  gameoverBanner.appendChild(gameoverButton);
  gameoverBanner.classList.add("Game-Over");
  document.querySelector("body").appendChild(gameoverBanner);
};

// Player Position
const playerposition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

// Classes
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }
}

class Weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// Particle Class for Effects
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

// Arrays
const weapons = [];
const enemies = [];
const particles = [];

// Spawn Enemies
const SpameEnemy = () => {
  const radius = Math.random() * (40 - 10) + 10;
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  let x, y;
  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    y = Math.random() * canvas.height;
  } else {
    x = Math.random() * canvas.width;
    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
  }
  const angle = Math.atan2(playerposition.y - y, playerposition.x - x);
  const velocity = {
    x: Math.cos(angle) * difficulty,
    y: Math.sin(angle) * difficulty,
  };
  enemies.push(new Enemy(x, y, radius, color, velocity));
};

// Event Listeners
canvas.addEventListener("click", (e) => {
  shootingsong.play();
  const angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
  const velocity = {
    x: Math.cos(angle) * difficulty,
    y: Math.sin(angle) * difficulty,
  };
  weapons.push(new Weapon(canvas.width / 2, canvas.height / 2, 6, "white", velocity, lightdamage));
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

// Animation Function
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  context.fillStyle = "rgba(45, 45, 45, 0.3)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  player1.draw();

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  weapons.forEach((weapon, weaponIndex) => {
    weapon.update();

    // Remove weapons that move out of bounds
    if (
      weapon.x + weapon.radius < 0 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y + weapon.radius < 0 ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    // Collision with Player
    const distToPlayer = Math.hypot(playerposition.x - enemy.x, playerposition.y - enemy.y);
    if (distToPlayer - enemy.radius - player1.radius < 1) {
      cancelAnimationFrame(animationId);
      gameover.play();
      gameoverloader();
    }

    // Collision with Weapons
    weapons.forEach((weapon, weaponIndex) => {
      const distToWeapon = Math.hypot(weapon.x - enemy.x, weapon.y - enemy.y);
      if (distToWeapon - enemy.radius - weapon.radius < 1) {
        // Increase Score
        playerscore += 10;
        scoreboard.innerHTML = `Score: ${playerscore}`;
        killenemy.play();

        // Remove Enemy and Weapon
        setTimeout(() => {
          enemies.splice(enemyIndex, 1);
          weapons.splice(weaponIndex, 1);
        }, 0);
      }
    });
  });
}

// Initialize Game
const player1 = new Player(playerposition.x, playerposition.y, 18, "red");
animate();
