/**
 * Tests for the Grid class
 */

const Grid = require('./Grid');

test('new Grid', () => {
    let a = new Grid(4);
    expect(a).toEqual({
        grid: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
        length: 4,
        winAt: 2048,
        score: 0
    });
    let b = new Grid(5);
    expect(b).toEqual({
        grid: [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],],
        length: 5,
        winAt: 2048,
        score: 0
    });

});

test('addNum', () => {
    let a = new Grid(4);
    let b = new Grid(4);
    expect(a).toEqual(b);
    a.addNum();
    expect(a).not.toEqual(b);
});

test('flip', () => {
    let grid = new Grid(4);
    grid.grid[0][0] = 8;
    grid.grid[3][0] = 4;
    let flipped = grid.flipGrid();
    expect(flipped).toEqual([[0,0,0,8],[0,0,0,0],[0,0,0,0],[0,0,0,4]]);
});

test('rotate', () => {
    let grid = new Grid(4);
    grid.grid = [[0,0,0,8],[0,0,0,0],[0,0,0,0],[0,0,0,4]];
    let rotated = grid.rotateGrid();
    expect(rotated).toEqual([[0,0,0,0],[0,0,0,0],[0,0,0,0],[8,0,0,4]]);
});

test('slide', () => {
    let grid = new Grid(4);
    grid.grid = [[0,0,0,8],[0,0,16,0],[2,0,4,0],[0,0,4,4]];
    for(let i = 0; i < grid.length; i++) {
        grid.grid[i] = grid.slide(grid.grid[i]);
    }
    expect(grid.grid).toEqual([[0,0,0,8],[0,0,0,16],[0,0,2,4],[0,0,4,4]]);
});

test('combine', () => {
    let grid = new Grid(4);
    grid.grid = [[0,2,0,8],[16,0,16,0],[2,0,4,0],[2,0,4,4]];
    for(let i = 0; i < grid.length; i++) {
        grid.grid[i] = grid.combine(grid.grid[i]);
    }
    expect(grid.grid).toEqual([[0,2,0,8],[16,0,16,0],[2,0,4,0],[2,0,0,8]]);
});

test('operate', () => {
    let grid = new Grid(4);
    grid.grid = [[0,2,0,8],[16,0,16,0],[2,0,4,0],[2,0,4,4]];
    for(let i = 0; i < grid.length; i++) {
        grid.grid[i] = grid.operate(grid.grid[i]);
    }
    expect(grid.grid).toEqual([[0,0,2,8],[0,0,0,32],[0,0,2,4],[0,0,2,8]]);
});

// Requires p5
// test('grid.draw', () => {
// });

test('failed', () => {
    let grid = new Grid(4);
    grid.grid = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
    expect(grid.failed()).toEqual(true);
});

test('success', () => {
    let grid = new Grid(4);
    grid.grid = [[0,0,0,0],[0,0,0,grid.winAt],[0,0,0,0],[0,0,0,0]];
    expect(grid.success()).toEqual(true);
});


test('restart', () => {
    let grid = new Grid(4);
    grid.grid = [[0,2,0,8],[16,0,16,0],[2,0,4,0],[2,0,4,4]];    
    grid.winAt = 4096;
    grid.score = 1337;
    grid.restart(4);
    expect(grid.grid.length).toEqual(4);
    expect(grid.grid).not.toEqual([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    expect(grid.score).toEqual(0);
});

test('looper', () => {
    let grid = new Grid(4);
    let counter = 0;
    grid.looper(() => {
        counter++;
    });
    expect(counter).toEqual(16);
});

test('Grid.newArr', () => {
    let arr = Grid.newArr(10);
    let len = 0;
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr[i].length; j++) {
            len++;
        }
    }
    expect(len).toEqual(100);
});

test('Grid.compare', () => {
    let a = new Grid(4);
    let b = new Grid(4);
    expect(a).toEqual(b);
    a.grid[1][3] = 4;
    b.grid[2][0] = 16;
    expect(a).not.toEqual(b);
});

test('Gird.copyGrid', () => {
    let a = new Grid(4);
    a.grid = [[0,2,0,8],[16,0,16,0],[2,0,4,0],[2,0,4,4]];
    let b = Grid.copyGrid(a.grid);
    expect(a.grid).toEqual(b);
    a.grid = [[0,2,0,8],[16,2,16,0],[2,0,4,0],[2,0,4,8]];
    expect(a.grid).not.toEqual(b);
});
