/**
 *	github.com/olback/2048
 *	twitter.com/mrolback
 */

// Define some global variables
let grid;
let score = 0;
let scoreLabel;
let gridSizeP;
let gridSizeSlider;
let winAtP;
let winAtSlider;

function setup() {

	createCanvas(500, 500); // Create canvas

	// Select elements
	modal = select('#modal');
	endedText = select('#game-ended-text');
	scoreLabel = select('#score');

	// Grid size
	gridSizeP = createP('Grid size: 4x4');
	gridSizeSlider = createSlider(3, 12, 4, 1);
	gridSizeSlider.attribute('list', 'sizes');

	// Win at score
	winAtP = createP('<br/>Win at tile-size: 2048');
	winAtSlider = createSlider(4, 15, 11, 1);
	winAtSlider.attribute('list', 'scores');

	// Display info text
	createP('<br/><br/>Click &lt;space&gt; to restart and apply changes.');

	// Enable touch
	initTouch();

	// Create the grid with slider value
	grid = new Grid(gridSizeSlider.value()); // Default size: 4

	// Add two random numbers at the start of every game
	grid.addNum();
	grid.addNum();

}

function draw() {

	background(255); // White background
	noFill();
	stroke(0); // Set stroke color to black
	strokeWeight(2); // Set stroke wigth/thickness to 2

	grid.winAt = pow(2, winAtSlider.value());
	gridSizeP.html('Grid size: ' + gridSizeSlider.value() + 'x' + gridSizeSlider.value());
	winAtP.html('<br/>Win at tile-size: ' + grid.winAt);
	scoreLabel.html('Score: ' + grid.score);

	grid.draw(); // Draw the grid

}

function keyPressed(arg) {

	// keyCode is predefined in p5, but overwrite if function recieves an argument
	if (typeof arg == 'number') {
		keyCode = arg;
	}

	// TODO: Shold be stored in the grid object as they are specific to that grid.
	let flipped = false;
	let rotated = false;
	let played = true;

	// Do diffrent things for diffrent keys
	switch (keyCode) {

		case UP_ARROW:
			grid.flipGrid();
			flipped = true;
			break;

		case RIGHT_ARROW:
			grid.rotateGrid();
			rotated = true;
			break;

		case DOWN_ARROW:
			// Do nothing, no need to flip or rotate the grid.
			break;

		case LEFT_ARROW:
			grid.rotateGrid();
			grid.flipGrid();
			rotated = true;
			flipped = true;
			break;

		case 32: // Space key
			played = false;
			grid.restart(gridSizeSlider.value());
			select('#modal').hide();
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

		// If the grid was flipped, flip it back
		if (flipped) {
			grid.flipGrid();
		}

		// If the grid was rotated, rotate it back to the original orientation
		if (rotated) {
			grid.rotateGrid();
			grid.rotateGrid();
			grid.rotateGrid();
		}

		// If something moved on the grid, add a new number to an empty tile
		if (moved) {
			grid.addNum();
		}
	}

	// If there are no possible moves, end the game
	if (grid.failed()) {
		console.log('Game over!');
		select('#modal').show();
		select('#game-ended-text').html('Aww :(<br/>You scored ' + grid.score + ' points!');
	}

	// If the winAt value is reached in a tile, end the game
	if (grid.success()) {
		console.log('You made it to ' + grid.winAt + '!');
		select('#modal').show();
		select('#game-ended-text').html('Congratulations!<br/> You scored ' + grid.score + ' points and made it to ' + grid.winAt + '!');
	}

}

// Handle touch events for mobile/tablet devices
let t = {
	sX: 0,
	sY: 0,
	eX: 0,
	eY: 0,
	dist: 50
}

function initTouch() {

	const gestureZone = document.getElementsByTagName('canvas')[0];

	gestureZone.addEventListener('touchstart', function (event) {
		t.sX = event.changedTouches[0].screenX;
		t.sY = event.changedTouches[0].screenY;
	}, false);

	gestureZone.addEventListener('touchend', function (event) {
		t.eX = event.changedTouches[0].screenX;
		t.eY = event.changedTouches[0].screenY;
		handleGesture();
	}, false);

	function handleGesture() {
		if (t.sX - t.eX > t.dist) {
			keyPressed(LEFT_ARROW);
		} else if (t.eX - t.sX > t.dist) {
			keyPressed(RIGHT_ARROW);
		} else if (t.sY - t.eY > t.dist) {
			keyPressed(UP_ARROW);
		} else if (t.eY - t.sY > t.dist) {
			keyPressed(DOWN_ARROW);
		}
	}

}
