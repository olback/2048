

/**
 * @typedef {import('./Grid')} Grid
 */

class Ai {

    /**
     * @param {Grid} grid
     * @param {number} depth
     */
    constructor(grid, depth) {
        this.grid = grid;
        this.depth = depth;
    }

    /**
     * @param {number} n
     */
    moveName(n) {
        return [
            'up',
            'down',
            'left',
            'right'
        ][n];
    }

    makeMove() {

        // If there are no possible moves, just return;
        if (this.grid.failed()) {
            ENABLE_AI = false;
            return;
        }

        let res = this.aiGetBest();
        this.grid.makeMove(this.moveName(res.move));

    }

    getBestMove() {

        // console.log('getBestMove'); 

        let bestScore = 0;
        let bestMove = -1;

        for (let i = 0; i < 4; i++) {

            let res = this.multiRandomRun(i);
            let score = res.score;

            if (score >= bestScore) {
                bestScore = score;
                bestMove = i;
            }

        }

        if (this.grid.failed()) {
            // console.log('Failed?');
        }

        return {
            move: bestMove,
            score: bestScore
        }

    }

    multiRandomRun(dir) {

        // console.log('multiRandomRun');

        let total = 0.0;
        let min = 1000000;
        let max = 0;
        // let totalMoves = 0;

        for (let i = 0; i < this.depth; i++) {

            let res = this.randomRun(dir);
            let s = res.score;

            // TODO:
            if (s === -1) {
                return -1;
            }

            total += s;
            // totalMoves += res.moves;

            if (s < min) min = s;
            if (s > max) max = s;

        }

        let avg = total / this.depth;

        return {
            score: avg
        }

    }

    randomRun(dir) {

        // console.log('randomRun');

        /**
         * @type {import('./Grid')} g
         */
        const g = Grid.clone(this.grid);
        let score = 0;
        let res = this.moveAndAddRandomTiles(dir);

        if (!Grid.compare(g.grid, res.grid)) {
            return -1;
        }

        score += res.score;

        let moves = 1;
        // while(true) {
        for (let r = 0; r < this.depth; r++) {

            if (g.failed()) {
                break;
            }

            /**
             * @type {import('./Grid')} g
             */
            let gl = Grid.clone(g);
            let res = gl.makeMove(this.moveName(Math.floor(Math.random() * 4)));
            if (!Grid.compare(gl.grid, res.grid)) {
                continue;
            }

            score += (res.score - gl.score);
            // g.addNum();
            moves++;

        }

        return {
            score: score,
            moves: moves
        }

    }

    moveAndAddRandomTiles(dir) {

        // console.log('moveAndAddRandomTiles');

        let g = Grid.clone(this.grid);
        let res = g.makeMove(this.moveName(dir))
        return res;
    }

    aiGetBest() {
        // console.log('aiGetBest');
        return this.getBestMove();
    }

}
