// 🌎 Version Node.js avec interface HTML5 Canvas avec grille visible

const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

// Ajustement du canvas pour ne contenir qu'un seul rectangle avec la grille
canvas.width = 10 * 20; // largeur * échelle
canvas.height = 20 * 20; // hauteur * échelle
context.scale(20, 20);

const colors = [
  null,
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9844a",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
];

const figures = [
  [[1, 5, 9, 13], [4, 5, 6, 7]],
  [[4, 5, 9, 10], [2, 6, 5, 9]],
  [[6, 7, 9, 10], [1, 5, 6, 10]],
  [[1, 2, 5, 9], [0, 4, 5, 6], [1, 5, 9, 8], [4, 5, 6, 10]],
  [[1, 2, 6, 10], [5, 6, 7, 9], [2, 6, 10, 11], [3, 5, 6, 7]],
  [[1, 4, 5, 6], [1, 4, 5, 9], [4, 5, 6, 9], [1, 5, 6, 9]],
  [[1, 2, 5, 6]],
];

class Figure {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = Math.floor(Math.random() * figures.length);
    this.color = Math.floor(Math.random() * (colors.length - 1)) + 1;
    this.rotation = 0;
  }

  image() {
    return figures[this.type][this.rotation];
  }

  rotate() {
    this.rotation = (this.rotation + 1) % figures[this.type].length;
  }
}

class Tetris {
  constructor(height, width) {
    this.level = 2;
    this.score = 0;
    this.state = "start";
    this.height = height;
    this.width = width;
    this.x = 5;
    this.y = 3;
    this.zoom = 1;
    this.figure = null;
    this.field = Array.from({ length: height }, () => Array(width).fill(0));
  }

  newFigure() {
    this.figure = new Figure(3, 0);
  }

  intersects() {
    const fig = this.figure.image();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (fig.includes(i * 4 + j)) {
          const x = j + this.figure.x;
          const y = i + this.figure.y;
          if (
            x < 0 || x >= this.width ||
            y >= this.height ||
            (y >= 0 && this.field[y][x])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  freeze() {
    const fig = this.figure.image();
    fig.forEach(p => {
      const i = Math.floor(p / 4);
      const j = p % 4;
      const x = j + this.figure.x;
      const y = i + this.figure.y;
      if (y >= 0) {
        this.field[y][x] = this.figure.color;
      }
    });
    this.breakLines();
    this.newFigure();
    if (this.intersects()) {
      this.state = "gameover";
    }
  }

  goDown() {
    this.figure.y++;
    if (this.intersects()) {
      this.figure.y--;
      this.freeze();
    }
  }

  goSide(dx) {
    this.figure.x += dx;
    if (this.intersects()) {
      this.figure.x -= dx;
    }
  }

  rotate() {
    const oldRotation = this.figure.rotation;
    this.figure.rotate();
    if (this.intersects()) {
      this.figure.rotation = oldRotation;
    }
  }

  breakLines() {
    let lines = 0;
    outer: for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        if (this.field[y][x] === 0) continue outer;
      }
      const row = this.field.splice(y, 1)[0].fill(0);
      this.field.unshift(row);
      lines++;
    }
    this.score += lines ** 2;
  }
}

let game = new Tetris(20, 10);
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let pressingDown = false;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval || pressingDown) {
    if (game.state === "start") {
      game.goDown();
    }
    dropCounter = 0;
  }
  draw();
  requestAnimationFrame(update);
}

function draw() {
  context.fillStyle = "#1e1e2f";
  context.fillRect(0, 0, canvas.width / 20, canvas.height / 20);

  // Dessiner la grille complète sur une seule zone
  context.strokeStyle = "#444";
  context.lineWidth = 0.03;
  for (let y = 0; y < game.height; y++) {
    for (let x = 0; x < game.width; x++) {
      context.strokeRect(x, y, 1, 1);
    }
  }

  // Dessiner les blocs figés
  for (let y = 0; y < game.height; y++) {
    for (let x = 0; x < game.width; x++) {
      if (game.field[y][x]) {
        context.fillStyle = colors[game.field[y][x]];
        context.fillRect(x, y, 1, 1);
        context.strokeStyle = "#111";
        context.lineWidth = 0.05;
        context.strokeRect(x, y, 1, 1);
      }
    }
  }

  // Dessiner la figure active
  if (game.figure) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (game.figure.image().includes(i * 4 + j)) {
          const x = game.figure.x + j;
          const y = game.figure.y + i;
          context.fillStyle = colors[game.figure.color];
          context.fillRect(x, y, 1, 1);
          context.strokeStyle = "#000";
          context.lineWidth = 0.05;
          context.strokeRect(x, y, 1, 1);
        }
      }
    }
  }

  if (game.state === "gameover") {
    context.fillStyle = "rgba(0,0,0,0.75)";
    context.fillRect(1, 8, 8, 4);
    context.fillStyle = "#fff";
    context.font = "1px Arial";
    context.fillText("GAME OVER", 2.5, 10);
    context.font = "0.5px Arial";
    context.fillText("Press ESC to Restart", 2.5, 11);
  }
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") game.goSide(-1);
  else if (event.key === "ArrowRight") game.goSide(1);
  else if (event.key === "ArrowDown") pressingDown = true;
  else if (event.key === "ArrowUp") game.rotate();
  else if (event.key === "Escape") game = new Tetris(20, 10);
});

document.addEventListener("keyup", event => {
  if (event.key === "ArrowDown") pressingDown = false;
});

game.newFigure();
update();
 