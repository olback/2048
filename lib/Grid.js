class Grid {

    constructor(size) {

        if (!size) size = 4;

        let arr = new Array(size);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(size).fill(0);
        }

        this.grid = arr;
        this.length = this.grid.length;
        this.winAt = 2048;
        this.score = 0;
        this.flipped = false;
        this.rotated = false;
    }

    addNum() {
        let options = [];
        this.looper((x, y) => {
            if (this.grid[x][y] === 0) {
                options.push({
                    x: x,
                    y: y
                });
            }
        });

        if (options.length > 0) {
            let spot = options[Math.floor(Math.random() * options.length)];
            let r = Math.random();
            this.grid[spot.x][spot.y] = r < 0.9 ? 2 : 4;
        }
    }

    flipGrid() {
        for (let i = 0; i < this.length; i++) {
            this.grid[i].reverse();
        }
        return this.grid;
    }

    rotateGrid() {
        let newGrid = Grid.newArr(this.length);
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this.length; j++) {
                newGrid[i][j] = this.grid[j][i];
            }
        }
        this.grid = newGrid;
        return newGrid;
    }

    slide(row) {
        let arr = row.filter(val => val);
        let missing = this.length - arr.length;
        let zeros = Array(missing).fill(0);
        arr = zeros.concat(arr);
        return arr;
    }

    combine(row) {
        for (let i = row.length - 1; i >= 1; i--) {
            let a = row[i];
            let b = row[i - 1];
            if (a == b) {
                row[i] = a + b;
                this.score += row[i];
                row[i - 1] = 0;
            }
        }
        return row;
    }

    operate(row) {
        row = this.slide(row);
        row = this.combine(row);
        row = this.slide(row);
        return row;
    }

    makeMove(dir) {

        switch (dir) {

            case 'up': {
                this.flipGrid();
                this.flipped = true;
                break;
            }

            case 'down': {
                // Nothing to do here!
                break;
            }

            case 'left': {
                this.rotateGrid();
                this.flipGrid();
                this.rotated = true;
                this.flipped = true;
                break;
            }

            case 'right': {
                this.rotateGrid();
                this.rotated = true;
                break;
            }

            default: {
                throw new Error(`${dir} not a valid direction`)
            }

        } // switch

        let past = Grid.copyGrid(this.grid);
        for (let i = 0; i < this.length; i++) {
            this.grid[i] = this.operate(this.grid[i]);
        }

        let moved = Grid.compare(past, this.grid);

        // If the grid was flipped, flip it back
        if (this.flipped) {
            this.flipGrid();
            this.flipped = false;
        }

        // If the grid was rotated, rotate it back to the original orientation
        if (this.rotated) {
            this.rotateGrid();
            this.rotateGrid();
            this.rotateGrid();
            this.rotated = false;
        }

        // If something moved on the grid, add a new number to an empty tile
        if (moved) {
            this.addNum();
        }

        return Grid.clone(this);

    }

    draw() {
        this.looper((x, y) => {
            fill(255);
            rect(x * (width / this.length), y * (height / this.length), width / this.length, height / this.length);
            textAlign(CENTER, CENTER);
            let val = String(this.grid[x][y]);
            if (val !== '0') {
                let len = val.length;
                fill(0);
                let fs = ((width / this.length) / len) * 0.9;
                if (len > 1) fs = fs * 1.5;
                textSize(fs);
                text(val, x * (width / this.length) + ((width / this.length) / 2), y * (height / this.length) + ((height / this.length) / 2));
            }
        });
    }

    // Can't use the looper here since it doesn't return anything
    failed() {
        for (let x = 0; x < this.length; x++) {
            for (let y = 0; y < this.length; y++) {
                if (this.grid[x][y] == 0) {
                    return false;
                }
                if (x !== this.grid.length - 1 && this.grid[x][y] === this.grid[x + 1][y]) {
                    return false;
                }
                if (y !== this.grid.length - 1 && this.grid[x][y] === this.grid[x][y + 1]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Can't use looper here either since we want a return
    success() {
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this.length; j++) {
                if (this.grid[i][j] == this.winAt) {
                    return true;
                }
            }
        }
        return false;
    }

    restart(size) {
        this.grid = Grid.newArr(size);
        this.length = this.grid.length;
        this.score = 0;
        this.addNum();
        this.addNum();
    }

    looper(callback) {
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this.length; j++) {
                callback(i, j);
            }
        }
    }

    static newArr(size) {
        let arr = new Array(size);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(size).fill(0);
        }
        return arr;
    }

    // Are the arrays diffrent?
    static compare(a, b) {
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a.length; j++) {
                if (a[i][j] !== b[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }

    static copyGrid(grid) {
        let extra = Grid.newArr(grid.length);
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                extra[i][j] = grid[i][j];
            }
        }
        return extra;
    }

    static clone(grid) {
        const g = new Grid(grid.length);
        g.grid = Grid.copyGrid(grid.grid);
        g.winAt = grid.winAt;
        g.score = grid.score;
        return g;
    }

}

// If running in a node env, export Grid
if (typeof module !== 'undefined') {
    module.exports = Grid;
}
