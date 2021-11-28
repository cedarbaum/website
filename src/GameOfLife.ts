/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Code based on https://css-tricks.com/game-life/

interface Cfg {
    cellSize: number,
    gridColor: string,
    cellColor: string,
    margin: number
}

export class GameOfLife {
  private firstSpawn = true;
  private initialized = false;
  private nextFrameTime: number | undefined = undefined;
  private nextGliderSpawnTime: number | undefined = undefined;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private round: number;
  private matrix: Array<Array<number | boolean>> | undefined;
  private cfg: Cfg;

  constructor() {
    this.matrix = undefined;
    this.round = 0;

    this.cfg = {
      cellSize: 30,
      gridColor: "black",
      cellColor: "black",
      margin: 10,
    };
  }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.initialized = true;

    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    this.nextGliderSpawnTime = secondsSinceEpoch + 2;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  resizeBoardAndRedraw(): void {
    const { width, height } = this.canvas!.getBoundingClientRect();
    const numX = Math.ceil(width / this.cfg.cellSize) + 2 * this.cfg.margin;
    const numY = Math.ceil(height / this.cfg.cellSize) + 2 * this.cfg.margin;

    if (this.matrix == undefined) {
      this.matrix = new Array(numX);
      // eslint-disable-next-line no-var
      for (var x = 0; x < this.matrix.length; x++) {
        this.matrix[x] = new Array(numY);
      }

      this.draw();
      return;
    }

    const newMatrix = new Array(numX);
    // eslint-disable-next-line no-var
    for (var x = 0; x < newMatrix.length; x++) {
      newMatrix[x] = new Array(numY);
    }

    // eslint-disable-next-line no-var
    for (var x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[x].length; y++) {
        if (x < newMatrix.length && y < newMatrix[x].length) {
          newMatrix[x][y] = this.matrix![x][y];
        }
      }
    }

