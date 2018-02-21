
let grid;
let score = 0;
let scoreLabel;
let gridSizeP;
let gridSizeSlider;
let winAtP;
let winAtSlider;

function setup() {

	createCanvas(500, 500);

	// Select elements
	modal = select('#modal');
	endedText = select('#game-ended-text');
	scoreLabel = select('#score');

	// Grid size
	gridSizeP = createP('Grid size: 4x4');
	gridSizeSlider = createSlider(3, 12, 4, 1);
	gridSizeSlider.attribute('list', 'sizes');

	// Win at score
	winAtP = createP('<br/>Win at score: 2048');
	winAtSlider = createSlider(4, 15, 11, 1);
	winAtSlider.attribute('list', 'scores');

	// Display info text
	createP('<br/><br/>Click &lt;space&gt; to restart and apply changes.');

	// Create the grid with slider value
	grid = new Grid(gridSizeSlider.value()); // Default size: 4

	// Add two random numbers at the start of every game
	grid.addNum();
	grid.addNum();

}

function draw() {

	background(255);
	noFill();
	stroke(0);
	strokeWeight(2);

	grid.winAt = pow(2, winAtSlider.value());
	gridSizeP.html('Grid size: ' + gridSizeSlider.value() + 'x' + gridSizeSlider.value());
	winAtP.html('<br/>Win at score: ' + grid.winAt);
	scoreLabel.html('Score: ' + grid.score);

	grid.draw();

}

function keyPressed() {

	let flipped = false;
	let rotated = false;
	let played = true;

	switch (keyCode) {

		case UP_ARROW:
			grid.grid = grid.flipGrid();
			flipped = true;
			break;

		case RIGHT_ARROW:
			grid.grid = grid.rotateGrid();
			rotated = true;
			break;

		case DOWN_ARROW:
			// Move down
			// Do nothing
			break;

		case LEFT_ARROW:
			grid.grid = grid.rotateGrid();
			grid.grid = grid.flipGrid();
			rotated = true;
			flipped = true;
			break;

		case 32: // Space key
			played = false;
			grid.restart(gridSizeSlider.value());
			break;

		default:
			played = false;
			break;

	}

	if (played) {
		let past = Grid.copyGrid(grid.grid);
		for (let i = 0; i < grid.length; i++) {
			grid.grid[i] = grid.operate(grid.grid[i]);
		}
		let moved = Grid.compare(past, grid.grid);

		if (flipped) {
			grid.grid = grid.flipGrid();
		}
		if (rotated) {
			grid.grid = grid.rotateGrid();
			grid.grid = grid.rotateGrid();
			grid.grid = grid.rotateGrid();
		}

		if (moved) {
			grid.addNum();
		}
	}

	if (grid.failed()) {
		console.log('Game over!');
		select('#modal').show();
		select('#game-ended-text').html('Aww :(<br/>You scored ' + grid.score + ' points!');
	}

	if (grid.success()) {
		console.log('You made it to ' + grid.winAt + '!');
		select('#modal').show();
		select('#game-ended-text').html('Congratulations!<br/> You scored ' + grid.score + ' points and made it to ' + grid.winAt +'!');
	}

}
