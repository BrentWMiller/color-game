var Tessel = require('tessel-io');
var five = require('johnny-five');

var board = new five.Board({
  io: new Tessel(),
});

var colors = ['red', 'green', 'blue', 'yellow'];

var buttons = [
  {
    port: new five.Button('a6'),
    color: 'red',
  },
  {
    port: new five.Button('a5'),
    color: 'green',
  },
  {
    port: new five.Button('a4'),
    color: 'blue',
  },
  {
    port: new five.Button('a3'),
    color: 'yellow',
  },
];

var timer;
var currentColor = '';
var score = 0;
var buttonPressed = false;
var isGameOver = false;

board.on('ready', function() {
  _initButtonEvents();
  _gameStart();
});

var _initButtonEvents = () => {
  buttons.forEach((button) => {
    button.port.on('press', () => {
      isGameOver ? _gameStart() : _checkButtonColor(button);
    });
  });
};

var _checkButtonColor = (button) => {
  // sets the button press to true and removes initial press flag.
  buttonPressed = true;

  // Calculates the score and logs it.
  score = button.color === currentColor ? (score += 1) : (score -= 1);

  if (score < 0) {
    _gameOver('Score dropped below 0');
  } else {
    console.log(`Score: ${score}`);
  }
};

var _gameStart = () => {
  // resets Game Over and score
  isGameOver = false;
  score = 0;

  // Sends start message
  console.log('Game is starting, get ready!');

  setTimeout(() => {
    // (re)starts game
    timer = setInterval(() => _randomColor(), 1750);
  }, 2000);
};

var _selectRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

var _randomColor = () => {
  // Resets the button press
  buttonPressed = false;

  // Picks a random color
  currentColor = _selectRandomColor();
  console.warn(`Press the ${currentColor} button!`);
};

var _gameOver = (message) => {
  // Set to gameover state
  isGameOver = true;

  // Show messages
  console.error(`Game over: ${message}`);
  console.log('Press any button to restart the game.');

  // Stop game timer && re-init buttons
  clearInterval(timer);
};
