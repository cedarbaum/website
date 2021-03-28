// Code based on https://css-tricks.com/game-life/

function Game(canvas) {

    this.canvas   = canvas;
    this.ctx      = canvas.getContext("2d");
    this.matrix   = undefined;
    this.round    = 0;

    this.cfg = {
        cellSize  : 30,
        gridColor : "black",
        cellColor : "black",
        margin    : 10,
    };

    this.init();
}

Game.prototype = {

    init: function() {
        this.resizeBoardAndRedraw();
    },

    resizeBoardAndRedraw: function() {
        const { width, height } = this.canvas.getBoundingClientRect();
        var numX = Math.ceil(width / this.cfg.cellSize) + this.cfg.margin;
        var numY = Math.ceil(height / this.cfg.cellSize) + this.cfg.margin;

        if (this.matrix == undefined) {
            this.matrix = new Array(numX);
            for (var x = 0; x < this.matrix.length; x++) {
                this.matrix[x] = new Array(numY);
            }

            this.draw();
            return;
        }

        var newMatrix = new Array(numX);
        for (var x = 0; x < newMatrix.length; x++) {
            newMatrix[x] = new Array(numY);
        }

        for (x = 0; x < this.matrix.length; x++) {
            for (y = 0; y < this.matrix[x].length; y++) {
                if (x < newMatrix.length && y < newMatrix[x].length) {
                    newMatrix[x][y] = this.matrix[x][y];
                }
            }
        }

        this.matrix = newMatrix;
        this.draw();
    },

    draw: function() {
        var x, y;

        const { width, height } = this.canvas.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.strokeStyle = this.cfg.gridColor;
        this.ctx.fillStyle = this.cfg.cellColor;

        // Draw a grid
        // for (x = 0; x < width; x += this.cfg.cellSize) {
        //     this.ctx.moveTo(x, 0);
        //     this.ctx.lineTo(x, height);
        // }

        // for (y = 0; y < height; y += this.cfg.cellSize) {
        //     this.ctx.moveTo(0, y);
        //     this.ctx.lineTo(width, y);
        // }

        this.ctx.stroke();

        if (this.matrix == undefined) {
            return;
        }

        for (x = 0; x < this.matrix.length; x++) {
            for (y = 0; y < this.matrix[x].length; y++) {
                if (this.matrix[x][y]) {
                    this.ctx.fillRect(x * this.cfg.cellSize + 1,
                                      y * this.cfg.cellSize + 1,
                                      this.cfg.cellSize - 1,
                                      this.cfg.cellSize - 1);
                }
            }
        }
    },

    step: function() {
        // initalize buffer
        var x, y;
        var buffer = new Array(this.matrix.length);
        for (x = 0; x < buffer.length; x++) {
            buffer[x] = new Array(this.matrix[x].length);
        }

        // calculate one step
        for (x = 0; x < this.matrix.length; x++) {
            for (y = 0; y < this.matrix[x].length; y++) {
                // count neighbours
                var neighbours = this.countNeighbours(x, y);

                // use rules
                if (this.matrix[x][y]) {
                    if (neighbours == 2 || neighbours == 3)
                        buffer[x][y] = true;
                    if (neighbours < 2 || neighbours > 3)
                        buffer[x][y] = false;
                } else {
                    if (neighbours == 3)
                        buffer[x][y] = true;
                }
            }
        }

        // flip buffers
        this.matrix = buffer;
        this.round++;
        this.draw();
    },

    countNeighbours: function(cx, cy) {
        var count = 0;

        for (var x = cx-1; x <= cx+1; x++) {
            for (var y = cy-1; y <= cy+1; y++) {
                if (x == cx && y == cy)
                    continue;
                if (x < 0 || x >= this.matrix.length || y < 0 || y >= this.matrix[x].length)
                    continue;
                if (this.matrix[x][y])
                    count++;
            }
        }

        return count;
    },

    clear: function() {
        for (var x = 0; x < this.matrix.length; x++) {
            for (var y = 0; y < this.matrix[x].length; y++) {
                this.matrix[x][y] = false;
            }
        }

        this.draw();
    },

    randomize: function() {
        for (var x = 0; x < this.matrix.length; x++) {
            for (var y = 0; y < this.matrix[x].length; y++) {
                this.matrix[x][y] = Math.random() < 0.2;
            }
        }

        this.draw();
    },

    toggleCell: function(cx, cy) {
        if (cx >= 0 && cx < this.matrix.length && cy >= 0 && cy < this.matrix[0].length) {
            this.matrix[cx][cy] = !this.matrix[cx][cy];
            this.draw();
        }
    }
};

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