    this.matrix = newMatrix;
    this.draw();
  }

  draw(): void {
    let x, y;

    const { width, height } = this.canvas!.getBoundingClientRect();
    this.canvas!.width = width;
    this.canvas!.height = height;
    this.ctx!.strokeStyle = this.cfg.gridColor;
    this.ctx!.fillStyle = this.cfg.cellColor;

    // Draw a grid
    // for (x = 0; x < width; x += this.cfg.cellSize) {
    //     this.ctx.moveTo(x, 0);
    //     this.ctx.lineTo(x, height);
    // }

    // for (y = 0; y < height; y += this.cfg.cellSize) {
    //     this.ctx.moveTo(0, y);
    //     this.ctx.lineTo(width, y);
    // }

    this.ctx!.stroke();

    if (this.matrix == undefined) {
      return;
    }

    for (x = this.cfg.margin; x < this.matrix.length; x++) {
      for (y = this.cfg.margin; y < this.matrix[x].length; y++) {
        if (this.matrix[x][y]) {
          const adjX = x - this.cfg.margin;
          const adjY = y - this.cfg.margin;
          this.ctx!.fillRect(
            adjX * this.cfg.cellSize + 1,
            adjY * this.cfg.cellSize + 1,
            this.cfg.cellSize - 1,
            this.cfg.cellSize - 1
          );
        }
      }
    }
  }

  step(): void {
    // initalize buffer
    let x, y;
    const buffer = new Array(this.matrix!.length);
    for (x = 0; x < buffer.length; x++) {
      buffer[x] = new Array(this.matrix![x].length);
    }

    // calculate one step
    for (x = 0; x < this.matrix!.length; x++) {
      for (y = 0; y < this.matrix![x].length; y++) {
        // count neighbours
        const neighbours = this.countNeighbours(x, y);

        // use rules
        if (this.matrix![x][y]) {
          if (neighbours == 2 || neighbours == 3) buffer[x][y] = true;
          if (neighbours < 2 || neighbours > 3) buffer[x][y] = false;
        } else {
          if (neighbours == 3) buffer[x][y] = true;
        }
      }
    }

    // flip buffers
    this.matrix = buffer;
    this.round++;
    this.draw();
  }

  countNeighbours(cx: number, cy: number): number {
    let count = 0;

    for (let x = cx - 1; x <= cx + 1; x++) {
      for (let y = cy - 1; y <= cy + 1; y++) {
        if (x == cx && y == cy) continue;
        if (
          x < 0 ||
          x >= this.matrix!.length ||
          y < 0 ||
          y >= this.matrix![x].length
        )
          continue;
        if (this.matrix![x][y]) count++;
      }
    }

    return count;
  }

  clear(): void {
    for (let x = 0; x < this.matrix!.length; x++) {
      for (let y = 0; y < this.matrix![x].length; y++) {
        this.matrix![x][y] = false;
      }
    }

    this.draw();
  }

  randomize(): void {
    for (let x = 0; x < this.matrix!.length; x++) {
      for (let y = 0; y < this.matrix![x].length; y++) {
        this.matrix![x][y] = Math.random() < 0.2;
      }
    }

    this.draw();
  }

  spawnRandGlider(): void {
    const spawnLoc = GameOfLife.getRandomInt(0, 3);
    const widthViewport = this.matrix!.length - 2 * this.cfg.margin;
    const heightViewport = this.matrix![0].length - 2 * this.cfg.margin;
    const bottomRow = this.cfg.margin + heightViewport;
    const rightMostCol = this.cfg.margin + widthViewport;

    if (this.firstSpawn) {
      const x = Math.ceil(this.cfg.margin - 3);
      const y = Math.ceil(this.cfg.margin + heightViewport / 2);
      this.drawURGlider(x, y);

      this.firstSpawn = false;
      return;
    }

    if (spawnLoc == 0) {
      // Top
      const xCenter = GameOfLife.getRandomInt(
        this.cfg.margin,
        this.matrix!.length - 3
      );
      const yCenter = GameOfLife.getRandomInt(3, this.cfg.margin - 3);

      this.drawLRGlider(xCenter, yCenter);
    } else if (spawnLoc == 1) {
      // Left
      const xCenter = GameOfLife.getRandomInt(3, this.cfg.margin - 3);
      const yCenter = GameOfLife.getRandomInt(
        this.cfg.margin,
        this.matrix![0].length - 3
      );

      this.drawURGlider(xCenter, yCenter);
    } else if (spawnLoc == 2) {
      // Bottom
      const xCenter = GameOfLife.getRandomInt(
        this.cfg.margin,
        this.matrix!.length - 3
      );
      const yCenter = GameOfLife.getRandomInt(
        bottomRow,
        bottomRow + this.cfg.margin - 3
      );

      this.drawULGlider(xCenter, yCenter);
    } else {
      // Right
      const xCenter = GameOfLife.getRandomInt(
        rightMostCol,
        rightMostCol + this.cfg.margin - 3
      );
      const yCenter = GameOfLife.getRandomInt(
        this.cfg.margin,
        this.matrix![0].length - 3
      );

      this.drawLLGlider(xCenter, yCenter);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  drawLRGlider(xCenter: number, yCenter: number) {
    this.matrix![xCenter][yCenter] = false;
    this.matrix![xCenter - 1][yCenter - 1] = false;
    this.matrix![xCenter - 1][yCenter] = false;
    this.matrix![xCenter + 1][yCenter - 1] = false;

    this.matrix![xCenter][yCenter - 1] = true;
    this.matrix![xCenter + 1][yCenter] = true;
    this.matrix![xCenter - 1][yCenter + 1] = true;
    this.matrix![xCenter][yCenter + 1] = true;
    this.matrix![xCenter + 1][yCenter + 1] = true;
  }

  drawURGlider(xCenter: number, yCenter: number): void {
    this.matrix![xCenter][yCenter] = false;
    this.matrix![xCenter - 1][yCenter] = false;
    this.matrix![xCenter - 1][yCenter + 1] = false;
    this.matrix![xCenter + 1][yCenter + 1] = false;

    this.matrix![xCenter - 1][yCenter - 1] = true;
    this.matrix![xCenter][yCenter - 1] = true;
    this.matrix![xCenter + 1][yCenter - 1] = true;
    this.matrix![xCenter + 1][yCenter] = true;
    this.matrix![xCenter][yCenter + 1] = true;
  }

  drawULGlider(xCenter: number, yCenter: number): void {
    this.matrix![xCenter][yCenter] = false;
    this.matrix![xCenter + 1][yCenter] = false;
    this.matrix![xCenter - 1][yCenter + 1] = false;
    this.matrix![xCenter + 1][yCenter + 1] = false;

    this.matrix![xCenter - 1][yCenter - 1] = true;
    this.matrix![xCenter][yCenter - 1] = true;
    this.matrix![xCenter + 1][yCenter - 1] = true;
    this.matrix![xCenter - 1][yCenter] = true;
    this.matrix![xCenter][yCenter + 1] = true;
  }

  drawLLGlider(xCenter: number, yCenter: number): void {
    this.matrix![xCenter][yCenter - 1] = false;
    this.matrix![xCenter + 1][yCenter - 1] = false;
    this.matrix![xCenter][yCenter] = false;
    this.matrix![xCenter + 1][yCenter + 1] = false;

    this.matrix![xCenter - 1][yCenter - 1] = true;
    this.matrix![xCenter - 1][yCenter] = true;
    this.matrix![xCenter + 1][yCenter] = true;
    this.matrix![xCenter - 1][yCenter + 1] = true;
    this.matrix![xCenter][yCenter + 1] = true;
  }

  toggleCell(cx: number, cy: number): void {
    cx += this.cfg.margin;
    cy += this.cfg.margin;
    if (
      cx >= 0 &&
      cx < this.matrix!.length &&
      cy >= 0 &&
      cy < this.matrix![0].length
    ) {
      this.matrix![cx][cy] = !this.matrix![cx][cy];
      this.draw();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  animateStep() {
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    if (
      this.nextFrameTime != undefined &&
      secondsSinceEpoch < this.nextFrameTime
    ) {
      return;
    }

    if (secondsSinceEpoch >= this.nextGliderSpawnTime!) {
      this.spawnRandGlider();
      this.nextGliderSpawnTime = secondsSinceEpoch + 5;
    }

    this.step();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  gameOnClick(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    let x;
    let y;

    if (e.pageX !== undefined && e.pageY !== undefined) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      y =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    x -= this.canvas!.offsetLeft;
    y -= this.canvas!.offsetTop;

    x = Math.floor(x / this.cfg.cellSize);
    y = Math.floor(y / this.cfg.cellSize);

    this.toggleCell(x, y);

    // Give user 2 seconds to toggle additional cells
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    this.nextFrameTime = secondsSinceEpoch + 2;
  }

  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}


/*
var timer;
var game = new Game(document.getElementById("game"));
var nextFrameTime;

function animate() {
    if (timer === undefined) {
        timer = setInterval(animateStep, 500);
    } else {
        clearInterval(timer);
        timer = undefined;
    }
};

function animateStep() {

    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    if (nextFrameTime != undefined && secondsSinceEpoch < nextFrameTime) {
        return;
    }

    game.step();
}

game.canvas.addEventListener("click", gameOnClick, false);
window.addEventListener('resize', windowResize);

function windowResize() {
    game.resizeBoardAndRedraw();
}

function gameOnClick(e) {
    var x;
    var y;

    if (e.pageX !== undefined && e.pageY !== undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= game.canvas.offsetLeft;
    y -= game.canvas.offsetTop;

    x = Math.floor(x / game.cfg.cellSize);
    y = Math.floor(y / game.cfg.cellSize);

    game.toggleCell(x, y);

    // Give user 2 seconds to toggle additional cells
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    nextFrameTime = secondsSinceEpoch + 2;
}


game.randomize();
animate();
*/