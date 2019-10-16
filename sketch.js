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
let ai;

let ENABLE_AI = false;

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
	ai = new Ai(grid, 10);

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

	if (ENABLE_AI) {
		ai.makeMove();
	}

	grid.draw(); // Draw the grid

		// If there are no possible moves, end the game
	if (grid.failed()) {
		noLoop();
		console.log('Game over!');
		select('#modal').show();
		select('#game-ended-text').html('Aww :(<br/>You scored ' + grid.score + ' points!');
	}

	// If the winAt value is reached in a tile, end the game
	if (grid.success()) {
		noLoop();
		console.log('You made it to ' + grid.winAt + '!');
		select('#modal').show();
		select('#game-ended-text').html('Congratulations!<br/> You scored ' + grid.score + ' points and made it to ' + grid.winAt + '!');
	}

}

function keyPressed(arg) {

	// keyCode is predefined in p5, but overwrite if function recieves an argument
	if (typeof arg == 'number') {
		keyCode = arg;
	}

	// Do diffrent things for diffrent keys
	switch (keyCode) {

		case UP_ARROW:
			grid.makeMove('up');
			break;

		case RIGHT_ARROW:
			grid.makeMove('right');
			break;

		case DOWN_ARROW:
			grid.makeMove('down');
			break;

		case LEFT_ARROW:
			grid.makeMove('left');
			break;

		case 32: // Space key
			loop();
			grid.restart(gridSizeSlider.value());
			select('#modal').hide();
			break;

		default:
			break;

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

function newGameButton() {
	loop();
	grid.restart(gridSizeSlider.value());
	select('#modal').hide();
}
