const readline = require('readline-sync');

const gridSize = 10;
const ships = [
  { name: '2-unit', size: 2, count: 1 },
  { name: '3-unit', size: 3, count: 2 },
  { name: '4-unit', size: 4, count: 1 },
  { name: '5-unit', size: 5, count: 1 }
];

let grid = [];
let shipCount = ships.length;

function buildGrid(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ' '));
}

function getRandomPosition(size) {
  return Math.floor(Math.random() * size);
}

function placeShip(shipSize) {
  const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
  let row, col;

  if (direction === 'horizontal') {
    row = getRandomPosition(gridSize);
    col = getRandomPosition(gridSize - shipSize + 1);
  } else {
    row = getRandomPosition(gridSize - shipSize + 1);
    col = getRandomPosition(gridSize);
  }

  for (let i = 0; i < shipSize; i++) {
    if (direction === 'horizontal') {
      if (grid[row][col + i] !== ' ') return false;
    } else {
      if (grid[row + i][col] !== ' ') return false;
    }
  }

  for (let i = 0; i < shipSize; i++) {
    if (direction === 'horizontal') {
      grid[row][col + i] = 'S';
    } else {
      grid[row + i][col] = 'S';
    }
  }

  return true;
}

function placeShips() {
  grid = buildGrid(gridSize);

  for (let ship of ships) {
    for (let i = 0; i < ship.count; i++) {
      let success = false;
      while (!success) {
        success = placeShip(ship.size);
      }
    }
  }
}

function printGrid() {
  console.log('   A B C D E F G H I J');
  for (let i = 0; i < gridSize; i++) {
    let row = (i + 1).toString().padStart(2, ' ');
    for (let j = 0; j < gridSize; j++) {
      row += ' ' + grid[i][j];
    }
    console.log(row);
  }
}

function checkHit(row, col) {
  if (grid[row][col] === 'S') {
    grid[row][col] = 'X';
    shipCount--;
    console.log(`Hit. You have sunk a battleship. ${shipCount} ship${shipCount === 1 ? '' : 's'} remaining.`);
  } else if (grid[row][col] === 'X') {
    console.log('You have already picked this location. Miss!');
  } else {
    grid[row][col] = 'O';
    console.log('You have missed!');
  }
}

function playAgain() {
  const answer = readline.question('Would you like to play again? (Y/N): ');
  return answer.toUpperCase() === 'Y';
}

function playGame() {
  console.log('Press any key to start the game.');
  readline.keyIn();

  placeShips();

  let gameOver = false;
  while (!gameOver) {
    printGrid();

    const location = readline.question('Enter a location to strike (e.g., A2): ');
    const row = parseInt(location[1]) - 1;
    const col = location.charCodeAt(0) - 65;

    if (isNaN(row) || row < 0 || row >= gridSize || isNaN(col) || col < 0 || col >= gridSize) {
      console.log('Invalid location. Please try again.');
      continue;
    }

    checkHit(row, col);

    if (shipCount === 0) {
      console.log('You have destroyed all battleships.');
      if (playAgain()) {
        placeShips();
        shipCount = ships.length;
      } else {
        gameOver = true;
      }
    }
  }
}

playGame();
